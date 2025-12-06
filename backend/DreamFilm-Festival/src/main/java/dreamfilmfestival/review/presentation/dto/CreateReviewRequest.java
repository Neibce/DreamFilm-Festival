package dreamfilmfestival.review.presentation.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateReviewRequest(
        @NotNull Long filmId,
        @NotNull @Min(1) @Max(5) Integer rating,
        @NotBlank String comment
) {
    public static CreateReviewRequest of(Long filmId, Integer rating, String comment) {
        return new CreateReviewRequest(filmId, rating, comment);
    }
}

