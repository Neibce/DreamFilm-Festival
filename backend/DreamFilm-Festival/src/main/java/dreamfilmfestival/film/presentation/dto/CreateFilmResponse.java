package dreamfilmfestival.film.presentation.dto;

import dreamfilmfestival.film.domain.FilmStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class CreateFilmResponse {
    private Long filmId;
    private Long festivalId;
    private Long directorId;
    private String title;
    private String dreamText;
    private FilmStatus status;
    private LocalDateTime createdAt;
}

