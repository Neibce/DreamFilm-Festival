package dreamfilmfestival.film.presentation.dto;

import dreamfilmfestival.film.domain.FilmStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 영화 목록 응답 DTO
 * <p>
 * 공개된 영화 정보만 포함 (꿈 텍스트는 제외)
 */
@Getter
@Builder
@AllArgsConstructor
public class FilmListResponse {
    private Long filmId;
    private Long festivalId;
    private Long directorId;
    private String title;
    private String summary;
    private FilmStatus status;
    private String imageUrl;
    private LocalDateTime createdAt;
}

