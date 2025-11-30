package dreamfilmfestival.festival.application;

import dreamfilmfestival.festival.domain.FilmFestival;
import dreamfilmfestival.festival.domain.FilmFestivalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FilmFestivalService {
    private final FilmFestivalRepository filmFestivalRepository;

    @Transactional
    public FilmFestival createFestival(FilmFestival festival) {
        return filmFestivalRepository.save(festival);
    }

    @Transactional(readOnly = true)
    public Optional<FilmFestival> getFestivalById(Long festivalId) {
        return filmFestivalRepository.findById(festivalId);
    }

    @Transactional(readOnly = true)
    public List<FilmFestival> getAllFestivals() {
        return filmFestivalRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<FilmFestival> getOngoingFestivals() {
        return filmFestivalRepository.findOngoingFestivals();
    }

    @Transactional
    public void deleteFestival(Long festivalId) {
        filmFestivalRepository.deleteById(festivalId);
    }
}

