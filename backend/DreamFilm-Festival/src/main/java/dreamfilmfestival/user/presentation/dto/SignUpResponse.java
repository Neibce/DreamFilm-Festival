package dreamfilmfestival.user.presentation.dto;

import dreamfilmfestival.user.domain.UserRole;

import java.time.LocalDateTime;

public record SignUpResponse(
        Long userId,
        String username,
        String email,
        UserRole role,
        LocalDateTime createdAt
) {
    public static SignUpResponse of(Long userId, String username, String email, UserRole role, LocalDateTime createdAt) {
        return new SignUpResponse(userId, username, email, role, createdAt);
    }
}

