package dreamfilmfestival.user.presentation.dto;

import dreamfilmfestival.user.domain.User;
import org.springframework.stereotype.Component;

/**
 * User Entity ↔ DTO 변환 담당 (Presentation Layer)
 * <p>
 * Single Responsibility: DTO 변환만 담당
 */
@Component
public class UserDtoMapper {

    public SignUpResponse toSignUpResponse(User user) {
        return SignUpResponse.of(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }

    public LoginResponse toLoginResponse(User user) {
        return LoginResponse.of(
            user.getUserId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole()
        );
    }
}

