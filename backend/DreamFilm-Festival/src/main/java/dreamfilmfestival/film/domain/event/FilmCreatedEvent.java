package dreamfilmfestival.film.domain.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FilmCreatedEvent {
    private Long filmId;
    private String dreamText;
}

