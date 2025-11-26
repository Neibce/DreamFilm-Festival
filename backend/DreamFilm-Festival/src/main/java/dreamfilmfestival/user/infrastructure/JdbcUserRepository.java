package dreamfilmfestival.user.infrastructure;

import dreamfilmfestival.user.domain.User;
import dreamfilmfestival.user.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class JdbcUserRepository implements UserRepository {
    private final JdbcClient jdbcClient;

    @Override
    public User save(User user) {
        // TODO: INSERT or UPDATE 구현
        return null;
    }

    @Override
    public Optional<User> findById(Long userId) {
        // TODO: SELECT 구현
        return Optional.empty();
    }

    @Override
    public Optional<User> findByEmail(String email) {
        // TODO: SELECT 구현
        return Optional.empty();
    }

    @Override
    public List<User> findAll() {
        // TODO: SELECT 구현
        return List.of();
    }

    @Override
    public void deleteById(Long userId) {
        // TODO: DELETE 구현
    }
}

