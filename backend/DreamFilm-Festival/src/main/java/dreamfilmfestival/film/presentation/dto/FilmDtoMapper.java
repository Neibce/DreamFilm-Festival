package dreamfilmfestival.film.presentation.dto;

import dreamfilmfestival.film.application.FilmStats;
import dreamfilmfestival.film.domain.DreamFilm;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * DreamFilm Entity ↔ DTO 변환 담당 (Presentation Layer)
 * <p>
 * Single Responsibility: DTO 변환만 담당
 */
@Component
public class FilmDtoMapper {

    public CreateFilmResponse toCreateFilmResponse(DreamFilm film) {
        return CreateFilmResponse.of(
                film.getFilmId(),
                film.getFestivalId(),
                film.getDirectorId(),
                film.getTitle(),
                film.getDreamText(),
                film.getGenre(),
                film.getStatus(),
                film.getCreatedAt()
        );
    }

    public FilmListResponse toFilmListResponse(DreamFilm film, DirectorSummaryResponse directorSummary, FilmStats stats) {
        String directorName = directorSummary != null ? directorSummary.username() : null;
        int voteCount = stats != null ? stats.voteCount() : 0;
        int reviewCount = stats != null ? stats.reviewCount() : 0;
        double averageRating = stats != null ? stats.averageRating() : 0.0;

        return FilmListResponse.of(
                film.getFilmId(),
                film.getFestivalId(),
                film.getDirectorId(),
                directorName,
                directorSummary,
                film.getTitle(),
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

    public List<FilmListResponse> toFilmListResponseList(List<DreamFilm> films,
                                                         List<DirectorSummaryResponse> directors,
                                                         Map<Long, FilmStats> statsByFilmId) {
        return films.stream()
                .map(film -> {
                    DirectorSummaryResponse director = directors.stream()
                            .filter(d -> d != null && d.directorId() != null && d.directorId().equals(film.getDirectorId()))
                            .findFirst()
                            .orElse(null);
                    FilmStats stats = statsByFilmId.getOrDefault(film.getFilmId(), new FilmStats(0, 0, 0.0));
                    return toFilmListResponse(film, director, stats);
                })
                .collect(Collectors.toList());
    }
}

