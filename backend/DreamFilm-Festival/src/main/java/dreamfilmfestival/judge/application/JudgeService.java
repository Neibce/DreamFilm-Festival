package dreamfilmfestival.judge.application;

import dreamfilmfestival.judge.domain.Judge;
import dreamfilmfestival.judge.domain.JudgeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JudgeService {
    private final JudgeRepository judgeRepository;

    public Judge createJudge(Judge judge) {
        return judgeRepository.save(judge);
    }

    public Optional<Judge> getJudgeById(Long judgeId) {
        return judgeRepository.findById(judgeId);
    }

    public List<Judge> getJudgesByFilmId(Long filmId) {
        return judgeRepository.findByFilmId(filmId);
    }

    public List<Judge> getJudgesByUserId(Long userId) {
        return judgeRepository.findByUserId(userId);
    }

    public void deleteJudge(Long judgeId) {
        judgeRepository.deleteById(judgeId);
    }
}

