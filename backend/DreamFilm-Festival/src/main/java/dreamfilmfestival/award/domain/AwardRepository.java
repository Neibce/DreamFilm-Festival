package dreamfilmfestival.award.domain;

import java.util.List;

public interface AwardRepository {
    Award save(Award award);
    List<Award> findByFestivalId(Long festivalId);
    void deleteByFestivalId(Long festivalId);
    void finalizeAwardWithTransaction(Long filmId, Long festivalId, int rank);
}
