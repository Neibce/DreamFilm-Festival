package dreamfilmfestival.festival.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FilmFestival {
    private Long festivalId;
    private String festivalName;
    private LocalDate startDate;
    private LocalDate endDate;

    public void update(String festivalName, LocalDate startDate, LocalDate endDate) {
        this.festivalName = festivalName;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}

