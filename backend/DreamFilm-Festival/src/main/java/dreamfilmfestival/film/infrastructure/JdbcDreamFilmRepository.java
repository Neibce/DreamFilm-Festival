package dreamfilmfestival.film.infrastructure;

import dreamfilmfestival.film.domain.DreamFilm;
import dreamfilmfestival.film.domain.DreamFilmRepository;
import dreamfilmfestival.film.domain.FilmStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class JdbcDreamFilmRepository implements DreamFilmRepository {
    private final JdbcClient jdbcClient;

    @Override
    public DreamFilm save(DreamFilm film) {
        if (film.getFilmId() == null) {
            return insert(film);
        } else {
            return update(film);
        }
    }

    private DreamFilm insert(DreamFilm film) {
        String sql = """
            INSERT INTO dream_film (festival_id, director_id, title, dream_text, 
                                   ai_script, summary, genre, created_at, status, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;

        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcClient.sql(sql)
                .param(film.getFestivalId())
                .param(film.getDirectorId())
                .param(film.getTitle())
                .param(film.getDreamText())
                .param(film.getAiScript())
                .param(film.getSummary())
                .param(film.getGenre())
                .param(Timestamp.valueOf(film.getCreatedAt()))
                .param(film.getStatus().name())
                .param(film.getImageUrl())
                .update(keyHolder);

        Long filmId = ((Number) keyHolder.getKeys().get("film_id")).longValue();
        return DreamFilm.builder()
                .filmId(filmId)
                .festivalId(film.getFestivalId())
                .directorId(film.getDirectorId())
                .title(film.getTitle())
                .dreamText(film.getDreamText())
                .aiScript(film.getAiScript())
                .summary(film.getSummary())
                .genre(film.getGenre())
                .createdAt(film.getCreatedAt())
                .status(film.getStatus())
                .imageUrl(film.getImageUrl())
                .build();
    }

    private DreamFilm update(DreamFilm film) {
        String sql = """
            UPDATE dream_film
            SET festival_id = ?, director_id = ?, title = ?, dream_text = ?,
                ai_script = ?, summary = ?, genre = ?, status = ?, image_url = ?
            WHERE film_id = ?
            """;

        jdbcClient.sql(sql)
                .param(film.getFestivalId())
                .param(film.getDirectorId())
                .param(film.getTitle())
                .param(film.getDreamText())
                .param(film.getAiScript())
                .param(film.getSummary())
                .param(film.getGenre())
                .param(film.getStatus().name())
                .param(film.getImageUrl())
                .param(film.getFilmId())
                .update();

        return film;
    }

    @Override
    public Optional<DreamFilm> findById(Long filmId) {
        String sql = """
            SELECT film_id, festival_id, director_id, title, dream_text,
                   ai_script, summary, genre, created_at, status, image_url
            FROM dream_film
            WHERE film_id = ?
            """;

        return jdbcClient.sql(sql)
                .param(filmId)
                .query((rs, rowNum) -> DreamFilm.builder()
                        .filmId(rs.getLong("film_id"))
                        .festivalId(rs.getLong("festival_id"))
                        .directorId(rs.getLong("director_id"))
                        .title(rs.getString("title"))
                        .dreamText(rs.getString("dream_text"))
                        .aiScript(rs.getString("ai_script"))
                        .summary(rs.getString("summary"))
                        .genre(rs.getString("genre"))
                        .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
                        .status(FilmStatus.valueOf(rs.getString("status")))
                        .imageUrl(rs.getString("image_url"))
                        .build())
                .optional();
    }

    @Override
    public List<DreamFilm> findAll() {
        String sql = """
            SELECT film_id, festival_id, director_id, title, dream_text,
                   ai_script, summary, genre, created_at, status, image_url
            FROM dream_film
            ORDER BY created_at DESC
            """;

        return jdbcClient.sql(sql)
                .query((rs, rowNum) -> DreamFilm.builder()
                        .filmId(rs.getLong("film_id"))
                        .festivalId(rs.getLong("festival_id"))
                        .directorId(rs.getLong("director_id"))
                        .title(rs.getString("title"))
                        .dreamText(rs.getString("dream_text"))
                        .aiScript(rs.getString("ai_script"))
                        .summary(rs.getString("summary"))
                        .genre(rs.getString("genre"))
                        .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
                        .status(FilmStatus.valueOf(rs.getString("status")))
                        .imageUrl(rs.getString("image_url"))
                        .build())
                .list();
    }

    @Override
    public List<DreamFilm> findByFestivalId(Long festivalId) {
        String sql = """
            SELECT film_id, festival_id, director_id, title, dream_text,
                   ai_script, summary, genre, created_at, status, image_url
            FROM dream_film
            WHERE festival_id = ?
            ORDER BY created_at DESC
            """;

        return jdbcClient.sql(sql)
                .param(festivalId)
                .query((rs, rowNum) -> DreamFilm.builder()
                        .filmId(rs.getLong("film_id"))
                        .festivalId(rs.getLong("festival_id"))
                        .directorId(rs.getLong("director_id"))
                        .title(rs.getString("title"))
                        .dreamText(rs.getString("dream_text"))
                        .aiScript(rs.getString("ai_script"))
                        .summary(rs.getString("summary"))
                        .genre(rs.getString("genre"))
                        .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
                        .status(FilmStatus.valueOf(rs.getString("status")))
                        .imageUrl(rs.getString("image_url"))
                        .build())
                .list();
    }

    @Override
    public List<DreamFilm> findByDirectorId(Long directorId) {
        String sql = """
            SELECT film_id, festival_id, director_id, title, dream_text,
                   ai_script, summary, genre, created_at, status, image_url
            FROM dream_film
            WHERE director_id = ?
            ORDER BY created_at DESC
            """;

        return jdbcClient.sql(sql)
                .param(directorId)
                .query((rs, rowNum) -> DreamFilm.builder()
                        .filmId(rs.getLong("film_id"))
                        .festivalId(rs.getLong("festival_id"))
                        .directorId(rs.getLong("director_id"))
                        .title(rs.getString("title"))
                        .dreamText(rs.getString("dream_text"))
                        .aiScript(rs.getString("ai_script"))
                        .summary(rs.getString("summary"))
                        .genre(rs.getString("genre"))
                        .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
                        .status(FilmStatus.valueOf(rs.getString("status")))
                        .imageUrl(rs.getString("image_url"))
                        .build())
                .list();
    }

    @Override
    public List<DreamFilm> findByStatus(FilmStatus status) {
        String sql = """
            SELECT film_id, festival_id, director_id, title, dream_text,
                   ai_script, summary, genre, created_at, status, image_url
            FROM dream_film
            WHERE status = ?
            ORDER BY created_at DESC
            """;

        return jdbcClient.sql(sql)
                .param(status.name())
                .query((rs, rowNum) -> DreamFilm.builder()
                        .filmId(rs.getLong("film_id"))
                        .festivalId(rs.getLong("festival_id"))
                        .directorId(rs.getLong("director_id"))
                        .title(rs.getString("title"))
                        .dreamText(rs.getString("dream_text"))
                        .aiScript(rs.getString("ai_script"))
                        .summary(rs.getString("summary"))
                        .genre(rs.getString("genre"))
                        .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
                        .status(FilmStatus.valueOf(rs.getString("status")))
                        .imageUrl(rs.getString("image_url"))
                        .build())
                .list();
    }

    @Override
    public void deleteById(Long filmId) {
        String sql = "DELETE FROM dream_film WHERE film_id = ?";
        jdbcClient.sql(sql).param(filmId).update();
    }

    // LEFT JOIN - 영화 + 감독 정보 조회
    @Override
    public List<DreamFilmRepository.FilmWithDirector> findAllWithDirector() {
        String sql = """
            SELECT f.film_id, f.title, f.genre, f.status, f.image_url, f.created_at,
                   u.username AS director_name, u.email AS director_email
            FROM dream_film f
            LEFT JOIN "user" u ON f.director_id = u.user_id
            WHERE f.status = 'SUBMITTED'
            ORDER BY f.created_at DESC
            """;

        return jdbcClient.sql(sql)
                .query((rs, rowNum) -> new DreamFilmRepository.FilmWithDirector(
                        rs.getLong("film_id"),
                        rs.getString("title"),
                        rs.getString("genre"),
                        rs.getString("status"),
                        rs.getString("image_url"),
                        rs.getTimestamp("created_at").toLocalDateTime(),
                        rs.getString("director_name"),
                        rs.getString("director_email")
                ))
                .list();
    }

    // View 활용 - 영화 상세 정보 조회 (v_film_details)
    @Override
    public Optional<DreamFilmRepository.FilmDetailsView> findFilmDetailsFromView(Long filmId) {
        String sql = """
            SELECT film_id, title, genre, status, image_url, director_name,
                   vote_count, avg_rating
            FROM v_film_details
            WHERE film_id = ?
            """;

        return jdbcClient.sql(sql)
                .param(filmId)
                .query((rs, rowNum) -> new DreamFilmRepository.FilmDetailsView(
                        rs.getLong("film_id"),
                        rs.getString("title"),
                        rs.getString("genre"),
                        rs.getString("status"),
                        rs.getString("image_url"),
                        rs.getString("director_name"),
                        rs.getInt("vote_count"),
                        rs.getDouble("avg_rating")
                ))
                .optional();
    }

    // View 활용 - 영화 랭킹 조회 (v_film_ranking)
    @Override
    public List<DreamFilmRepository.FilmRankingView> findRankingFromView(int limit) {
        String sql = """
            SELECT film_id, title, genre, judge_score, vote_count
            FROM v_film_ranking
            LIMIT ?
            """;

        return jdbcClient.sql(sql)
                .param(limit)
                .query((rs, rowNum) -> new DreamFilmRepository.FilmRankingView(
                        rs.getLong("film_id"),
                        rs.getString("title"),
                        rs.getString("genre"),
                        rs.getDouble("judge_score"),
                        rs.getInt("vote_count")
                ))
                .list();
    }
}

