package dreamfilmfestival.award.presentation.dto;

import dreamfilmfestival.award.domain.Award;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class AwardResponse {
    private Long awardId;
    private Long filmId;
    private Long festivalId;
    private String awardName;
    private Integer rank;
    private LocalDateTime announcedAt;

    public static AwardResponse from(Award award) {
        return AwardResponse.builder()
                .awardId(award.getAwardId())
                .filmId(award.getFilmId())
                .festivalId(award.getFestivalId())
                .awardName(award.getAwardName())
                .rank(award.getRank())
                .announcedAt(award.getAnnouncedAt())
                .build();
    }
}

