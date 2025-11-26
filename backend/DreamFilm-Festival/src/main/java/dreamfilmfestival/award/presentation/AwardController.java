package dreamfilmfestival.award.presentation;

import dreamfilmfestival.award.application.AwardService;
import dreamfilmfestival.award.domain.Award;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/awards")
@RequiredArgsConstructor
public class AwardController {
    private final AwardService awardService;

    @PostMapping
    public ResponseEntity<Award> createAward(@RequestBody Award award) {
        Award createdAward = awardService.createAward(award);
        return ResponseEntity.ok(createdAward);
    }

    @GetMapping("/{awardId}")
    public ResponseEntity<Award> getAwardById(@PathVariable Long awardId) {
        return awardService.getAwardById(awardId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/film/{filmId}")
    public ResponseEntity<List<Award>> getAwardsByFilmId(@PathVariable Long filmId) {
        List<Award> awards = awardService.getAwardsByFilmId(filmId);
        return ResponseEntity.ok(awards);
    }

    @GetMapping("/festival/{festivalId}")
    public ResponseEntity<List<Award>> getAwardsByFestivalId(@PathVariable Long festivalId) {
        List<Award> awards = awardService.getAwardsByFestivalId(festivalId);
        return ResponseEntity.ok(awards);
    }

    @DeleteMapping("/{awardId}")
    public ResponseEntity<Void> deleteAward(@PathVariable Long awardId) {
        awardService.deleteAward(awardId);
        return ResponseEntity.noContent().build();
    }
}

