package dreamfilmfestival.festival.domain;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FilmFestivalRepository {
    FilmFestival save(FilmFestival festival);
    Optional<FilmFestival> findById(Long festivalId);
    List<FilmFestival> findAll();
    List<FilmFestival> findOngoingFestivals();
    boolean existsOverlappingFestival(LocalDate startDate, LocalDate endDate, Long excludedFestivalId);
    void deleteById(Long festivalId);
}

