package dreamfilmfestival.film.domain;

import java.util.List;
import java.util.Optional;

public interface DreamFilmRepository {
    DreamFilm save(DreamFilm film);
    Optional<DreamFilm> findById(Long filmId);
    List<DreamFilm> findAll();
    List<DreamFilm> findByFestivalId(Long festivalId);
    List<DreamFilm> findByDirectorId(Long directorId);
    List<DreamFilm> findByStatus(FilmStatus status);
    void deleteById(Long filmId);
    
    // LIKE 쿼리 - 제목 또는 감독 이름으로 영화 검색
    List<DreamFilm> findByTitleOrDirectorContaining(String keyword);

    // LEFT JOIN - 영화 + 감독 정보 조회
    List<FilmWithDirector> findAllWithDirector();

    // View 활용 - 영화 상세 정보 조회 (v_film_details)
    Optional<FilmDetailsView> findFilmDetailsFromView(Long filmId);

    // View 활용 - 영화 랭킹 조회 (v_film_ranking)
    List<FilmRankingView> findRankingFromView(int limit);

    record FilmWithDirector(
            Long filmId, String title, String genre, String status, String imageUrl,
            java.time.LocalDateTime createdAt, String directorName, String directorEmail
    ) {}

    record FilmDetailsView(
            Long filmId, String title, String genre, String status, String imageUrl,
            String directorName, int voteCount, double avgRating
    ) {}

    record FilmRankingView(
            Long filmId, String title, String genre, double judgeScore, int voteCount
    ) {}
}

