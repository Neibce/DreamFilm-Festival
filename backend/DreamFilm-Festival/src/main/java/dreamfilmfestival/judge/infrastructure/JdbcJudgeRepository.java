package dreamfilmfestival.judge.infrastructure;

import dreamfilmfestival.judge.domain.Judge;
import dreamfilmfestival.judge.domain.JudgeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class JdbcJudgeRepository implements JudgeRepository {
    private final JdbcClient jdbcClient;

    @Override
    public Judge save(Judge judge) {
        // TODO: INSERT or UPDATE 구현
        return null;
    }

    @Override
    public Optional<Judge> findById(Long judgeId) {
        // TODO: SELECT 구현
        return Optional.empty();
    }

    @Override
    public List<Judge> findByFilmId(Long filmId) {
        // TODO: SELECT 구현
        return List.of();
    }

    @Override
    public List<Judge> findByUserId(Long userId) {
        // TODO: SELECT 구현
        return List.of();
    }

    @Override
    public void deleteById(Long judgeId) {
        // TODO: DELETE 구현
    }
}

