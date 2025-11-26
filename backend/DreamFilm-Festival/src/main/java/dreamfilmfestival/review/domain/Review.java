package dreamfilmfestival.review.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    private Long reviewId;
    private Long filmId;
    private Long userId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}

