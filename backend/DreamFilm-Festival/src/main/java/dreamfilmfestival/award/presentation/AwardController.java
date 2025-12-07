package dreamfilmfestival.award.presentation;

import dreamfilmfestival.award.application.AwardService;
import dreamfilmfestival.award.presentation.dto.AwardResponse;
import dreamfilmfestival.award.presentation.dto.AwardRankingResponse;
import dreamfilmfestival.award.presentation.dto.AwardPopularityResponse;
import dreamfilmfestival.award.application.AwardQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/awards")
@RequiredArgsConstructor
public class AwardController {
    private final AwardService awardService;
    private final AwardQueryService awardQueryService;

    @GetMapping("/festival/{festivalId}")
    public ResponseEntity<List<AwardResponse>> getAwardsByFestivalId(@PathVariable Long festivalId) {
        List<AwardResponse> awards = awardService.getAwardsByFestivalId(festivalId)
                .stream()
                .map(AwardResponse::from)
                .toList();
        return ResponseEntity.ok(awards);
    }

    @GetMapping("/rankings")
    public ResponseEntity<List<AwardRankingResponse>> getRankings(@RequestParam Long festivalId,
                                                                  @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(awardQueryService.getTopRankings(festivalId, limit));
    }

    @GetMapping("/popularity")
    public ResponseEntity<List<AwardPopularityResponse>> getPopularity(@RequestParam Long festivalId,
                                                                       @RequestParam(defaultValue = "3") int limit) {
        return ResponseEntity.ok(awardQueryService.getTopPopularity(festivalId, limit));
    }

    @PostMapping("/finalize")
    public ResponseEntity<List<AwardResponse>> finalizeAwards(@RequestParam Long festivalId,
                                                              @RequestParam(defaultValue = "5") int rankingLimit,
                                                              @RequestParam(defaultValue = "1") int popularityLimit) {
        List<AwardResponse> responses = awardService.finalizeAwards(festivalId, rankingLimit, popularityLimit)
                .stream()
                .map(AwardResponse::from)
                .toList();
        return ResponseEntity.status(HttpStatus.CREATED).body(responses);
    }
}
