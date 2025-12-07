package dreamfilmfestival.vote.infrastructure;

import dreamfilmfestival.vote.domain.Vote;
import dreamfilmfestival.vote.domain.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class JdbcVoteRepository implements VoteRepository {
    private final JdbcClient jdbcClient;

    @Override
    public Vote save(Vote vote) {
        if (vote.getVoteId() == null) {
            return insert(vote);
        }
        return update(vote);
    }

    @Override
    public List<Vote> findByUserId(Long userId) {
        String sql = """
            SELECT vote_id, film_id, user_id
            FROM vote
            WHERE user_id = ?
            ORDER BY vote_id DESC
            """;

        return jdbcClient.sql(sql)
                .param(userId)
                .query((rs, rowNum) -> Vote.builder()
                        .voteId(rs.getLong("vote_id"))
                        .filmId(rs.getLong("film_id"))
                        .userId(rs.getLong("user_id"))
                        .build())
                .list();
    }

    @Override
    public Optional<Vote> findByUserIdAndFilmId(Long userId, Long filmId) {
        String sql = """
            SELECT vote_id, film_id, user_id
            FROM vote
            WHERE user_id = ? AND film_id = ?
            """;

        return jdbcClient.sql(sql)
                .param(userId)
                .param(filmId)
                .query((rs, rowNum) -> Vote.builder()
                        .voteId(rs.getLong("vote_id"))
                        .filmId(rs.getLong("film_id"))
                        .userId(rs.getLong("user_id"))
                        .build())
                .optional();
    }

    @Override
    public int countByFilmId(Long filmId) {
        String sql = "SELECT COUNT(*) FROM vote WHERE film_id = ?";
        Integer count = jdbcClient.sql(sql)
                .param(filmId)
                .query(Integer.class)
                .single();
        return count != null ? count : 0;
    }

    @Override
    public int countByUserId(Long userId) {
        String sql = "SELECT COUNT(*) FROM vote WHERE user_id = ?";
        Integer count = jdbcClient.sql(sql)
                .param(userId)
                .query(Integer.class)
                .single();
        return count != null ? count : 0;
    }

    @Override
    public void deleteByUserIdAndFilmId(Long userId, Long filmId) {
        String sql = "DELETE FROM vote WHERE user_id = ? AND film_id = ?";
        jdbcClient.sql(sql)
                .param(userId)
                .param(filmId)
                .update();
    }

    private Vote insert(Vote vote) {
        String sql = """
            INSERT INTO vote (film_id, user_id)
            VALUES (?, ?)
            """;

        var keyHolder = new org.springframework.jdbc.support.GeneratedKeyHolder();

        jdbcClient.sql(sql)
                .param(vote.getFilmId())
                .param(vote.getUserId())
                .update(keyHolder);

        Long id = ((Number) keyHolder.getKeys().get("vote_id")).longValue();
        return Vote.builder()
                .voteId(id)
                .filmId(vote.getFilmId())
                .userId(vote.getUserId())
                .build();
    }

    private Vote update(Vote vote) {
        String sql = """
            UPDATE vote
            SET film_id = ?, user_id = ?
            WHERE vote_id = ?
            """;

        jdbcClient.sql(sql)
                .param(vote.getFilmId())
                .param(vote.getUserId())
                .param(vote.getVoteId())
                .update();

        return vote;
    }

    // EXISTS Subquery - 투표 여부 확인
    @Override
    public boolean existsByUserAndFilm(Long userId, Long filmId) {
        String sql = """
            SELECT EXISTS(
                SELECT 1 FROM vote WHERE user_id = ? AND film_id = ?
            ) AS vote_exists
            """;

        Boolean result = jdbcClient.sql(sql)
                .param(userId)
                .param(filmId)
                .query(Boolean.class)
                .single();

        return result != null && result;
    }
}
