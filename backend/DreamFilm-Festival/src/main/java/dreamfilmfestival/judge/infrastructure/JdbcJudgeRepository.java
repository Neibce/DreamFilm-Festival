package dreamfilmfestival.judge.infrastructure;

import dreamfilmfestival.judge.domain.Judge;
import dreamfilmfestival.judge.domain.JudgeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class JdbcJudgeRepository implements JudgeRepository {
    private final JdbcClient jdbcClient;

    @Override
    public Judge save(Judge judge) {
        if (judge.getJudgeId() == null) {
            return insert(judge);
        }
        return update(judge);
    }

    @Override
    public List<Judge> findByFilmId(Long filmId) {
        String sql = """
            SELECT judge_id, film_id, user_id, creativity, execution, emotional_impact, storytelling, comment, judged_at
            FROM judge
            WHERE film_id = ?
            ORDER BY judged_at DESC
            """;

        return jdbcClient.sql(sql)
                .param(filmId)
                .query((rs, rowNum) -> Judge.builder()
                        .judgeId(rs.getLong("judge_id"))
                        .filmId(rs.getLong("film_id"))
                        .userId(rs.getLong("user_id"))
                        .creativity(getNullableInt(rs, "creativity"))
                        .execution(getNullableInt(rs, "execution"))
                        .emotionalImpact(getNullableInt(rs, "emotional_impact"))
                        .storytelling(getNullableInt(rs, "storytelling"))
                        .comment(rs.getString("comment"))
                        .judgedAt(rs.getTimestamp("judged_at").toLocalDateTime())
                        .build())
                .list();
    }

    @Override
    public List<Judge> findByUserId(Long userId) {
        String sql = """
            SELECT judge_id, film_id, user_id, creativity, execution, emotional_impact, storytelling, comment, judged_at
            FROM judge
            WHERE user_id = ?
            ORDER BY judged_at DESC
            """;

        return jdbcClient.sql(sql)
                .param(userId)
                .query((rs, rowNum) -> Judge.builder()
                        .judgeId(rs.getLong("judge_id"))
                        .filmId(rs.getLong("film_id"))
                        .userId(rs.getLong("user_id"))
                        .creativity(getNullableInt(rs, "creativity"))
                        .execution(getNullableInt(rs, "execution"))
                        .emotionalImpact(getNullableInt(rs, "emotional_impact"))
                        .storytelling(getNullableInt(rs, "storytelling"))
                        .comment(rs.getString("comment"))
                        .judgedAt(rs.getTimestamp("judged_at").toLocalDateTime())
                        .build())
                .list();
    }

    @Override
    public Optional<Judge> findByFilmIdAndUserId(Long filmId, Long userId) {
        String sql = """
            SELECT judge_id, film_id, user_id, creativity, execution, emotional_impact, storytelling, comment, judged_at
            FROM judge
            WHERE film_id = ? AND user_id = ?
            """;

        return jdbcClient.sql(sql)
                .param(filmId)
                .param(userId)
                .query((rs, rowNum) -> Judge.builder()
                        .judgeId(rs.getLong("judge_id"))
                        .filmId(rs.getLong("film_id"))
                        .userId(rs.getLong("user_id"))
                        .creativity(getNullableInt(rs, "creativity"))
                        .execution(getNullableInt(rs, "execution"))
                        .emotionalImpact(getNullableInt(rs, "emotional_impact"))
                        .storytelling(getNullableInt(rs, "storytelling"))
                        .comment(rs.getString("comment"))
                        .judgedAt(rs.getTimestamp("judged_at").toLocalDateTime())
                        .build())
                .optional();
    }

    private Judge insert(Judge judge) {
        String sql = """
            INSERT INTO judge (film_id, user_id, creativity, execution, emotional_impact, storytelling, comment, judged_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """;

        var keyHolder = new org.springframework.jdbc.support.GeneratedKeyHolder();
        var judgedAt = judge.getJudgedAt() != null
                ? judge.getJudgedAt()
                : java.time.LocalDateTime.now();

        jdbcClient.sql(sql)
                .param(judge.getFilmId())
                .param(judge.getUserId())
                .param(judge.getCreativity())
                .param(judge.getExecution())
                .param(judge.getEmotionalImpact())
                .param(judge.getStorytelling())
                .param(judge.getComment())
                .param(java.sql.Timestamp.valueOf(judgedAt))
                .update(keyHolder);

        Long id = ((Number) keyHolder.getKeys().get("judge_id")).longValue();
        return Judge.builder()
                .judgeId(id)
                .filmId(judge.getFilmId())
                .userId(judge.getUserId())
                .creativity(judge.getCreativity())
                .execution(judge.getExecution())
                .emotionalImpact(judge.getEmotionalImpact())
                .storytelling(judge.getStorytelling())
                .comment(judge.getComment())
                .judgedAt(judgedAt)
                .build();
    }

    private Judge update(Judge judge) {
        String sql = """
            UPDATE judge
            SET film_id = ?, user_id = ?, creativity = ?, execution = ?, emotional_impact = ?, storytelling = ?, comment = ?, judged_at = ?
            WHERE judge_id = ?
            """;

        jdbcClient.sql(sql)
                .param(judge.getFilmId())
                .param(judge.getUserId())
                .param(judge.getCreativity())
                .param(judge.getExecution())
                .param(judge.getEmotionalImpact())
                .param(judge.getStorytelling())
                .param(judge.getComment())
                .param(java.sql.Timestamp.valueOf(judge.getJudgedAt()))
                .param(judge.getJudgeId())
                .update();

        return judge;
    }

    private Integer getNullableInt(java.sql.ResultSet rs, String column) {
        try {
            int value = rs.getInt(column);
            return rs.wasNull() ? null : value;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // IN Subquery - 제출된 영화의 심사만 조회
    public List<Judge> findBySubmittedFilms() {
        String sql = """
            SELECT judge_id, film_id, user_id, creativity, execution, 
                   emotional_impact, storytelling, comment, judged_at
            FROM judge
            WHERE film_id IN (
                SELECT film_id FROM dream_film WHERE status = 'SUBMITTED'
            )
            ORDER BY judged_at DESC
            """;

        return jdbcClient.sql(sql)
                .query((rs, rowNum) -> Judge.builder()
                        .judgeId(rs.getLong("judge_id"))
                        .filmId(rs.getLong("film_id"))
                        .userId(rs.getLong("user_id"))
                        .creativity(getNullableInt(rs, "creativity"))
                        .execution(getNullableInt(rs, "execution"))
                        .emotionalImpact(getNullableInt(rs, "emotional_impact"))
                        .storytelling(getNullableInt(rs, "storytelling"))
                        .comment(rs.getString("comment"))
                        .judgedAt(rs.getTimestamp("judged_at").toLocalDateTime())
                        .build())
                .list();
    }
}

