package dreamfilmfestival.vote.application;

import dreamfilmfestival.vote.domain.Vote;
import dreamfilmfestival.vote.domain.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VoteService {
    private final VoteRepository voteRepository;

    public Vote createVote(Long filmId, Long userId) {
        if (userId == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        // COUNT로 투표 수 체크
        int voteCount = voteRepository.countByUserId(userId);
        if (voteCount >= 3) {
            throw new IllegalStateException("사용자당 최대 3개 작품만 투표할 수 있습니다.");
        }

        // EXISTS Subquery로 중복 투표 체크
        if (voteRepository.existsByUserAndFilm(userId, filmId)) {
            throw new IllegalArgumentException("이미 해당 작품에 투표했습니다.");
        }

        Vote vote = Vote.builder()
                .filmId(filmId)
                .userId(userId)
                .build();

        return voteRepository.save(vote);
    }

    public List<Vote> getVotesByUserId(Long userId) {
        return voteRepository.findByUserId(userId);
    }

    public int countVotesByUserId(Long userId) {
        return voteRepository.countByUserId(userId);
    }

    public int getRemainingVotes(Long userId, int limit) {
        if (userId == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }
        int used = voteRepository.countByUserId(userId);
        int remaining = limit - used;
        return Math.max(remaining, 0);
    }

    public int countVotesByFilmId(Long filmId) {
        return voteRepository.countByFilmId(filmId);
    }

    public void deleteVoteByUserAndFilm(Long userId, Long filmId) {
        if (userId == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        var existing = voteRepository.findByUserIdAndFilmId(userId, filmId);
        if (existing.isEmpty()) {
            throw new IllegalArgumentException("해당 작품에 대한 투표가 없습니다.");
        }

        voteRepository.deleteByUserIdAndFilmId(userId, filmId);
    }
}
