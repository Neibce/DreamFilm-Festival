package dreamfilmfestival.film.presentation;

import dreamfilmfestival.film.application.DreamFilmService;
import dreamfilmfestival.film.domain.DreamFilm;
import dreamfilmfestival.film.presentation.dto.CreateFilmRequest;
import dreamfilmfestival.film.presentation.dto.CreateFilmResponse;
import dreamfilmfestival.film.presentation.dto.FilmDtoMapper;
import dreamfilmfestival.film.presentation.dto.FilmListResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/films")
@RequiredArgsConstructor
public class DreamFilmController {
    private final DreamFilmService dreamFilmService;
    private final FilmDtoMapper filmDtoMapper;

    @PostMapping
    public ResponseEntity<CreateFilmResponse> createFilm(@Valid @RequestBody CreateFilmRequest request) {
        // DTO -> 도메인 파라미터 변환 (Presentation Layer 책임)
        DreamFilm film = dreamFilmService.createFilm(
                request.getFestivalId(),
                request.getDirectorId(),
                request.getTitle(),
                request.getDreamText()
        );
        CreateFilmResponse response = filmDtoMapper.toCreateFilmResponse(film);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<FilmListResponse>> getSubmittedFilms() {
        List<DreamFilm> films = dreamFilmService.getSubmittedFilms();
        List<FilmListResponse> response = filmDtoMapper.toFilmListResponseList(films);
        return ResponseEntity.ok(response);
    }
}


