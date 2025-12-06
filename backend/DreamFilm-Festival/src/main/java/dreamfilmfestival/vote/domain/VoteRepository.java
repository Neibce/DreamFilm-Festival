package dreamfilmfestival.vote.domain;

import java.util.List;
import java.util.Optional;

public interface VoteRepository {
    Vote save(Vote vote);
    Optional<Vote> findById(Long voteId);
    List<Vote> findByFilmId(Long filmId);
    List<Vote> findByUserId(Long userId);
    Optional<Vote> findByUserIdAndFilmId(Long userId, Long filmId);
    int countByFilmId(Long filmId);
    int countByUserId(Long userId);
    void deleteById(Long voteId);
    void deleteByUserIdAndFilmId(Long userId, Long filmId);
}

