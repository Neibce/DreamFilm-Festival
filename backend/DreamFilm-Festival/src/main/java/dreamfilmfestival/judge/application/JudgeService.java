package dreamfilmfestival.judge.application;

import dreamfilmfestival.judge.domain.Judge;
import dreamfilmfestival.judge.domain.JudgeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JudgeService {
    private final JudgeRepository judgeRepository;

    @Transactional
    public Judge submitScores(Long filmId, Long userId, int creativity, int execution, int emotionalImpact, int storytelling, String comment) {
        Optional<Judge> existing = judgeRepository.findByFilmIdAndUserId(filmId, userId);

        Judge toSave = existing.map(j -> Judge.builder()
                        .judgeId(j.getJudgeId())
                        .filmId(filmId)
                        .userId(userId)
                        .creativity(creativity)
                        .execution(execution)
                        .emotionalImpact(emotionalImpact)
                        .storytelling(storytelling)
                        .comment(comment)
                        .judgedAt(LocalDateTime.now())
                        .build())
                .orElse(Judge.builder()
                        .filmId(filmId)
                        .userId(userId)
                        .creativity(creativity)
                        .execution(execution)
                        .emotionalImpact(emotionalImpact)
                        .storytelling(storytelling)
                        .comment(comment)
                        .judgedAt(LocalDateTime.now())
                        .build());

        return judgeRepository.save(toSave);
    }

    public Optional<Judge> findByFilmIdAndUserId(Long filmId, Long userId) {
        return judgeRepository.findByFilmIdAndUserId(filmId, userId);
    }
}

