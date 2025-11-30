package dreamfilmfestival.user.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private Long userId;
    private String username;
    private String password;
    private UserRole role;
    private String email;
    private LocalDateTime createdAt;

    public static User create(String username, String rawPassword, String email, UserRole role) {
        // 도메인 규칙 검증
        validateUsername(username);
        validatePassword(rawPassword);
        validateEmail(email);
        
        String encodedPassword = passwordEncoder.encode(rawPassword);
        
        return User.builder()
                .username(username)
                .password(encodedPassword)
                .email(email)
                .role(role != null ? role : UserRole.AUDIENCE)
                .createdAt(LocalDateTime.now())
                .build();
    }

    private static void validateUsername(String username) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("사용자명은 비어있을 수 없습니다.");
        }
        if (username.length() < 2 || username.length() > 50) {
            throw new IllegalArgumentException("사용자명은 2자 이상 50자 이하여야 합니다.");
        }
    }

    private static void validatePassword(String password) {
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("비밀번호는 비어있을 수 없습니다.");
        }
        if (password.length() < 8) {
            throw new IllegalArgumentException("비밀번호는 최소 8자 이상이어야 합니다.");
        }
    }

    private static void validateEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("이메일은 비어있을 수 없습니다.");
        }
        // 간단한 이메일 형식 검증
        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new IllegalArgumentException("올바른 이메일 형식이 아닙니다.");
        }
    }

    public boolean isPasswordMatch(String rawPassword) {
        return passwordEncoder.matches(rawPassword, this.password);
    }
}

