package dreamfilmfestival.festival.domain;

import java.util.List;
import java.util.Optional;

public interface FilmFestivalRepository {
    FilmFestival save(FilmFestival festival);
    Optional<FilmFestival> findById(Long festivalId);
    List<FilmFestival> findAll();
    List<FilmFestival> findOngoingFestivals();
    void deleteById(Long festivalId);
}

