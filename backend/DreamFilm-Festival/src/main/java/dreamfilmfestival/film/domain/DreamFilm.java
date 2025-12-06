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
    private String genre;
    private LocalDateTime createdAt;
    private FilmStatus status;
    private String imageUrl;

    public void approveByDirector(Long directorId) {
        if (directorId == null || !directorId.equals(this.directorId)) {
            throw new IllegalArgumentException("영화 승인 권한이 없는 사용자입니다.");
        }
        if (this.status != FilmStatus.WAITING_USER_APPROVAL) {
            throw new IllegalStateException("현재 상태에서 감독 승인을 할 수 없습니다.");
        }
        this.status = FilmStatus.WAITING_ADMIN_APPROVAL;
    }

    public void denyByDirector(Long directorId) {
        if (directorId == null || !directorId.equals(this.directorId)) {
            throw new IllegalArgumentException("영화 거절 권한이 없는 사용자입니다.");
        }
        if (this.status != FilmStatus.WAITING_USER_APPROVAL) {
            throw new IllegalStateException("현재 상태에서 거절할 수 없습니다.");
        }
        this.status = FilmStatus.REJECTED;
    }

    public void approveByAdmin() {
        if (this.status != FilmStatus.WAITING_ADMIN_APPROVAL) {
            throw new IllegalStateException("현재 상태에서 관리자 승인을 할 수 없습니다.");
        }
        this.status = FilmStatus.SUBMITTED;
    }

    public void rejectByAdmin() {
        if (this.status == FilmStatus.REJECTED) {
            return;
        }
        if (this.status == FilmStatus.SUBMITTED) {
            throw new IllegalStateException("이미 출품 완료된 영화는 반려할 수 없습니다.");
        }
        this.status = FilmStatus.REJECTED;
    }

    public static DreamFilm create(Long festivalId, Long directorId, String title, String dreamText, String genre) {
        return DreamFilm.builder()
                .festivalId(festivalId)
                .directorId(directorId)
                .title(title)
                .dreamText(dreamText)
                .genre(genre)
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
    }

    public void readyForUserApproval() {
        if (this.status != FilmStatus.WAITING_AI_GENERATION) {
            throw new IllegalStateException(
                    String.format("'%s' 상태에서만 사용자 승인 대기로 전환할 수 있습니다. 현재 상태: %s",
                            FilmStatus.WAITING_AI_GENERATION.getDescription(),
                            this.status.getDescription())
            );
        }
        this.status = FilmStatus.WAITING_USER_APPROVAL;
    }

    public void updateImageUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            throw new IllegalArgumentException("이미지 URL은 비어있을 수 없습니다.");
        }
        this.imageUrl = imageUrl;
    }
}

