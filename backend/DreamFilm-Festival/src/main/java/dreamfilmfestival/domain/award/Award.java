package dreamfilmfestival.domain.award;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Award {
    private Long awardId;
    private Long filmId;
    private Long festivalId;
    private String awardName;
    private LocalDateTime announcedAt;
}

