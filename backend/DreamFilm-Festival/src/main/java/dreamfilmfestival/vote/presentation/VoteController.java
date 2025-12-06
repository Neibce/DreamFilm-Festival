package dreamfilmfestival.vote.presentation;

import dreamfilmfestival.user.domain.UserRepository;
import dreamfilmfestival.user.domain.UserRole;
import dreamfilmfestival.vote.application.VoteService;
import dreamfilmfestival.vote.domain.Vote;
import dreamfilmfestival.vote.presentation.dto.CreateVoteRequest;
import dreamfilmfestival.vote.presentation.dto.VoteSummaryResponse;
import dreamfilmfestival.vote.presentation.dto.VoteResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/votes")
@RequiredArgsConstructor
public class VoteController {
    private final VoteService voteService;
    private final UserRepository userRepository;
    private static final int VOTE_LIMIT = 3;

    @PostMapping
    public ResponseEntity<VoteResponse> createVote(
            @Valid @RequestBody CreateVoteRequest request,
            HttpSession session
    ) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("사용자 정보를 찾을 수 없습니다."));
        if (user.getRole() != UserRole.AUDIENCE) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Vote createdVote = voteService.createVote(request.filmId(), userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(VoteResponse.from(createdVote));
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

    @GetMapping("/me")
    public ResponseEntity<List<VoteResponse>> getVotesForCurrentUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<Vote> votes = voteService.getVotesByUserId(userId);
        List<VoteResponse> responses = votes.stream()
                .map(VoteResponse::from)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/me/summary")
    public ResponseEntity<VoteSummaryResponse> getVoteSummary(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        int used = voteService.countVotesByUserId(userId);
        int remaining = voteService.getRemainingVotes(userId, VOTE_LIMIT);
        return ResponseEntity.ok(VoteSummaryResponse.of(used, remaining, VOTE_LIMIT));
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

    @DeleteMapping("/film/{filmId}")
    public ResponseEntity<Void> deleteVoteByFilm(
            @PathVariable Long filmId,
            HttpSession session
    ) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("사용자 정보를 찾을 수 없습니다."));
        if (user.getRole() != UserRole.AUDIENCE) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        voteService.deleteVoteByUserAndFilm(userId, filmId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{voteId}")
    public ResponseEntity<Void> deleteVote(@PathVariable Long voteId) {
        voteService.deleteVote(voteId);
        return ResponseEntity.noContent().build();
    }
}

