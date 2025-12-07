package dreamfilmfestival.judge.domain;

import java.util.List;
import java.util.Optional;

public interface JudgeRepository {
    Judge save(Judge judge);
    List<Judge> findByFilmId(Long filmId);
    Optional<Judge> findByFilmIdAndUserId(Long filmId, Long userId);
    List<Judge> findBySubmittedFilms();
}

