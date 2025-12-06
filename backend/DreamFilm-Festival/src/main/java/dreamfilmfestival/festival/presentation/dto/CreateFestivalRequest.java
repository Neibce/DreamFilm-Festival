package dreamfilmfestival.festival.presentation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CreateFestivalRequest(
        @NotBlank String festivalName,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate
) {
    public static CreateFestivalRequest of(String festivalName, LocalDate startDate, LocalDate endDate) {
        return new CreateFestivalRequest(festivalName, startDate, endDate);
    }
}

