package dreamfilmfestival.vote.domain;

import java.util.List;
import java.util.Optional;

public interface VoteRepository {
    Vote save(Vote vote);
    List<Vote> findByUserId(Long userId);
    Optional<Vote> findByUserIdAndFilmId(Long userId, Long filmId);
    int countByFilmId(Long filmId);
    int countByUserId(Long userId);
    void deleteByUserIdAndFilmId(Long userId, Long filmId);
    // EXISTS Subquery
    boolean existsByUserAndFilm(Long userId, Long filmId);
}
