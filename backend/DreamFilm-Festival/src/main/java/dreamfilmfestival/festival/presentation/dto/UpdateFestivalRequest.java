package dreamfilmfestival.festival.presentation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record UpdateFestivalRequest(
        @NotBlank String festivalName,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate
) {
    public static UpdateFestivalRequest of(String festivalName, LocalDate startDate, LocalDate endDate) {
        return new UpdateFestivalRequest(festivalName, startDate, endDate);
    }
}

