package dreamfilmfestival.review.presentation;

import dreamfilmfestival.review.application.ReviewService;
import dreamfilmfestival.review.domain.Review;
import dreamfilmfestival.review.presentation.dto.CreateReviewRequest;
import dreamfilmfestival.review.presentation.dto.ReviewResponse;
import dreamfilmfestival.user.domain.UserRepository;
import dreamfilmfestival.user.domain.UserRole;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody CreateReviewRequest request,
            HttpSession session
    ) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("사용자 정보를 찾을 수 없습니다."));
        if (user.getRole() != UserRole.AUDIENCE) {
            throw new IllegalStateException("관객만 리뷰를 작성할 수 있습니다.");
        }

        var existingReview = reviewService.getReviewByFilmAndUser(request.filmId(), userId);

        var reviewToSave = Review.builder()
                .reviewId(existingReview.map(Review::getReviewId).orElse(null))
                .filmId(request.filmId())
                .userId(userId)
                .rating(request.rating())
                .comment(request.comment())
                .createdAt(existingReview.map(Review::getCreatedAt).orElse(LocalDateTime.now()))
                .build();

        Review savedReview = reviewService.saveReview(reviewToSave);
        HttpStatus status = existingReview.isPresent() ? HttpStatus.OK : HttpStatus.CREATED;
        return ResponseEntity.status(status).body(toResponse(savedReview));
    }

    @GetMapping("/film/{filmId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByFilmId(
            @PathVariable Long filmId,
            @RequestParam(name = "sort", required = false, defaultValue = "recent") String sort
    ) {
        List<ReviewResponse> responses = reviewService.getReviewsByFilmId(filmId, sort)
                .stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    private ReviewResponse toResponse(Review review) {
        String username = null;
        String role = null;
        if (review.getUserId() != null) {
            var user = userRepository.findById(review.getUserId());
            if (user.isPresent()) {
                username = user.get().getUsername();
                role = user.get().getRole().name();
            }
        }
        return ReviewResponse.from(review, username, role);
    }
}

