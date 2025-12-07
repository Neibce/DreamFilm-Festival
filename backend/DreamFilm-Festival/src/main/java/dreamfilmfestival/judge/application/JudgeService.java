package dreamfilmfestival.judge.application;

import dreamfilmfestival.festival.domain.FilmFestival;
import dreamfilmfestival.festival.domain.FilmFestivalRepository;
import dreamfilmfestival.film.domain.DreamFilm;
import dreamfilmfestival.film.domain.DreamFilmRepository;
import dreamfilmfestival.film.domain.FilmStatus;
import dreamfilmfestival.judge.domain.Judge;
import dreamfilmfestival.judge.domain.JudgeRepository;
import dreamfilmfestival.user.domain.User;
import dreamfilmfestival.user.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JudgeService {
    private final JudgeRepository judgeRepository;
    private final DreamFilmRepository dreamFilmRepository;
    private final UserRepository userRepository;
    private final FilmFestivalRepository filmFestivalRepository;

    @Transactional
    public Judge submitScores(Long filmId, Long userId, int creativity, int execution, int emotionalImpact, int storytelling, String comment) {
        Optional<Judge> existing = judgeRepository.findByFilmIdAndUserId(filmId, userId);

        if (existing.isPresent()) {
            // 기존 심사 데이터가 있으면 업데이트
            Judge toUpdate = Judge.builder()
                    .judgeId(existing.get().getJudgeId())
                    .filmId(filmId)
                    .userId(userId)
                    .creativity(creativity)
                    .execution(execution)
                    .emotionalImpact(emotionalImpact)
                    .storytelling(storytelling)
                    .comment(comment)
                    .judgedAt(LocalDateTime.now())
                    .build();
            return judgeRepository.save(toUpdate);
        }

        // 새로운 심사 데이터 생성 전 중복 확인 (동시성 이슈 대비)
        if (judgeRepository.existsByFilmIdAndUserId(filmId, userId)) {
            throw new IllegalStateException("이미 해당 영화에 대한 심사가 존재합니다. filmId: " + filmId + ", userId: " + userId);
        }

        Judge newJudge = Judge.builder()
                .filmId(filmId)
                .userId(userId)
                .creativity(creativity)
                .execution(execution)
                .emotionalImpact(emotionalImpact)
                .storytelling(storytelling)
                .comment(comment)
                .judgedAt(LocalDateTime.now())
                .build();

        return judgeRepository.save(newJudge);
    }

    public Optional<Judge> findByFilmIdAndUserId(Long filmId, Long userId) {
        return judgeRepository.findByFilmIdAndUserId(filmId, userId);
    }

    @Transactional(readOnly = true)
    public List<FilmWithJudgeStatus> getFilmsWithJudgeStatus(Long judgeUserId) {
        // 현재 진행 중인 영화제 ID 조회
        Set<Long> ongoingFestivalIds = filmFestivalRepository.findOngoingFestivals().stream()
                .map(FilmFestival::getFestivalId)
                .collect(Collectors.toSet());
        
        // 승인된(SUBMITTED) 영화 중 진행 중인 영화제의 영화만 조회
        List<DreamFilm> films = dreamFilmRepository.findByStatus(FilmStatus.SUBMITTED).stream()
                .filter(f -> ongoingFestivalIds.contains(f.getFestivalId()))
                .toList();
        
        // 해당 심사위원의 모든 심사 기록 조회 (중복 데이터가 있을 경우 최신 것 유지)
        List<Judge> myJudges = judgeRepository.findByUserId(judgeUserId);
        Map<Long, Judge> judgeMap = myJudges.stream()
                .collect(Collectors.toMap(
                        Judge::getFilmId,
                        j -> j,
                        (existing, replacement) -> existing.getJudgedAt().isAfter(replacement.getJudgedAt()) ? existing : replacement
                ));
        
        // 감독 정보 조회를 위한 맵 생성
        List<Long> directorIds = films.stream()
                .map(DreamFilm::getDirectorId)
                .distinct()
                .toList();
        Map<Long, String> directorNames = directorIds.stream()
                .map(id -> userRepository.findById(id).orElse(null))
                .filter(u -> u != null)
                .collect(Collectors.toMap(User::getUserId, User::getUsername));
        
        return films.stream()
                .map(film -> {
                    Judge judge = judgeMap.get(film.getFilmId());
                    String directorName = directorNames.getOrDefault(film.getDirectorId(), "감독 미상");
                    return new FilmWithJudgeStatus(
                            film.getFilmId(),
                            film.getTitle(),
                            directorName,
                            film.getGenre(),
                            film.getImageUrl(),
                            judge != null,
                            judge
                    );
                })
                .toList();
    }

    public record FilmWithJudgeStatus(
            Long filmId,
            String title,
            String directorName,
            String genre,
            String imageUrl,
            boolean judged,
            Judge judgeScore
    ) {}
}

