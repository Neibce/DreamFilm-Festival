package dreamfilmfestival.review.presentation.dto;

import dreamfilmfestival.review.domain.Review;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long reviewId,
        Long filmId,
        Long userId,
        String username,
        String role,
        Integer rating,
        String comment,
        LocalDateTime createdAt
) {
    public static ReviewResponse from(Review review, String username, String role) {
        return new ReviewResponse(
                review.getReviewId(),
                review.getFilmId(),
                review.getUserId(),
                username,
                role,
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}

