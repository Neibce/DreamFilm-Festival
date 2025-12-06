package dreamfilmfestival.film.presentation.dto;

import dreamfilmfestival.film.domain.FilmStatus;

import java.time.LocalDateTime;

/**
 * 영화 목록 응답 DTO
 * <p>
 * 공개된 영화 정보만 포함 (꿈 텍스트는 제외)
 */
public record FilmListResponse(
        Long filmId,
        Long festivalId,
        Long directorId,
        String directorName,
        DirectorSummaryResponse director,
        String title,
        String summary,
        String genre,
        FilmStatus status,
        String imageUrl,
        LocalDateTime createdAt,
        int voteCount,
        int reviewCount,
        double averageRating
) {
    public static FilmListResponse of(Long filmId, Long festivalId, Long directorId, String directorName,
                                      DirectorSummaryResponse director, String title,
                                      String summary, String genre, FilmStatus status,
                                      String imageUrl, LocalDateTime createdAt,
                                      int voteCount, int reviewCount, double averageRating) {
        return new FilmListResponse(
                filmId, festivalId, directorId, directorName, director,
                title, summary, genre, status, imageUrl, createdAt,
                voteCount, reviewCount, averageRating
        );
    }
}

