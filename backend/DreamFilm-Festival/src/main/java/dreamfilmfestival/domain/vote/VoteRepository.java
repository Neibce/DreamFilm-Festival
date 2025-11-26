package dreamfilmfestival.domain.vote;

import java.util.List;
import java.util.Optional;

public interface VoteRepository {
    Vote save(Vote vote);
    Optional<Vote> findById(Long voteId);
    List<Vote> findByFilmId(Long filmId);
    List<Vote> findByUserId(Long userId);
    int countByFilmId(Long filmId);
    void deleteById(Long voteId);
}

