package dreamfilmfestival.judge.presentation;

import dreamfilmfestival.judge.application.JudgeService;
import dreamfilmfestival.judge.domain.Judge;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/judges")
@RequiredArgsConstructor
public class JudgeController {
    private final JudgeService judgeService;

    @PostMapping
    public ResponseEntity<Judge> createJudge(@RequestBody Judge judge) {
        Judge createdJudge = judgeService.createJudge(judge);
        return ResponseEntity.ok(createdJudge);
    }

    @GetMapping("/{judgeId}")
    public ResponseEntity<Judge> getJudgeById(@PathVariable Long judgeId) {
        return judgeService.getJudgeById(judgeId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/film/{filmId}")
    public ResponseEntity<List<Judge>> getJudgesByFilmId(@PathVariable Long filmId) {
        List<Judge> judges = judgeService.getJudgesByFilmId(filmId);
        return ResponseEntity.ok(judges);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Judge>> getJudgesByUserId(@PathVariable Long userId) {
        List<Judge> judges = judgeService.getJudgesByUserId(userId);
        return ResponseEntity.ok(judges);
    }

    @DeleteMapping("/{judgeId}")
    public ResponseEntity<Void> deleteJudge(@PathVariable Long judgeId) {
        judgeService.deleteJudge(judgeId);
        return ResponseEntity.noContent().build();
    }
}

