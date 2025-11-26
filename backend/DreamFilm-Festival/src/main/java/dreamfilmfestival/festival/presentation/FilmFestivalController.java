package dreamfilmfestival.festival.presentation;

import dreamfilmfestival.festival.application.FilmFestivalService;
import dreamfilmfestival.festival.domain.FilmFestival;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/festivals")
@RequiredArgsConstructor
public class FilmFestivalController {
    private final FilmFestivalService filmFestivalService;

    @PostMapping
    public ResponseEntity<FilmFestival> createFestival(@RequestBody FilmFestival festival) {
        FilmFestival createdFestival = filmFestivalService.createFestival(festival);
        return ResponseEntity.ok(createdFestival);
    }

    @GetMapping("/{festivalId}")
    public ResponseEntity<FilmFestival> getFestivalById(@PathVariable Long festivalId) {
        return filmFestivalService.getFestivalById(festivalId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<FilmFestival>> getAllFestivals() {
        List<FilmFestival> festivals = filmFestivalService.getAllFestivals();
        return ResponseEntity.ok(festivals);
    }

    @DeleteMapping("/{festivalId}")
    public ResponseEntity<Void> deleteFestival(@PathVariable Long festivalId) {
        filmFestivalService.deleteFestival(festivalId);
        return ResponseEntity.noContent().build();
    }
}

