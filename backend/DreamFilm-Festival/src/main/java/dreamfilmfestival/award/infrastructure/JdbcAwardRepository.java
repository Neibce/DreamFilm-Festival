package dreamfilmfestival.award.infrastructure;

import dreamfilmfestival.award.domain.Award;
import dreamfilmfestival.award.domain.AwardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;

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

    // SQL 레벨 트랜잭션 (BEGIN/COMMIT/ROLLBACK) - 시상 확정
    @Override
    public void finalizeAwardWithTransaction(Long filmId, Long festivalId, int rank) {
        jdbcClient.sql("BEGIN").update();
        try {
            // 1. 시상 정보 삽입
            jdbcClient.sql("""
                INSERT INTO award (film_id, festival_id, rank) VALUES (?, ?, ?)
                """)
                .param(filmId)
                .param(festivalId)
                .param(rank)
                .update();

            // 2. 영화 상태를 'AWARDED'로 변경
            jdbcClient.sql("""
                UPDATE dream_film SET status = 'AWARDED' WHERE film_id = ?
                """)
                .param(filmId)
                .update();

            // 모든 작업 성공 시 커밋
            jdbcClient.sql("COMMIT").update();
        } catch (Exception e) {
            // 오류 발생 시 롤백
            jdbcClient.sql("ROLLBACK").update();
            throw new RuntimeException("시상 확정 실패 - 트랜잭션 롤백: " + e.getMessage(), e);
        }
    }
}
