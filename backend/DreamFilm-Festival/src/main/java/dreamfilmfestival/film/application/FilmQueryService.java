package dreamfilmfestival.film.application;

import dreamfilmfestival.review.application.ReviewService;
import dreamfilmfestival.review.domain.Review;
import dreamfilmfestival.vote.application.VoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 영화 조회 시 필요한 부가 집계를 담당한다.
 * 도메인 엔티티를 건드리지 않고 조회용 데이터만 계산한다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FilmQueryService {
    private final VoteService voteService;
    private final ReviewService reviewService;

    public FilmStats getFilmStats(Long filmId) {
        List<Review> reviews = reviewService.getReviewsByFilmId(filmId);
        int reviewCount = reviews.size();
        double averageRating = calculateAverageRating(reviews);
        int voteCount = voteService.countVotesByFilmId(filmId);
        return new FilmStats(voteCount, reviewCount, averageRating);
    }

    private double calculateAverageRating(List<Review> reviews) {
        if (reviews.isEmpty()) {
            return 0.0;
        }
        double sum = reviews.stream()
                .mapToInt(r -> r.getRating() != null ? r.getRating() : 0)
                .sum();
        return Math.round((sum / reviews.size()) * 10) / 10.0;
    }
}
