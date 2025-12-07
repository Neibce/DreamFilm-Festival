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
    public ResponseEntity<List<FilmListResponse>> getFilmsForAdmin(HttpSession session) {
        UserRole role = (UserRole) session.getAttribute("userRole");
        if (role != UserRole.ADMIN) {
            throw new IllegalStateException("관리자만 조회할 수 있습니다.");
        }

        List<DreamFilm> films = dreamFilmService.getFilmsForAdmin();
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
        String normalizedSearch = search != null ? search.trim().toLowerCase() : "";
        String normalizedGenre = genre != null ? genre.trim() : "";

        List<FilmFestival> ongoingFestivals = filmFestivalService.getOngoingFestivals();
        if (ongoingFestivals.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        List<Long> festivalIds = ongoingFestivals.stream()
                .map(FilmFestival::getFestivalId)
                .toList();

        List<DreamFilm> films = festivalIds.stream()
                .flatMap(id -> dreamFilmService.getSubmittedFilmsByFestival(id).stream())
                .toList();

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

        List<DreamFilm> filteredFilms = films.stream()
                .filter(film -> matchesGenre(film, normalizedGenre))
                .filter(film -> matchesSearch(film, directorMap.get(film.getDirectorId()), normalizedSearch))
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
        DreamFilm film = dreamFilmService.approveByDirector(filmId, userId);
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

    private boolean matchesSearch(DreamFilm film, DirectorSummaryResponse director, String searchKeyword) {
        if (searchKeyword == null || searchKeyword.isBlank()) {
            return true;
        }
        String title = film.getTitle() != null ? film.getTitle().toLowerCase() : "";
        String directorName = (director != null && director.username() != null)
                ? director.username().toLowerCase()
                : "";
        return title.contains(searchKeyword) || directorName.contains(searchKeyword);
    }
}


