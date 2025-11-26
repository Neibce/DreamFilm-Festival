package dreamfilmfestival.judge.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Judge {
    private Long judgeId;
    private Long filmId;
    private Long userId;
    private Integer score;
    private String comment;
    private LocalDateTime judgedAt;
}

