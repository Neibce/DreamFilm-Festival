package dreamfilmfestival.film.application;

import dreamfilmfestival.film.domain.DreamFilm;
import dreamfilmfestival.film.domain.DreamFilmRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DreamFilmService {
    private final DreamFilmRepository dreamFilmRepository;

    public DreamFilm createFilm(DreamFilm film) {
        return dreamFilmRepository.save(film);
    }

    public Optional<DreamFilm> getFilmById(Long filmId) {
        return dreamFilmRepository.findById(filmId);
    }

    public List<DreamFilm> getAllFilms() {
        return dreamFilmRepository.findAll();
    }

    public List<DreamFilm> getFilmsByFestivalId(Long festivalId) {
        return dreamFilmRepository.findByFestivalId(festivalId);
    }

    public List<DreamFilm> getFilmsByDirectorId(Long directorId) {
        return dreamFilmRepository.findByDirectorId(directorId);
    }

    public void deleteFilm(Long filmId) {
        dreamFilmRepository.deleteById(filmId);
    }
}

