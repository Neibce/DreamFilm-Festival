package dreamfilmfestival.festival.application;

import dreamfilmfestival.festival.domain.FilmFestival;
import dreamfilmfestival.festival.domain.FilmFestivalRepository;
import dreamfilmfestival.film.domain.DreamFilm;
import dreamfilmfestival.film.domain.DreamFilmRepository;
import dreamfilmfestival.film.domain.FilmStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FilmFestivalService {
    private final FilmFestivalRepository filmFestivalRepository;
    private final DreamFilmRepository dreamFilmRepository;

    @Transactional
    public FilmFestival createFestival(FilmFestival festival) {
        validateFestivalPeriod(festival.getStartDate(), festival.getEndDate(), null);
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
    public FilmFestival updateFestival(Long festivalId, String name, LocalDate start, LocalDate end) {
        FilmFestival festival = filmFestivalRepository.findById(festivalId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 영화제입니다."));
        validateFestivalPeriod(start, end, festivalId);
        festival.update(name, start, end);
        return filmFestivalRepository.save(festival);
    }

    @Transactional
    public void deleteFestival(Long festivalId) {
        filmFestivalRepository.deleteById(festivalId);
    }

    @Transactional(readOnly = true)
    public FestivalStats getFestivalStats(Long festivalId) {
        List<DreamFilm> films = dreamFilmRepository.findByFestivalId(festivalId);
        int total = films.size();
        int submitted = (int) films.stream().filter(f -> f.getStatus() == FilmStatus.SUBMITTED).count();
        int waitingUser = (int) films.stream().filter(f -> f.getStatus() == FilmStatus.WAITING_USER_APPROVAL).count();
        int waitingAdmin = (int) films.stream().filter(f -> f.getStatus() == FilmStatus.WAITING_ADMIN_APPROVAL).count();
        int rejected = (int) films.stream().filter(f -> f.getStatus() == FilmStatus.REJECTED).count();

        return new FestivalStats(total, submitted, waitingUser, waitingAdmin, rejected);
    }

    public record FestivalStats(int totalFilms, int submittedFilms, int waitingUserApproval,
                                int waitingAdminApproval, int rejectedFilms) {}

    private void validateFestivalPeriod(LocalDate start, LocalDate end, Long excludedFestivalId) {
        if (filmFestivalRepository.existsOverlappingFestival(start, end, excludedFestivalId)) {
            throw new IllegalArgumentException("해당 기간에 이미 영화제가 존재합니다.");
        }
    }
}

