package dreamfilmfestival.film.infrastructure;

import dreamfilmfestival.film.domain.DreamFilm;
import dreamfilmfestival.film.domain.DreamFilmRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class JdbcDreamFilmRepository implements DreamFilmRepository {
    private final JdbcClient jdbcClient;

    @Override
    public DreamFilm save(DreamFilm film) {
        // TODO: INSERT or UPDATE 구현
        return null;
    }

    @Override
    public Optional<DreamFilm> findById(Long filmId) {
        // TODO: SELECT 구현
        return Optional.empty();
    }

    @Override
    public List<DreamFilm> findAll() {
        // TODO: SELECT 구현
        return List.of();
    }

    @Override
    public List<DreamFilm> findByFestivalId(Long festivalId) {
        // TODO: SELECT 구현
        return List.of();
    }

    @Override
    public List<DreamFilm> findByDirectorId(Long directorId) {
        // TODO: SELECT 구현
        return List.of();
    }

    @Override
    public void deleteById(Long filmId) {
        // TODO: DELETE 구현
    }
}

