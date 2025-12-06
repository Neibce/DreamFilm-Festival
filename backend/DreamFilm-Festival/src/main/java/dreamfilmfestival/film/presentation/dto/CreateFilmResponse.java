package dreamfilmfestival.film.presentation.dto;

import dreamfilmfestival.film.domain.FilmStatus;

import java.time.LocalDateTime;

public record CreateFilmResponse(
        Long filmId,
        Long festivalId,
        Long directorId,
        String title,
        String dreamText,
        String genre,
        FilmStatus status,
        LocalDateTime createdAt
) {
    public static CreateFilmResponse of(Long filmId, Long festivalId, Long directorId, String title,
                                        String dreamText, String genre, FilmStatus status, LocalDateTime createdAt) {
        return new CreateFilmResponse(filmId, festivalId, directorId, title, dreamText, genre, status, createdAt);
    }
}

