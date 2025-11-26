package dreamfilmfestival.domain.judge;

import java.util.List;
import java.util.Optional;

public interface JudgeRepository {
    Judge save(Judge judge);
    Optional<Judge> findById(Long judgeId);
    List<Judge> findByFilmId(Long filmId);
    List<Judge> findByUserId(Long userId);
    void deleteById(Long judgeId);
}

