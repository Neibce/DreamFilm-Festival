package dreamfilmfestival.award.domain;

import java.util.List;
import java.util.Optional;

public interface AwardRepository {
    Award save(Award award);
    Optional<Award> findById(Long awardId);
    List<Award> findByFilmId(Long filmId);
    List<Award> findByFestivalId(Long festivalId);
    void deleteById(Long awardId);
}

