package dreamfilmfestival.film.domain;

import java.util.List;
import java.util.Optional;

public interface DreamFilmRepository {
    DreamFilm save(DreamFilm film);
    Optional<DreamFilm> findById(Long filmId);
    List<DreamFilm> findAll();
    List<DreamFilm> findByFestivalId(Long festivalId);
    List<DreamFilm> findByDirectorId(Long directorId);
    void deleteById(Long filmId);
}

