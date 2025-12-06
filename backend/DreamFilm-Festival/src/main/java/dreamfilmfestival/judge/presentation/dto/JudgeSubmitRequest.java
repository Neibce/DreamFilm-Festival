package dreamfilmfestival.judge.presentation.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record JudgeSubmitRequest(
        @NotNull @Min(1) @Max(5) Integer creativity,
        @NotNull @Min(1) @Max(5) Integer execution,
        @NotNull @Min(1) @Max(5) Integer emotionalImpact,
        @NotNull @Min(1) @Max(5) Integer storytelling,
        String comment
) {
}

