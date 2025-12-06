package dreamfilmfestival.user.presentation.dto;

import dreamfilmfestival.user.domain.User;
import dreamfilmfestival.user.domain.UserRole;

import java.time.LocalDateTime;

public record UserSummaryResponse(
        Long userId,
        String username,
        String email,
        UserRole role,
        LocalDateTime createdAt
) {
    public static UserSummaryResponse from(User user) {
        return new UserSummaryResponse(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}

