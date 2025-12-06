package dreamfilmfestival.judge.application;

import dreamfilmfestival.film.domain.DreamFilmRepository;
import dreamfilmfestival.film.domain.FilmStatus;
import dreamfilmfestival.judge.domain.Judge;
import dreamfilmfestival.judge.domain.JudgeRepository;
import dreamfilmfestival.user.domain.User;
import dreamfilmfestival.user.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class JudgeQueryService {

    private final JudgeRepository judgeRepository;
    private final UserRepository userRepository;
    private final DreamFilmRepository dreamFilmRepository;

    public List<JudgeProgressResult> getProgress() {
        Map<Long, User> usersById = userRepository.findAll(null, null).stream()
                .collect(Collectors.toMap(User::getUserId, Function.identity()));

        var submittedFilmIds = new HashSet<>(
                dreamFilmRepository.findByStatus(FilmStatus.SUBMITTED).stream()
                        .map(film -> film.getFilmId())
                        .toList()
        );
        int totalSubmittedFilms = submittedFilmIds.size();

        return judgeRepository.findAll().stream()
                .collect(Collectors.groupingBy(Judge::getUserId))
                .entrySet().stream()
                .map(entry -> toProgress(
                        entry.getKey(),
                        entry.getValue(),
                        usersById.get(entry.getKey()),
                        submittedFilmIds,
                        totalSubmittedFilms
                ))
                .sorted(Comparator.comparing(JudgeProgressResult::completionRate).reversed())
                .toList();
    }

    private JudgeProgressResult toProgress(Long userId, List<Judge> judges, User user,
                                           HashSet<Long> submittedFilmIds, int totalSubmittedFilms) {
        int total = totalSubmittedFilms;
        int reviewed = (int) judges.stream()
                .filter(judge -> submittedFilmIds.contains(judge.getFilmId()))
                .filter(judge -> judge.getCreativity() != null
                        && judge.getExecution() != null
                        && judge.getEmotionalImpact() != null
                        && judge.getStorytelling() != null)
                .count();
        int pending = Math.max(total - reviewed, 0);
        int completion = total == 0 ? 0 : (int) Math.round((reviewed * 100.0) / total);

        String username = user != null ? user.getUsername() : "알 수 없음";
        String email = user != null ? user.getEmail() : null;

        return new JudgeProgressResult(
                userId,
                username,
                email,
                total,
                reviewed,
                pending,
                completion
        );
    }

    public record JudgeProgressResult(
            Long userId,
            String username,
            String email,
            int totalFilms,
            int reviewedFilms,
            int pendingFilms,
            int completionRate
    ) {
    }
}

