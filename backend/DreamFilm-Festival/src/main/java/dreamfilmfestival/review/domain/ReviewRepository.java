package dreamfilmfestival.review.domain;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository {
    Review save(Review review);
    Optional<Review> findById(Long reviewId);
    List<Review> findByFilmId(Long filmId, String sort);
    List<Review> findByUserId(Long userId);
    Optional<Review> findByFilmIdAndUserId(Long filmId, Long userId);
    void deleteById(Long reviewId);
}

