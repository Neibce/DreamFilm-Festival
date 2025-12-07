package dreamfilmfestival.review.application;

import dreamfilmfestival.review.domain.Review;
import dreamfilmfestival.review.domain.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;

    public List<Review> getReviewsByFilmId(Long filmId) {
        return reviewRepository.findByFilmId(filmId, null);
    }

    public List<Review> getReviewsByFilmId(Long filmId, String sort) {
        return reviewRepository.findByFilmId(filmId, sort);
    }

    public Optional<Review> getReviewByFilmAndUser(Long filmId, Long userId) {
        return reviewRepository.findByFilmIdAndUserId(filmId, userId);
    }

    public Review saveReview(Review review) {
        return reviewRepository.save(review);
    }

    // GROUP BY + HAVING - 평균 평점 N점 이상인 영화 목록
    public List<ReviewRepository.FilmRatingStats> getFilmsWithMinAvgRating(double minRating) {
        return reviewRepository.findFilmsWithMinAvgRating(minRating);
    }
}

