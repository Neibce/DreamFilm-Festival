package dreamfilmfestival.festival.infrastructure;

import dreamfilmfestival.festival.domain.FilmFestival;
import dreamfilmfestival.festival.domain.FilmFestivalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class JdbcFilmFestivalRepository implements FilmFestivalRepository {
    private final JdbcClient jdbcClient;

    @Override
    public FilmFestival save(FilmFestival festival) {
        // TODO: INSERT or UPDATE 구현
        return null;
    }

    @Override
    public Optional<FilmFestival> findById(Long festivalId) {
        // TODO: SELECT 구현
        return Optional.empty();
    }

    @Override
    public List<FilmFestival> findAll() {
        // TODO: SELECT 구현
        return List.of();
    }

    @Override
    public void deleteById(Long festivalId) {
        // TODO: DELETE 구현
    }
}

