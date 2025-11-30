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
        return SignUpResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public LoginResponse toLoginResponse(User user) {
        return LoginResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}

