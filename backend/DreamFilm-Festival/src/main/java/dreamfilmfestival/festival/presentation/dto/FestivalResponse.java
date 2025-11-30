package dreamfilmfestival.festival.presentation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FestivalResponse {
    private Long festivalId;
    private String festivalName;
    private LocalDate startDate;
    private LocalDate endDate;
}

