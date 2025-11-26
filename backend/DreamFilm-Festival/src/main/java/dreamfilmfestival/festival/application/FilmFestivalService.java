package dreamfilmfestival.festival.application;

import dreamfilmfestival.festival.domain.FilmFestival;
import dreamfilmfestival.festival.domain.FilmFestivalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FilmFestivalService {
    private final FilmFestivalRepository filmFestivalRepository;

    public FilmFestival createFestival(FilmFestival festival) {
        return filmFestivalRepository.save(festival);
    }

    public Optional<FilmFestival> getFestivalById(Long festivalId) {
        return filmFestivalRepository.findById(festivalId);
    }

    public List<FilmFestival> getAllFestivals() {
        return filmFestivalRepository.findAll();
    }

    public void deleteFestival(Long festivalId) {
        filmFestivalRepository.deleteById(festivalId);
    }
}

