package dreamfilmfestival.vote.presentation;

import dreamfilmfestival.vote.application.VoteService;
import dreamfilmfestival.vote.domain.Vote;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/votes")
@RequiredArgsConstructor
public class VoteController {
    private final VoteService voteService;

    @PostMapping
    public ResponseEntity<Vote> createVote(@RequestBody Vote vote) {
        Vote createdVote = voteService.createVote(vote);
        return ResponseEntity.ok(createdVote);
    }

    @GetMapping("/{voteId}")
    public ResponseEntity<Vote> getVoteById(@PathVariable Long voteId) {
        return voteService.getVoteById(voteId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/film/{filmId}")
    public ResponseEntity<List<Vote>> getVotesByFilmId(@PathVariable Long filmId) {
        List<Vote> votes = voteService.getVotesByFilmId(filmId);
        return ResponseEntity.ok(votes);
    }

    @GetMapping("/film/{filmId}/count")
    public ResponseEntity<Integer> countVotesByFilmId(@PathVariable Long filmId) {
        int count = voteService.countVotesByFilmId(filmId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Vote>> getVotesByUserId(@PathVariable Long userId) {
        List<Vote> votes = voteService.getVotesByUserId(userId);
        return ResponseEntity.ok(votes);
    }

    @DeleteMapping("/{voteId}")
    public ResponseEntity<Void> deleteVote(@PathVariable Long voteId) {
        voteService.deleteVote(voteId);
        return ResponseEntity.noContent().build();
    }
}

