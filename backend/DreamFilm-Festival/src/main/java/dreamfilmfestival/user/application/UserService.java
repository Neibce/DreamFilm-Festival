package dreamfilmfestival.user.application;

import dreamfilmfestival.user.domain.User;
import dreamfilmfestival.user.domain.UserRepository;
import dreamfilmfestival.user.domain.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Transactional
    public User signUp(String username, String rawPassword, String email, UserRole role) {
        // 이메일 중복 체크
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        // User 생성 (내부에서 비밀번호 암호화)
        User user = User.create(username, rawPassword, email, role);

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public java.util.List<User> findAll(String sortField, String sortDirection) {
        return userRepository.findAll(sortField, sortDirection);
    }

    @Transactional
    public User updateRole(Long userId, UserRole role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        User updated = User.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .password(user.getPassword())
                .role(role)
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();
        return userRepository.save(updated);
    }
}

