package dreamfilmfestival.review.domain;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository {
    Review save(Review review);
    Optional<Review> findById(Long reviewId);
    List<Review> findByFilmId(Long filmId);
    List<Review> findByUserId(Long userId);
    void deleteById(Long reviewId);
}

