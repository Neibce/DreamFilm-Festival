package dreamfilmfestival.vote.application;

import dreamfilmfestival.vote.domain.Vote;
import dreamfilmfestival.vote.domain.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VoteService {
    private final VoteRepository voteRepository;

    public Vote createVote(Vote vote) {
        return voteRepository.save(vote);
    }

    public Optional<Vote> getVoteById(Long voteId) {
        return voteRepository.findById(voteId);
    }

    public List<Vote> getVotesByFilmId(Long filmId) {
        return voteRepository.findByFilmId(filmId);
    }

    public List<Vote> getVotesByUserId(Long userId) {
        return voteRepository.findByUserId(userId);
    }

    public int countVotesByFilmId(Long filmId) {
        return voteRepository.countByFilmId(filmId);
    }

    public void deleteVote(Long voteId) {
        voteRepository.deleteById(voteId);
    }
}

