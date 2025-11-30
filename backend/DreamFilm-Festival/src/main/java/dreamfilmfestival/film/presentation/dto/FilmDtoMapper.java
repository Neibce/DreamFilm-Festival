package dreamfilmfestival.film.presentation.dto;

import dreamfilmfestival.film.domain.DreamFilm;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * DreamFilm Entity ↔ DTO 변환 담당 (Presentation Layer)
 * <p>
 * Single Responsibility: DTO 변환만 담당
 */
@Component
public class FilmDtoMapper {

    public CreateFilmResponse toCreateFilmResponse(DreamFilm film) {
        return CreateFilmResponse.builder()
                .filmId(film.getFilmId())
                .festivalId(film.getFestivalId())
                .directorId(film.getDirectorId())
                .title(film.getTitle())
                .dreamText(film.getDreamText())
                .status(film.getStatus())
                .createdAt(film.getCreatedAt())
                .build();
    }

    public FilmListResponse toFilmListResponse(DreamFilm film) {
        return FilmListResponse.builder()
                .filmId(film.getFilmId())
                .festivalId(film.getFestivalId())
                .directorId(film.getDirectorId())
                .title(film.getTitle())
                .summary(film.getSummary())
                .status(film.getStatus())
                .imageUrl(film.getImageUrl())
                .createdAt(film.getCreatedAt())
                .build();
    }

    public List<FilmListResponse> toFilmListResponseList(List<DreamFilm> films) {
        return films.stream()
                .map(this::toFilmListResponse)
                .collect(Collectors.toList());
    }
}

