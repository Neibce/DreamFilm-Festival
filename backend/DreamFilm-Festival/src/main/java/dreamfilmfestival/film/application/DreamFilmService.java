package dreamfilmfestival.film.application;

import dreamfilmfestival.film.domain.DreamFilm;
import dreamfilmfestival.film.domain.DreamFilmRepository;
import dreamfilmfestival.film.domain.FilmStatus;
import dreamfilmfestival.film.domain.event.FilmCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DreamFilmService {
    private final DreamFilmRepository dreamFilmRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public DreamFilm createFilm(Long festivalId, Long directorId, String title, String dreamText) {
        // DreamFilm 생성 (AI 생성 대기 상태)
        DreamFilm film = DreamFilm.create(festivalId, directorId, title, dreamText);

        DreamFilm savedFilm = dreamFilmRepository.save(film);

        // 도메인 이벤트 발행 (AI 시나리오 생성)
        eventPublisher.publishEvent(new FilmCreatedEvent(savedFilm.getFilmId(), savedFilm.getDreamText()));

        return savedFilm;
    }

    @Transactional(readOnly = true)
    public List<DreamFilm> getSubmittedFilms() {
        return dreamFilmRepository.findByStatus(FilmStatus.SUBMITTED);
    }
}

