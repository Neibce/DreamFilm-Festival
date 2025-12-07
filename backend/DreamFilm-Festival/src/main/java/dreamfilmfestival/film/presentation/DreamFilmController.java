package dreamfilmfestival.film.presentation;

import dreamfilmfestival.festival.application.FilmFestivalService;
import dreamfilmfestival.festival.domain.FilmFestival;
import dreamfilmfestival.film.application.DreamFilmService;
import dreamfilmfestival.film.application.FilmQueryService;
import dreamfilmfestival.film.application.FilmStats;
import dreamfilmfestival.film.domain.DreamFilm;
import dreamfilmfestival.film.presentation.dto.CreateFilmRequest;
import dreamfilmfestival.film.presentation.dto.CreateFilmResponse;
import dreamfilmfestival.film.presentation.dto.DirectorSummaryResponse;
import dreamfilmfestival.film.presentation.dto.FilmDetailResponse;
import dreamfilmfestival.film.presentation.dto.FilmDtoMapper;
import dreamfilmfestival.film.presentation.dto.FilmListResponse;
import dreamfilmfestival.film.presentation.dto.UpdateFilmImageRequest;
import dreamfilmfestival.user.domain.UserRole;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/films")
@RequiredArgsConstructor
public class DreamFilmController {
    private final DreamFilmService dreamFilmService;
    private final FilmQueryService filmQueryService;
    private final FilmDtoMapper filmDtoMapper;
    private final FilmFestivalService filmFestivalService;

    @PostMapping
    public ResponseEntity<CreateFilmResponse> createFilm(
            @Valid @RequestBody CreateFilmRequest request,
            HttpSession session) {
        // 세션에서 로그인한 사용자 ID 및 역할 가져오기
        Long directorId = (Long) session.getAttribute("userId");
        UserRole userRole = (UserRole) session.getAttribute("userRole");
        
        if (directorId == null || userRole == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }
        
        // 감독 또는 관객 역할만 출품 가능
        if (userRole != UserRole.DIRECTOR && userRole != UserRole.AUDIENCE) {
            throw new IllegalArgumentException("영화 출품은 감독 또는 관객만 가능합니다.");
        }

        // DTO -> 도메인 파라미터 변환 (Presentation Layer 책임)
        DreamFilm film = dreamFilmService.createFilm(
                directorId,
                request.title(),
                request.dreamText(),
                request.genre(),
                request.mood(),
                request.themes(),
                request.targetAudience()
        );
        CreateFilmResponse response = filmDtoMapper.toCreateFilmResponse(film);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<FilmListResponse>> getSubmittedFilms() {
        List<DreamFilm> films = dreamFilmService.getSubmittedFilms();
        List<DirectorSummaryResponse> directors = films.stream()
                .map(f -> dreamFilmService.getDirector(f.getDirectorId())
                        .map(d -> DirectorSummaryResponse.from(d.getUserId(), d.getUsername(), d.getEmail(), d.getRole().name()))
                        .orElse(null))
                .collect(Collectors.toList());
        Map<Long, FilmStats> statsByFilmId = films.stream()
                .collect(Collectors.toMap(DreamFilm::getFilmId, film -> filmQueryService.getFilmStats(film.getFilmId())));
        List<FilmListResponse> response = filmDtoMapper.toFilmListResponseList(films, directors, statsByFilmId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin")
    public ResponseEntity<List<FilmDetailResponse>> getFilmsForAdmin(HttpSession session) {
        UserRole role = (UserRole) session.getAttribute("userRole");
        if (role != UserRole.ADMIN) {
            throw new IllegalStateException("관리자만 조회할 수 있습니다.");
        }

        List<DreamFilm> films = dreamFilmService.getFilmsForAdmin();
        Map<Long, FilmStats> statsByFilmId = films.stream()
                .collect(Collectors.toMap(DreamFilm::getFilmId, film -> filmQueryService.getFilmStats(film.getFilmId())));

        List<FilmDetailResponse> response = films.stream()
                .map(film -> {
                    var director = dreamFilmService.getDirector(film.getDirectorId());
                    String directorName = director.map(d -> d.getUsername()).orElse(null);
                    DirectorSummaryResponse directorSummary = director
                            .map(d -> DirectorSummaryResponse.from(d.getUserId(), d.getUsername(), d.getEmail(), d.getRole().name()))
                            .orElse(null);
                    FilmStats stats = statsByFilmId.getOrDefault(film.getFilmId(), new FilmStats(0, 0, 0.0));
                    return FilmDetailResponse.of(
                            film,
                            directorName,
                            directorSummary,
                            stats.voteCount(),
                            stats.reviewCount(),
                            stats.averageRating()
                    );
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{filmId}")
    public ResponseEntity<FilmDetailResponse> getFilmDetail(@PathVariable Long filmId) {
        return dreamFilmService.getFilm(filmId)
                .map(this::toDetailResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/ongoing")
    public ResponseEntity<List<FilmListResponse>> getFilmsForOngoingFestivals(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String genre
    ) {
        String normalizedSearch = search != null ? search.trim() : "";
        String normalizedGenre = genre != null ? genre.trim() : "";

        List<FilmFestival> ongoingFestivals = filmFestivalService.getOngoingFestivals();
        if (ongoingFestivals.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        List<Long> festivalIds = ongoingFestivals.stream()
                .map(FilmFestival::getFestivalId)
                .toList();

        // LIKE 쿼리를 사용한 검색 (검색어가 있는 경우)
        List<DreamFilm> films;
        if (!normalizedSearch.isBlank()) {
            // DB에서 LIKE 쿼리로 제목 검색
            films = dreamFilmService.searchFilmsByTitle(normalizedSearch).stream()
                    .filter(film -> festivalIds.contains(film.getFestivalId()))
                    .filter(film -> film.getStatus() == dreamfilmfestival.film.domain.FilmStatus.SUBMITTED)
                    .toList();
        } else {
            // 검색어가 없으면 모든 영화 조회
            films = festivalIds.stream()
                    .flatMap(id -> dreamFilmService.getSubmittedFilmsByFestival(id).stream())
                    .toList();
        }

        List<DirectorSummaryResponse> directors = films.stream()
                .map(f -> dreamFilmService.getDirector(f.getDirectorId())
                        .map(d -> DirectorSummaryResponse.from(d.getUserId(), d.getUsername(), d.getEmail(), d.getRole().name()))
                        .orElse(null))
                .collect(Collectors.toList());

        Map<Long, DirectorSummaryResponse> directorMap = directors.stream()
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toMap(
                        DirectorSummaryResponse::directorId,
                        d -> d,
                        (existing, ignored) -> existing
                ));

        // 장르 필터링만 Java에서 수행
        List<DreamFilm> filteredFilms = films.stream()
                .filter(film -> matchesGenre(film, normalizedGenre))
                .toList();

        List<DirectorSummaryResponse> filteredDirectors = filteredFilms.stream()
                .map(film -> directorMap.get(film.getDirectorId()))
                .collect(Collectors.toList());

        Map<Long, FilmStats> statsByFilmId = filteredFilms.stream()
                .collect(Collectors.toMap(
                        DreamFilm::getFilmId,
                        film -> filmQueryService.getFilmStats(film.getFilmId())
                ));

        return ResponseEntity.ok(filmDtoMapper.toFilmListResponseList(filteredFilms, filteredDirectors, statsByFilmId));
    }

    @GetMapping("/director/{directorId}")
    public ResponseEntity<List<FilmListResponse>> getFilmsByDirectorId(@PathVariable Long directorId) {
        List<DreamFilm> films = dreamFilmService.getFilmsByDirector(directorId);
        List<DirectorSummaryResponse> directors = films.stream()
                .map(f -> dreamFilmService.getDirector(f.getDirectorId())
                        .map(d -> DirectorSummaryResponse.from(d.getUserId(), d.getUsername(), d.getEmail(), d.getRole().name()))
                        .orElse(null))
                .collect(Collectors.toList());
        Map<Long, FilmStats> statsByFilmId = films.stream()
                .collect(Collectors.toMap(DreamFilm::getFilmId, film -> filmQueryService.getFilmStats(film.getFilmId())));
        return ResponseEntity.ok(filmDtoMapper.toFilmListResponseList(films, directors, statsByFilmId));
    }

    @GetMapping("/me")
    public ResponseEntity<List<FilmListResponse>> getMyFilms(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }
        List<DreamFilm> films = dreamFilmService.getFilmsByDirector(userId);
        List<DirectorSummaryResponse> directors = films.stream()
                .map(f -> dreamFilmService.getDirector(f.getDirectorId())
                        .map(d -> DirectorSummaryResponse.from(d.getUserId(), d.getUsername(), d.getEmail(), d.getRole().name()))
                        .orElse(null))
                .collect(Collectors.toList());
        Map<Long, FilmStats> statsByFilmId = films.stream()
                .collect(Collectors.toMap(DreamFilm::getFilmId, film -> filmQueryService.getFilmStats(film.getFilmId())));
        return ResponseEntity.ok(filmDtoMapper.toFilmListResponseList(films, directors, statsByFilmId));
    }

    @PostMapping("/{filmId}/user-approve")
    public ResponseEntity<FilmDetailResponse> approveByDirector(
            @PathVariable Long filmId,
            HttpSession session
    ) {
        Long userId = (Long) session.getAttribute("userId");
        UserRole userRole = (UserRole) session.getAttribute("userRole");
        if (userId == null || userRole == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        DreamFilm film = dreamFilmService.approveByDirector(filmId, userId);

        // 관객이 승인 시 세션 역할도 감독으로 승격
        if (userRole == UserRole.AUDIENCE) {
            session.setAttribute("userRole", UserRole.DIRECTOR);
        }
        return ResponseEntity.ok(toDetailResponse(film));
    }

    @PostMapping("/{filmId}/user-deny")
    public ResponseEntity<FilmDetailResponse> denyByDirector(
            @PathVariable Long filmId,
            HttpSession session
    ) {
        Long userId = (Long) session.getAttribute("userId");
        DreamFilm film = dreamFilmService.denyByDirector(filmId, userId);
        return ResponseEntity.ok(toDetailResponse(film));
    }

    @PostMapping("/{filmId}/admin-approve")
    public ResponseEntity<FilmDetailResponse> approveByAdmin(
            @PathVariable Long filmId,
            HttpSession session
    ) {
        UserRole role = (UserRole) session.getAttribute("userRole");
        if (role != UserRole.ADMIN) {
            throw new IllegalStateException("관리자만 승인할 수 있습니다.");
        }
        DreamFilm film = dreamFilmService.approveByAdmin(filmId);
        return ResponseEntity.ok(toDetailResponse(film));
    }

    @PostMapping("/{filmId}/admin-reject")
    public ResponseEntity<FilmDetailResponse> rejectByAdmin(
            @PathVariable Long filmId,
            HttpSession session
    ) {
        UserRole role = (UserRole) session.getAttribute("userRole");
        if (role != UserRole.ADMIN) {
            throw new IllegalStateException("관리자만 반려할 수 있습니다.");
        }
        DreamFilm film = dreamFilmService.rejectByAdmin(filmId);
        return ResponseEntity.ok(toDetailResponse(film));
    }

    @PatchMapping("/{filmId}/image")
    public ResponseEntity<FilmDetailResponse> updateImage(
            @PathVariable Long filmId,
            @Valid @RequestBody UpdateFilmImageRequest request
    ) {
        DreamFilm film = dreamFilmService.updateImage(filmId, request.imageUrl());
        return ResponseEntity.ok(toDetailResponse(film));
    }

    private FilmDetailResponse toDetailResponse(DreamFilm film) {
        Long filmId = film.getFilmId();
        FilmStats stats = filmQueryService.getFilmStats(filmId);
        var director = dreamFilmService.getDirector(film.getDirectorId());
        String directorName = director.map(d -> d.getUsername()).orElse(null);
        DirectorSummaryResponse directorSummary = director
                .map(d -> DirectorSummaryResponse.from(d.getUserId(), d.getUsername(), d.getEmail(), d.getRole().name()))
                .orElse(null);

        return FilmDetailResponse.of(
                film,
                directorName,
                directorSummary,
                stats.voteCount(),
                stats.reviewCount(),
                stats.averageRating()
        );
    }

    private boolean matchesGenre(DreamFilm film, String genre) {
        if (genre == null || genre.isBlank() || "전체".equalsIgnoreCase(genre)) {
            return true;
        }
        String filmGenre = film.getGenre() != null ? film.getGenre() : "";
        return filmGenre.equalsIgnoreCase(genre);
    }

    // LEFT JOIN API - 영화 + 감독 정보 조회
    @GetMapping("/with-director")
    public ResponseEntity<List<FilmWithDirectorResponse>> getFilmsWithDirector() {
        var films = dreamFilmService.getFilmsWithDirector();
        var responses = films.stream()
                .map(f -> new FilmWithDirectorResponse(
                        f.filmId(), f.title(), f.genre(), f.status(), f.imageUrl(),
                        f.createdAt().toString(), f.directorName(), f.directorEmail()
                ))
                .toList();
        return ResponseEntity.ok(responses);
    }

    // View API - 영화 상세 정보 조회 (v_film_details)
    @GetMapping("/{filmId}/view-details")
    public ResponseEntity<FilmDetailsViewResponse> getFilmDetailsFromView(@PathVariable Long filmId) {
        return dreamFilmService.getFilmDetailsFromView(filmId)
                .map(v -> new FilmDetailsViewResponse(
                        v.filmId(), v.title(), v.genre(), v.status(), v.imageUrl(),
                        v.directorName(), v.voteCount(), v.avgRating()
                ))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // View API - 영화 랭킹 조회 (v_film_ranking)
    @GetMapping("/ranking")
    public ResponseEntity<List<FilmRankingViewResponse>> getFilmRanking(
            @RequestParam(defaultValue = "10") int limit
    ) {
        var ranking = dreamFilmService.getFilmRankingFromView(limit);
        var responses = ranking.stream()
                .map(r -> new FilmRankingViewResponse(
                        r.filmId(), r.title(), r.genre(), r.judgeScore(), r.voteCount()
                ))
                .toList();
        return ResponseEntity.ok(responses);
    }

    public record FilmWithDirectorResponse(
            Long filmId, String title, String genre, String status, String imageUrl,
            String createdAt, String directorName, String directorEmail
    ) {}

    public record FilmDetailsViewResponse(
            Long filmId, String title, String genre, String status, String imageUrl,
            String directorName, int voteCount, double avgRating
    ) {}

    public record FilmRankingViewResponse(
            Long filmId, String title, String genre, double judgeScore, int voteCount
    ) {}
}


