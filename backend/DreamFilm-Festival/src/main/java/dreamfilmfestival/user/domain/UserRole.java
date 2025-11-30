package dreamfilmfestival.user.domain;

public enum UserRole {
    DIRECTOR("감독"),      // 꿈 출품자
    AUDIENCE("관객"),      // 투표 및 리뷰 작성
    JUDGE("심사위원"),     // 작품 심사 및 점수 부여
    ADMIN("운영자");       // 영화제 운영 및 관리

    private final String description;

    UserRole(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}

