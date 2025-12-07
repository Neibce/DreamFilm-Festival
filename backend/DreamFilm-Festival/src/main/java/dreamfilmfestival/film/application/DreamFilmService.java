package dreamfilmfestival.film.application;

import dreamfilmfestival.film.domain.DreamFilm;
import dreamfilmfestival.film.domain.DreamFilmRepository;
import dreamfilmfestival.film.domain.FilmGenre;
import dreamfilmfestival.film.domain.FilmStatus;
import dreamfilmfestival.film.domain.event.FilmCreatedEvent;
import dreamfilmfestival.festival.domain.FilmFestival;
import dreamfilmfestival.festival.domain.FilmFestivalRepository;
import dreamfilmfestival.user.domain.User;
import dreamfilmfestival.user.domain.UserRole;
import dreamfilmfestival.user.application.UserService;
import dreamfilmfestival.user.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DreamFilmService {
    private final DreamFilmRepository dreamFilmRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final UserRepository userRepository;
    private final FilmFestivalRepository filmFestivalRepository;
    private final UserService userService;

    @Transactional
    public DreamFilm createFilm(Long directorId, String title, String dreamText, String genre, String mood, String themes, String targetAudience) {
        // DreamFilm 생성 (AI 생성 대기 상태)
        String normalizedGenre = FilmGenre.from(genre).getLabel();
        Long resolvedFestivalId = resolveFestivalId();
        DreamFilm film = DreamFilm.create(resolvedFestivalId, directorId, title, dreamText, normalizedGenre);

        DreamFilm savedFilm = dreamFilmRepository.save(film);

        // 도메인 이벤트 발행 (AI 시나리오 생성)
        eventPublisher.publishEvent(new FilmCreatedEvent(
                savedFilm.getFilmId(),
                savedFilm.getTitle(),
                savedFilm.getDreamText(),
                normalizedGenre,
                mood,
                themes
        ));

        return savedFilm;
    }

    @Transactional(readOnly = true)
    public List<DreamFilm> getSubmittedFilms() {
        return dreamFilmRepository.findByStatus(FilmStatus.SUBMITTED);
    }

    @Transactional(readOnly = true)
    public List<DreamFilm> getFilmsForAdmin() {
        return dreamFilmRepository.findAll().stream()
                .filter(film -> film.getStatus() == FilmStatus.WAITING_ADMIN_APPROVAL
                        || film.getStatus() == FilmStatus.SUBMITTED
                        || film.getStatus() == FilmStatus.REJECTED)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DreamFilm> getSubmittedFilmsByFestival(Long festivalId) {
        return dreamFilmRepository.findByFestivalId(festivalId).stream()
                .filter(f -> f.getStatus() == FilmStatus.SUBMITTED)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<DreamFilm> getFilm(Long filmId) {
        return dreamFilmRepository.findById(filmId);
    }

    @Transactional(readOnly = true)
    public List<DreamFilm> getFilmsByDirector(Long directorId) {
        return dreamFilmRepository.findByDirectorId(directorId);
    }

    @Transactional
    public DreamFilm approveByDirector(Long filmId, Long directorId) {
        DreamFilm film = dreamFilmRepository.findById(filmId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 영화입니다."));
        film.approveByDirector(directorId);

        // 관객이 출품을 확정하면 자동으로 감독으로 역할 변경
        User user = userRepository.findById(directorId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        if (user.getRole() == UserRole.AUDIENCE) {
            userService.updateRole(directorId, UserRole.DIRECTOR);
        }

        return dreamFilmRepository.save(film);
    }

    @Transactional
    public DreamFilm denyByDirector(Long filmId, Long directorId) {
        DreamFilm film = dreamFilmRepository.findById(filmId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 영화입니다."));
        film.denyByDirector(directorId);
        return dreamFilmRepository.save(film);
    }

    @Transactional
    public DreamFilm approveByAdmin(Long filmId) {
        DreamFilm film = dreamFilmRepository.findById(filmId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 영화입니다."));
        film.approveByAdmin();
        return dreamFilmRepository.save(film);
    }

    @Transactional
    public DreamFilm rejectByAdmin(Long filmId) {
        DreamFilm film = dreamFilmRepository.findById(filmId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 영화입니다."));
        film.rejectByAdmin();
        return dreamFilmRepository.save(film);
    }

    @Transactional
    public DreamFilm updateImage(Long filmId, String imageUrl) {
        DreamFilm film = dreamFilmRepository.findById(filmId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 영화입니다."));
        film.updateImageUrl(imageUrl);
        return dreamFilmRepository.save(film);
    }

    @Transactional(readOnly = true)
    public Optional<User> getDirector(Long directorId) {
        if (directorId == null) return Optional.empty();
        return userRepository.findById(directorId);
    }

    // LEFT JOIN - 영화 + 감독 정보 조회
    @Transactional(readOnly = true)
    public List<DreamFilmRepository.FilmWithDirector> getFilmsWithDirector() {
        return dreamFilmRepository.findAllWithDirector();
    }

    // View 활용 - 영화 상세 정보 조회 (v_film_details)
    @Transactional(readOnly = true)
    public Optional<DreamFilmRepository.FilmDetailsView> getFilmDetailsFromView(Long filmId) {
        return dreamFilmRepository.findFilmDetailsFromView(filmId);
    }

    // View 활용 - 영화 랭킹 조회 (v_film_ranking)
    @Transactional(readOnly = true)
    public List<DreamFilmRepository.FilmRankingView> getFilmRankingFromView(int limit) {
        return dreamFilmRepository.findRankingFromView(limit);
    }

    private Long resolveFestivalId() {
        return filmFestivalRepository.findOngoingFestivals().stream()
                .findFirst()
                .map(FilmFestival::getFestivalId)
                .orElseThrow(() -> new IllegalStateException("진행 중인 영화제가 없어 출품할 수 없습니다."));
    }
}

