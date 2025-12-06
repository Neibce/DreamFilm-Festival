package dreamfilmfestival.user.presentation.dto;

import dreamfilmfestival.user.domain.UserRole;
import jakarta.validation.constraints.NotNull;

public record UpdateUserRoleRequest(
        @NotNull UserRole role
) {
    public static UpdateUserRoleRequest of(UserRole role) {
        return new UpdateUserRoleRequest(role);
    }
}

