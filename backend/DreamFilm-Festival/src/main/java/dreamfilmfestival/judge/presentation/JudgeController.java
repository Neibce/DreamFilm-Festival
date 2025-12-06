package dreamfilmfestival.judge.presentation;

import dreamfilmfestival.judge.application.JudgeQueryService;
import dreamfilmfestival.judge.application.JudgeService;
import dreamfilmfestival.judge.domain.Judge;
import dreamfilmfestival.judge.presentation.dto.JudgeProgressResponse;
import dreamfilmfestival.judge.presentation.dto.JudgeResponse;
import dreamfilmfestival.judge.presentation.dto.JudgeSubmitRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/judges")
@RequiredArgsConstructor
public class JudgeController {
    private final JudgeService judgeService;
    private final JudgeQueryService judgeQueryService;

    @GetMapping("/progress")
    public ResponseEntity<List<JudgeProgressResponse>> getProgress() {
        List<JudgeProgressResponse> responses = judgeQueryService.getProgress().stream()
                .map(p -> JudgeProgressResponse.of(
                        p.userId(),
                        p.username(),
                        p.email(),
                        p.totalFilms(),
                        p.reviewedFilms(),
                        p.pendingFilms(),
                        p.completionRate()
                ))
                .toList();
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/film/{filmId}")
    public ResponseEntity<JudgeResponse> submitScores(
            @PathVariable Long filmId,
            @Valid @RequestBody JudgeSubmitRequest request,
            HttpSession session
    ) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }
        Judge saved = judgeService.submitScores(
                filmId,
                userId,
                request.creativity(),
                request.execution(),
                request.emotionalImpact(),
                request.storytelling(),
                request.comment()
        );
        return ResponseEntity.ok(JudgeResponse.from(saved));
    }

    @GetMapping("/film/{filmId}/me")
    public ResponseEntity<JudgeResponse> getMyScore(
            @PathVariable Long filmId,
            HttpSession session
    ) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }
        return judgeService.findByFilmIdAndUserId(filmId, userId)
                .map(JudgeResponse::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }
}

