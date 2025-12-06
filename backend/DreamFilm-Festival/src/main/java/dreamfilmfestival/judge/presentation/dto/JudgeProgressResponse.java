package dreamfilmfestival.judge.presentation.dto;

public record JudgeProgressResponse(
        Long userId,
        String username,
        String email,
        int totalFilms,
        int reviewedFilms,
        int pendingFilms,
        int completionRate
) {
    public static JudgeProgressResponse of(Long userId, String username, String email, int totalFilms, int reviewedFilms, int pendingFilms, int completionRate) {
        return new JudgeProgressResponse(userId, username, email, totalFilms, reviewedFilms, pendingFilms, completionRate);
    }
}

