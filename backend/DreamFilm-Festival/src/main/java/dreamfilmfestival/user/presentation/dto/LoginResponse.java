package dreamfilmfestival.user.presentation.dto;

import dreamfilmfestival.user.domain.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class LoginResponse {
    private Long userId;
    private String username;
    private String email;
    private UserRole role;
}

