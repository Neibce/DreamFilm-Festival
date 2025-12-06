package dreamfilmfestival.judge.domain;

import java.util.List;
import java.util.Optional;

public interface JudgeRepository {
    Judge save(Judge judge);
    Optional<Judge> findById(Long judgeId);
    List<Judge> findByFilmId(Long filmId);
    List<Judge> findByUserId(Long userId);
    List<Judge> findAll();
    Optional<Judge> findByFilmIdAndUserId(Long filmId, Long userId);
    void deleteById(Long judgeId);
}

