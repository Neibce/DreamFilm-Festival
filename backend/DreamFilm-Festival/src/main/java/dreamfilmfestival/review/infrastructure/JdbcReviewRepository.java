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
        // TODO: INSERT or UPDATE 구현
        return null;
    }

    @Override
    public Optional<Review> findById(Long reviewId) {
        // TODO: SELECT 구현
        return Optional.empty();
    }

    @Override
    public List<Review> findByFilmId(Long filmId) {
        // TODO: SELECT 구현
        return List.of();
    }

    @Override
    public List<Review> findByUserId(Long userId) {
        // TODO: SELECT 구현
        return List.of();
    }

    @Override
    public void deleteById(Long reviewId) {
        // TODO: DELETE 구현
    }
}

