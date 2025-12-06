package dreamfilmfestival.film.presentation.dto;

import dreamfilmfestival.film.domain.DreamFilm;
import dreamfilmfestival.film.domain.FilmStatus;

import java.time.LocalDateTime;

public record FilmDetailResponse(
        Long filmId,
        Long festivalId,
        Long directorId,
        String directorName,
        DirectorSummaryResponse director,
        String title,
        String dreamText,
        String aiScript,
        String summary,
        String genre,
        FilmStatus status,
        String imageUrl,
        LocalDateTime createdAt,
        int voteCount,
        int reviewCount,
        double averageRating
) {
    public static FilmDetailResponse of(DreamFilm film, String directorName, DirectorSummaryResponse director, int voteCount, int reviewCount, double averageRating) {
        return new FilmDetailResponse(
                film.getFilmId(),
                film.getFestivalId(),
                film.getDirectorId(),
                directorName,
                director,
                film.getTitle(),
                film.getDreamText(),
                film.getAiScript(),
                film.getSummary(),
                film.getGenre(),
                film.getStatus(),
                film.getImageUrl(),
                film.getCreatedAt(),
                voteCount,
                reviewCount,
                averageRating
        );
    }
}

