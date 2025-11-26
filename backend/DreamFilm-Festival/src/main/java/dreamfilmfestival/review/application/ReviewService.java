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

    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    public Optional<Review> getReviewById(Long reviewId) {
        return reviewRepository.findById(reviewId);
    }

    public List<Review> getReviewsByFilmId(Long filmId) {
        return reviewRepository.findByFilmId(filmId);
    }

    public List<Review> getReviewsByUserId(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }
}

