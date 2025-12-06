package dreamfilmfestival.judge.presentation.dto;

import dreamfilmfestival.judge.domain.Judge;

import java.time.LocalDateTime;

public record JudgeResponse(
        Long judgeId,
        Long filmId,
        Long userId,
        Integer creativity,
        Integer execution,
        Integer emotionalImpact,
        Integer storytelling,
        String comment,
        LocalDateTime judgedAt
) {
    public static JudgeResponse from(Judge judge) {
        return new JudgeResponse(
                judge.getJudgeId(),
                judge.getFilmId(),
                judge.getUserId(),
                judge.getCreativity(),
                judge.getExecution(),
                judge.getEmotionalImpact(),
                judge.getStorytelling(),
                judge.getComment(),
                judge.getJudgedAt()
        );
    }
}

