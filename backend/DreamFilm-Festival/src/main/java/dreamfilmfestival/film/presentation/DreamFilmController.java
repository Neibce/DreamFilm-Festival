package dreamfilmfestival.film.presentation;

import dreamfilmfestival.film.application.DreamFilmService;
import dreamfilmfestival.film.domain.DreamFilm;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/films")
@RequiredArgsConstructor
public class DreamFilmController {
    private final DreamFilmService dreamFilmService;

    @PostMapping
    public ResponseEntity<DreamFilm> createFilm(@RequestBody DreamFilm film) {
        DreamFilm createdFilm = dreamFilmService.createFilm(film);
        return ResponseEntity.ok(createdFilm);
    }

    @GetMapping("/{filmId}")
    public ResponseEntity<DreamFilm> getFilmById(@PathVariable Long filmId) {
        return dreamFilmService.getFilmById(filmId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<DreamFilm>> getAllFilms() {
        List<DreamFilm> films = dreamFilmService.getAllFilms();
        return ResponseEntity.ok(films);
    }

    @GetMapping("/festival/{festivalId}")
    public ResponseEntity<List<DreamFilm>> getFilmsByFestivalId(@PathVariable Long festivalId) {
        List<DreamFilm> films = dreamFilmService.getFilmsByFestivalId(festivalId);
        return ResponseEntity.ok(films);
    }

    @GetMapping("/director/{directorId}")
    public ResponseEntity<List<DreamFilm>> getFilmsByDirectorId(@PathVariable Long directorId) {
        List<DreamFilm> films = dreamFilmService.getFilmsByDirectorId(directorId);
        return ResponseEntity.ok(films);
    }

    @DeleteMapping("/{filmId}")
    public ResponseEntity<Void> deleteFilm(@PathVariable Long filmId) {
        dreamFilmService.deleteFilm(filmId);
        return ResponseEntity.noContent().build();
    }
}

