package dreamfilmfestival.review.infrastructure;

import dreamfilmfestival.review.domain.Review;
import dreamfilmfestival.review.domain.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class JdbcReviewRepository implements ReviewRepository {
    private final JdbcClient jdbcClient;

    @Override
    public Review save(Review review) {
        if (review.getReviewId() == null) {
            return insert(review);
        }
        return update(review);
    }

    @Override
    public Optional<Review> findById(Long reviewId) {
        String sql = """
            SELECT review_id, film_id, user_id, rating, comment, created_at
            FROM review
            WHERE review_id = ?
            """;

        return jdbcClient.sql(sql)
                .param(reviewId)
                .query((rs, rowNum) -> Review.builder()
                        .reviewId(rs.getLong("review_id"))
                        .filmId(rs.getLong("film_id"))
                        .userId(rs.getLong("user_id"))
                        .rating(rs.getInt("rating"))
                        .comment(rs.getString("comment"))
                        .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
                        .build())
                .optional();
    }

    @Override
    public List<Review> findByFilmId(Long filmId, String sort) {
        String orderBy = "created_at DESC";
        if ("rating".equalsIgnoreCase(sort)) {
            orderBy = "rating DESC, created_at DESC";
        }

        String sql = """
            SELECT review_id, film_id, user_id, rating, comment, created_at
            FROM review
            WHERE film_id = ?
            ORDER BY """ + orderBy;

        return jdbcClient.sql(sql)
                .param(filmId)
                .query((rs, rowNum) -> Review.builder()
                        .reviewId(rs.getLong("review_id"))
                        .filmId(rs.getLong("film_id"))
                        .userId(rs.getLong("user_id"))
                        .rating(rs.getInt("rating"))
                        .comment(rs.getString("comment"))
                        .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
                        .build())
                .list();
    }

    @Override
    public List<Review> findByUserId(Long userId) {
        String sql = """
            SELECT review_id, film_id, user_id, rating, comment, created_at
            FROM review
            WHERE user_id = ?
            ORDER BY created_at DESC
            """;

        return jdbcClient.sql(sql)
                .param(userId)
                .query((rs, rowNum) -> Review.builder()
                        .reviewId(rs.getLong("review_id"))
                        .filmId(rs.getLong("film_id"))
                        .userId(rs.getLong("user_id"))
                        .rating(rs.getInt("rating"))
                        .comment(rs.getString("comment"))
                        .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
                        .build())
                .list();
    }

    @Override
    public Optional<Review> findByFilmIdAndUserId(Long filmId, Long userId) {
        String sql = """
            SELECT review_id, film_id, user_id, rating, comment, created_at
            FROM review
            WHERE film_id = ? AND user_id = ?
            """;

        return jdbcClient.sql(sql)
                .param(filmId)
                .param(userId)
                .query((rs, rowNum) -> Review.builder()
                        .reviewId(rs.getLong("review_id"))
                        .filmId(rs.getLong("film_id"))
                        .userId(rs.getLong("user_id"))
                        .rating(rs.getInt("rating"))
                        .comment(rs.getString("comment"))
                        .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
                        .build())
                .optional();
    }

    @Override
    public void deleteById(Long reviewId) {
        String sql = "DELETE FROM review WHERE review_id = ?";
        jdbcClient.sql(sql).param(reviewId).update();
    }

    private Review insert(Review review) {
        String sql = """
            INSERT INTO review (film_id, user_id, rating, comment, created_at)
            VALUES (?, ?, ?, ?, ?)
            """;

        var keyHolder = new org.springframework.jdbc.support.GeneratedKeyHolder();

        var createdAt = review.getCreatedAt() != null
                ? review.getCreatedAt()
                : java.time.LocalDateTime.now();

        jdbcClient.sql(sql)
                .param(review.getFilmId())
                .param(review.getUserId())
                .param(review.getRating())
                .param(review.getComment())
                .param(java.sql.Timestamp.valueOf(createdAt))
                .update(keyHolder);

        Long id = ((Number) keyHolder.getKeys().get("review_id")).longValue();
        return Review.builder()
                .reviewId(id)
                .filmId(review.getFilmId())
                .userId(review.getUserId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(createdAt)
                .build();
    }

    private Review update(Review review) {
        String sql = """
            UPDATE review
            SET film_id = ?, user_id = ?, rating = ?, comment = ?, created_at = ?
            WHERE review_id = ?
            """;

        jdbcClient.sql(sql)
                .param(review.getFilmId())
                .param(review.getUserId())
                .param(review.getRating())
                .param(review.getComment())
                .param(java.sql.Timestamp.valueOf(review.getCreatedAt()))
                .param(review.getReviewId())
                .update();

        return review;
    }
}

