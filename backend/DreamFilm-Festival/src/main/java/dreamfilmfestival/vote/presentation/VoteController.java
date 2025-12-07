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
}
