package dreamfilmfestival.festival.presentation.dto;

import java.time.LocalDate;

public record FestivalResponse(
        Long festivalId,
        String festivalName,
        LocalDate startDate,
        LocalDate endDate
) {
    public static FestivalResponse of(Long festivalId, String festivalName, LocalDate startDate, LocalDate endDate) {
        return new FestivalResponse(festivalId, festivalName, startDate, endDate);
    }
}

