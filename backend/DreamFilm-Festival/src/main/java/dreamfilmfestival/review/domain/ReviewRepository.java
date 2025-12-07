package dreamfilmfestival.review.domain;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository {
    Review save(Review review);
    List<Review> findByFilmId(Long filmId, String sort);
    Optional<Review> findByFilmIdAndUserId(Long filmId, Long userId);
    List<FilmRatingStats> findFilmsWithMinAvgRating(double minRating);

    // SUM, MAX, MIN 추가
    record FilmRatingStats(Long filmId, int reviewCount, double avgRating, 
                          int maxRating, int minRating, long ratingSum) {}
}

