package dreamfilmfestival.user.domain;

import java.util.List;
import java.util.Optional;

public interface UserRepository {
    User save(User user);
    Optional<User> findById(Long userId);
    Optional<User> findByEmail(String email);
    List<User> findAll(String sortField, String sortDirection);
    void deleteById(Long userId);
}

