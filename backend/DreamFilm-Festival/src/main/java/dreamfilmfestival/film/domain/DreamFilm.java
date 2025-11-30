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
    private FilmStatus status;
    private String imageUrl;

    public static DreamFilm create(Long festivalId, Long directorId, String title, String dreamText) {
        return DreamFilm.builder()
                .festivalId(festivalId)
                .directorId(directorId)
                .title(title)
                .dreamText(dreamText)
                .status(FilmStatus.WAITING_AI_GENERATION)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public void updateAiScript(String aiScript, String summary) {
        if (this.status != FilmStatus.WAITING_AI_GENERATION) {
            throw new IllegalStateException(
                    String.format("AI 스크립트는 '%s' 상태에서만 업데이트 가능합니다. 현재 상태: %s",
                            FilmStatus.WAITING_AI_GENERATION.getDescription(),
                            this.status.getDescription())
            );
        }
        if (aiScript == null || aiScript.isBlank()) {
            throw new IllegalArgumentException("AI 스크립트는 비어있을 수 없습니다.");
        }
        if (summary == null || summary.isBlank()) {
            throw new IllegalArgumentException("요약은 비어있을 수 없습니다.");
        }
        
        this.aiScript = aiScript;
        this.summary = summary;
        this.status = FilmStatus.WAITING_USER_APPROVAL;
    }

    public void updateImageUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            throw new IllegalArgumentException("이미지 URL은 비어있을 수 없습니다.");
        }
        this.imageUrl = imageUrl;
    }
}

