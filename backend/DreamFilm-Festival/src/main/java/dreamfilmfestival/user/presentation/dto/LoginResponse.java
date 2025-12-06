package dreamfilmfestival.user.presentation.dto;

import dreamfilmfestival.user.domain.UserRole;

public record LoginResponse(
        Long userId,
        String username,
        String email,
        UserRole role
) {
    public static LoginResponse of(Long userId, String username, String email, UserRole role) {
        return new LoginResponse(userId, username, email, role);
    }
}

