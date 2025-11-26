package dreamfilmfestival.film.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DreamFilm {
    private Long filmId;
    private Long festivalId;
    private Long directorId;
    private String title;
    private String dreamText;
    private String aiScript;
    private String summary;
    private LocalDateTime createdAt;
    private String status;
    private String imageUrl;
}

