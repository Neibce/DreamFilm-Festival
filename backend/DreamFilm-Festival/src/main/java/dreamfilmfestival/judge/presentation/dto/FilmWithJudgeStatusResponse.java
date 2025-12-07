package dreamfilmfestival.judge.presentation.dto;

public record FilmWithJudgeStatusResponse(
        Long filmId,
        String title,
        String directorName,
        String genre,
        String imageUrl,
        String status,  // "심사 대기" or "심사 완료"
        JudgeResponse judgeScore  // 심사 완료 시 점수 정보, 대기 시 null
) {
    public static FilmWithJudgeStatusResponse of(
            Long filmId,
            String title,
            String directorName,
            String genre,
            String imageUrl,
            boolean judged,
            JudgeResponse judgeScore
    ) {
        return new FilmWithJudgeStatusResponse(
                filmId,
                title,
                directorName,
                genre,
                imageUrl,
                judged ? "심사 완료" : "심사 대기",
                judgeScore
        );
    }
}
