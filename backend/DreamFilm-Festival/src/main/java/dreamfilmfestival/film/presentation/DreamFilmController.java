package dreamfilmfestival.film.presentation;

import dreamfilmfestival.film.application.DreamFilmService;
import dreamfilmfestival.film.domain.DreamFilm;
import dreamfilmfestival.film.presentation.dto.CreateFilmRequest;
import dreamfilmfestival.film.presentation.dto.CreateFilmResponse;
import dreamfilmfestival.film.presentation.dto.FilmDtoMapper;
import dreamfilmfestival.film.presentation.dto.FilmListResponse;
import dreamfilmfestival.user.domain.UserRole;
import jakarta.servlet.http.HttpSession;
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
    public ResponseEntity<CreateFilmResponse> createFilm(
            @Valid @RequestBody CreateFilmRequest request,
            HttpSession session) {
        // 세션에서 로그인한 사용자 ID 및 역할 가져오기
        Long directorId = (Long) session.getAttribute("userId");
        UserRole userRole = (UserRole) session.getAttribute("userRole");
        
        if (directorId == null || userRole == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }
        
        // 감독 역할 검증
        if (userRole != UserRole.DIRECTOR) {
            throw new IllegalArgumentException("영화 출품은 감독만 가능합니다.");
        }

        // DTO -> 도메인 파라미터 변환 (Presentation Layer 책임)
        DreamFilm film = dreamFilmService.createFilm(
                request.getFestivalId(),
                directorId,
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


