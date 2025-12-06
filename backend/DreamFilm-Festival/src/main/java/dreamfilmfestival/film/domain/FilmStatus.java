package dreamfilmfestival.film.domain;

public enum FilmStatus {
    WAITING_AI_GENERATION("AI 생성 대기중"),
    WAITING_USER_APPROVAL("사용자 승인 대기 중"),
    WAITING_ADMIN_APPROVAL("관리자 승인 대기중"),
    SUBMITTED("출품 완료"),
    REJECTED("반려");

    private final String description;

    FilmStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}

