package dreamfilmfestival.film.presentation.dto;

public record DirectorSummaryResponse(
        Long directorId,
        String username,
        String email,
        String role
) {
    public static DirectorSummaryResponse from(Long directorId, String username, String email, String role) {
        return new DirectorSummaryResponse(directorId, username, email, role);
    }
}

