package dreamfilmfestival.festival.infrastructure;

import dreamfilmfestival.festival.domain.FilmFestival;
import dreamfilmfestival.festival.domain.FilmFestivalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class JdbcFilmFestivalRepository implements FilmFestivalRepository {
    private final JdbcClient jdbcClient;

    @Override
    public FilmFestival save(FilmFestival festival) {
        if (festival.getFestivalId() == null) {
            return insert(festival);
        } else {
            return update(festival);
        }
    }

    private FilmFestival insert(FilmFestival festival) {
        String sql = """
            INSERT INTO film_festival (festival_name, start_date, end_date)
            VALUES (?, ?, ?)
            """;

        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcClient.sql(sql)
                .param(festival.getFestivalName())
                .param(Date.valueOf(festival.getStartDate()))
                .param(Date.valueOf(festival.getEndDate()))
                .update(keyHolder);

        Long festivalId = ((Number) keyHolder.getKeys().get("festival_id")).longValue();
        return FilmFestival.builder()
                .festivalId(festivalId)
                .festivalName(festival.getFestivalName())
                .startDate(festival.getStartDate())
                .endDate(festival.getEndDate())
                .build();
    }

    private FilmFestival update(FilmFestival festival) {
        String sql = """
            UPDATE film_festival
            SET festival_name = ?, start_date = ?, end_date = ?
            WHERE festival_id = ?
            """;

        jdbcClient.sql(sql)
                .param(festival.getFestivalName())
                .param(Date.valueOf(festival.getStartDate()))
                .param(Date.valueOf(festival.getEndDate()))
                .param(festival.getFestivalId())
                .update();

        return festival;
    }

    @Override
    public Optional<FilmFestival> findById(Long festivalId) {
        String sql = """
            SELECT festival_id, festival_name, start_date, end_date
            FROM film_festival
            WHERE festival_id = ?
            """;

        return jdbcClient.sql(sql)
                .param(festivalId)
                .query((rs, rowNum) -> FilmFestival.builder()
                        .festivalId(rs.getLong("festival_id"))
                        .festivalName(rs.getString("festival_name"))
                        .startDate(rs.getDate("start_date").toLocalDate())
                        .endDate(rs.getDate("end_date").toLocalDate())
                        .build())
                .optional();
    }

    @Override
    public List<FilmFestival> findAll() {
        String sql = """
            SELECT festival_id, festival_name, start_date, end_date
            FROM film_festival
            ORDER BY start_date DESC
            """;

        return jdbcClient.sql(sql)
                .query((rs, rowNum) -> FilmFestival.builder()
                        .festivalId(rs.getLong("festival_id"))
                        .festivalName(rs.getString("festival_name"))
                        .startDate(rs.getDate("start_date").toLocalDate())
                        .endDate(rs.getDate("end_date").toLocalDate())
                        .build())
                .list();
    }

    @Override
    public List<FilmFestival> findOngoingFestivals() {
        String sql = """
            SELECT festival_id, festival_name, start_date, end_date
            FROM film_festival
            WHERE start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE
            ORDER BY start_date DESC
            """;

        return jdbcClient.sql(sql)
                .query((rs, rowNum) -> FilmFestival.builder()
                        .festivalId(rs.getLong("festival_id"))
                        .festivalName(rs.getString("festival_name"))
                        .startDate(rs.getDate("start_date").toLocalDate())
                        .endDate(rs.getDate("end_date").toLocalDate())
                        .build())
                .list();
    }

    @Override
    public void deleteById(Long festivalId) {
        String sql = "DELETE FROM film_festival WHERE festival_id = ?";
        jdbcClient.sql(sql).param(festivalId).update();
    }
}

