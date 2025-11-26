package dreamfilmfestival.vote.infrastructure;

import dreamfilmfestival.vote.domain.Vote;
import dreamfilmfestival.vote.domain.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class JdbcVoteRepository implements VoteRepository {
    private final JdbcClient jdbcClient;

    @Override
    public Vote save(Vote vote) {
        // TODO: INSERT or UPDATE 구현
        return null;
    }

    @Override
    public Optional<Vote> findById(Long voteId) {
        // TODO: SELECT 구현
        return Optional.empty();
    }

    @Override
    public List<Vote> findByFilmId(Long filmId) {
        // TODO: SELECT 구현
        return List.of();
    }

    @Override
    public List<Vote> findByUserId(Long userId) {
        // TODO: SELECT 구현
        return List.of();
    }

    @Override
    public int countByFilmId(Long filmId) {
        // TODO: SELECT COUNT 구현
        return 0;
    }

    @Override
    public void deleteById(Long voteId) {
        // TODO: DELETE 구현
    }
}

