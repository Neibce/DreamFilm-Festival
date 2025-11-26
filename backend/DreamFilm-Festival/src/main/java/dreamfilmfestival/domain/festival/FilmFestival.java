package dreamfilmfestival.domain.festival;

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
}

