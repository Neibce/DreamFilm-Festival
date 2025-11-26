package dreamfilmfestival.award.infrastructure;

import dreamfilmfestival.award.domain.Award;
import dreamfilmfestival.award.domain.AwardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class JdbcAwardRepository implements AwardRepository {
    private final JdbcClient jdbcClient;

    @Override
    public Award save(Award award) {
        // TODO: INSERT or UPDATE 구현
        return null;
    }

    @Override
    public Optional<Award> findById(Long awardId) {
        // TODO: SELECT 구현
        return Optional.empty();
    }

    @Override
    public List<Award> findByFilmId(Long filmId) {
        // TODO: SELECT 구현
        return List.of();
    }

    @Override
    public List<Award> findByFestivalId(Long festivalId) {
        // TODO: SELECT 구현
        return List.of();
    }

    @Override
    public void deleteById(Long awardId) {
        // TODO: DELETE 구현
    }
}

