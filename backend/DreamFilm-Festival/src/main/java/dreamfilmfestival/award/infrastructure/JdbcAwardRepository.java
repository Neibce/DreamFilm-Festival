package dreamfilmfestival.award.infrastructure;

import dreamfilmfestival.award.domain.Award;
import dreamfilmfestival.award.domain.AwardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class JdbcAwardRepository implements AwardRepository {
    private final JdbcClient jdbcClient;

    @Override
    public Award save(Award award) {
        if (award.getAwardId() == null) {
            return insert(award);
        }
        return update(award);
    }

    @Override
    public Optional<Award> findById(Long awardId) {
        String sql = """
            SELECT award_id, film_id, festival_id, rank
            FROM award
            WHERE award_id = ?
            """;

        return jdbcClient.sql(sql)
                .param(awardId)
                .query((rs, rowNum) -> Award.builder()
                        .awardId(rs.getLong("award_id"))
                        .filmId(rs.getLong("film_id"))
                        .festivalId(rs.getLong("festival_id"))
                        .rank((Integer) rs.getObject("rank"))
                        .awardName(null)
                        .announcedAt(null)
                        .build())
                .optional();
    }

    @Override
    public List<Award> findByFilmId(Long filmId) {
        String sql = """
            SELECT award_id, film_id, festival_id, rank
            FROM award
            WHERE film_id = ?
            ORDER BY award_id DESC
            """;

        return jdbcClient.sql(sql)
                .param(filmId)
                .query((rs, rowNum) -> Award.builder()
                        .awardId(rs.getLong("award_id"))
                        .filmId(rs.getLong("film_id"))
                        .festivalId(rs.getLong("festival_id"))
                        .rank((Integer) rs.getObject("rank"))
                        .awardName(null)
                        .announcedAt(null)
                        .build())
                .list();
    }

    @Override
    public List<Award> findByFestivalId(Long festivalId) {
        String sql = """
            SELECT award_id, film_id, festival_id, rank
            FROM award
            WHERE festival_id = ?
            ORDER BY award_id DESC
            """;

        return jdbcClient.sql(sql)
                .param(festivalId)
                .query((rs, rowNum) -> Award.builder()
                        .awardId(rs.getLong("award_id"))
                        .filmId(rs.getLong("film_id"))
                        .festivalId(rs.getLong("festival_id"))
                        .rank((Integer) rs.getObject("rank"))
                        .awardName(null)
                        .announcedAt(null)
                        .build())
                .list();
    }

    @Override
    public void deleteById(Long awardId) {
        String sql = "DELETE FROM award WHERE award_id = ?";
        jdbcClient.sql(sql).param(awardId).update();
    }

    @Override
    public void deleteByFestivalId(Long festivalId) {
        String sql = "DELETE FROM award WHERE festival_id = ?";
        jdbcClient.sql(sql).param(festivalId).update();
    }

    private Award insert(Award award) {
        String sql = """
            INSERT INTO award (film_id, festival_id, rank)
            VALUES (?, ?, ?)
            """;

        var keyHolder = new org.springframework.jdbc.support.GeneratedKeyHolder();

        jdbcClient.sql(sql)
                .param(award.getFilmId())
                .param(award.getFestivalId())
                .param(award.getRank())
                .update(keyHolder);

        Long id = ((Number) keyHolder.getKeys().get("award_id")).longValue();
        return Award.builder()
                .awardId(id)
                .filmId(award.getFilmId())
                .festivalId(award.getFestivalId())
                .rank(award.getRank())
                .awardName(null)
                .announcedAt(null)
                .build();
    }

    private Award update(Award award) {
        String sql = """
            UPDATE award
            SET film_id = ?, festival_id = ?, rank = ?
            WHERE award_id = ?
            """;

        jdbcClient.sql(sql)
                .param(award.getFilmId())
                .param(award.getFestivalId())
                .param(award.getRank())
                .param(award.getAwardId())
                .update();

        return award;
    }
}

