package dreamfilmfestival.user.infrastructure;

import dreamfilmfestival.user.domain.User;
import dreamfilmfestival.user.domain.UserRepository;
import dreamfilmfestival.user.domain.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class JdbcUserRepository implements UserRepository {
    private final JdbcClient jdbcClient;

    @Override
    public User save(User user) {
        if (user.getUserId() == null) {
            return insert(user);
        } else {
            return update(user);
        }
    }

    private User insert(User user) {
        String sql = """
            INSERT INTO "user" (username, password, role, email, created_at)
            VALUES (?, ?, ?, ?, ?)
            """;

        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcClient.sql(sql)
                .param(user.getUsername())
                .param(user.getPassword())
                .param(user.getRole().name())
                .param(user.getEmail())
                .param(Timestamp.valueOf(user.getCreatedAt()))
                .update(keyHolder);

        Long userId = ((Number) keyHolder.getKeys().get("user_id")).longValue();
        return User.builder()
                .userId(userId)
                .username(user.getUsername())
                .password(user.getPassword())
                .role(user.getRole())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private User update(User user) {
        String sql = """
            UPDATE "user"
            SET username = ?, password = ?, role = ?, email = ?
            WHERE user_id = ?
            """;

        jdbcClient.sql(sql)
                .param(user.getUsername())
                .param(user.getPassword())
                .param(user.getRole().name())
                .param(user.getEmail())
                .param(user.getUserId())
                .update();

        return user;
    }

    @Override
    public Optional<User> findById(Long userId) {
        String sql = """
            SELECT user_id, username, password, role, email, created_at
            FROM "user"
            WHERE user_id = ?
            """;

        return jdbcClient.sql(sql)
                .param(userId)
                .query((rs, rowNum) -> User.builder()
                        .userId(rs.getLong("user_id"))
                        .username(rs.getString("username"))
                        .password(rs.getString("password"))
                        .role(UserRole.valueOf(rs.getString("role")))
                        .email(rs.getString("email"))
                        .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
                        .build())
                .optional();
    }

    @Override
    public Optional<User> findByEmail(String email) {
        String sql = """
            SELECT user_id, username, password, role, email, created_at
            FROM "user"
            WHERE email = ?
            """;

        return jdbcClient.sql(sql)
                .param(email)
                .query((rs, rowNum) -> User.builder()
                        .userId(rs.getLong("user_id"))
                        .username(rs.getString("username"))
                        .password(rs.getString("password"))
                        .role(UserRole.valueOf(rs.getString("role")))
                        .email(rs.getString("email"))
                        .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
                        .build())
                .optional();
    }

    @Override
    public List<User> findAll() {
        // 현재 요구사항에서 사용하지 않음
        throw new UnsupportedOperationException("현재 지원하지 않는 기능입니다.");
    }

    @Override
    public void deleteById(Long userId) {
        // 현재 요구사항에서 사용하지 않음 (탈퇴 기능 없음)
        throw new UnsupportedOperationException("현재 지원하지 않는 기능입니다.");
    }
}

