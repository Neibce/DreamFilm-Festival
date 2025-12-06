package dreamfilmfestival.award.application;

import dreamfilmfestival.award.presentation.dto.AwardPopularityResponse;
import dreamfilmfestival.award.presentation.dto.AwardRankingResponse;
import dreamfilmfestival.film.application.DreamFilmService;
import dreamfilmfestival.film.domain.DreamFilm;
import dreamfilmfestival.judge.domain.JudgeRepository;
import dreamfilmfestival.vote.domain.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AwardQueryService {
    private final DreamFilmService dreamFilmService;
    private final JudgeRepository judgeRepository;
    private final VoteRepository voteRepository;

    public List<AwardRankingResponse> getTopRankings(Long festivalId, int limit) {
        List<DreamFilm> films = festivalId == null
                ? dreamFilmService.getSubmittedFilms()
                : dreamFilmService.getSubmittedFilmsByFestival(festivalId);

        var sorted = films.stream()
                .map(film -> {
                    var judges = judgeRepository.findByFilmId(film.getFilmId());
                    double judgeAverage = judges.isEmpty() ? 0.0 :
                            judges.stream()
                                    .mapToDouble(j -> {
                                        double sum = 0;
                                        int count = 0;
                                        if (j.getCreativity() != null) { sum += j.getCreativity(); count++; }
                                        if (j.getExecution() != null) { sum += j.getExecution(); count++; }
                                        if (j.getEmotionalImpact() != null) { sum += j.getEmotionalImpact(); count++; }
                                        if (j.getStorytelling() != null) { sum += j.getStorytelling(); count++; }
                                        return count == 0 ? 0 : sum / count;
                                    })
                                    .average()
                                    .orElse(0.0);
                    int voteCount = voteRepository.countByFilmId(film.getFilmId());
                    double finalScore = judgeAverage; // 요청: 점수 순. 동점 시 투표수로 정렬
                    return new RankingEntry(film, judgeAverage, voteCount, finalScore);
                })
                .sorted(Comparator
                        .comparingDouble(RankingEntry::finalScore).reversed()
                        .thenComparingInt(RankingEntry::voteCount).reversed()
                )
                .limit(limit)
                .collect(Collectors.toList());

        java.util.concurrent.atomic.AtomicInteger rank = new java.util.concurrent.atomic.AtomicInteger(1);
        return sorted.stream()
                .map(entry -> AwardRankingResponse.of(
                        entry.film().getFilmId(),
                        entry.film().getTitle(),
                        entry.film().getDirectorId(),
                        entry.film().getGenre(),
                        entry.film().getImageUrl(),
                        rank.getAndIncrement(),
                        entry.judgeAverage(),
                        entry.voteCount(),
                        entry.finalScore(),
                        null
                ))
                .collect(Collectors.toList());
    }

    public List<AwardPopularityResponse> getTopPopularity(Long festivalId, int limit) {
        List<DreamFilm> films = festivalId == null
                ? dreamFilmService.getSubmittedFilms()
                : dreamFilmService.getSubmittedFilmsByFestival(festivalId);

        var sorted = films.stream()
                .map(film -> {
                    int voteCount = voteRepository.countByFilmId(film.getFilmId());
                    return new PopularityEntry(film, voteCount);
                })
                .sorted(Comparator.comparingInt(PopularityEntry::voteCount).reversed())
                .limit(limit)
                .collect(Collectors.toList());

        java.util.concurrent.atomic.AtomicInteger rank = new java.util.concurrent.atomic.AtomicInteger(1);
        return sorted.stream()
                .map(entry -> AwardPopularityResponse.of(
                        entry.film().getFilmId(),
                        entry.film().getTitle(),
                        entry.film().getDirectorId(),
                        entry.film().getGenre(),
                        entry.film().getImageUrl(),
                        rank.getAndIncrement(),
                        entry.voteCount()
                ))
                .collect(Collectors.toList());
    }

    public Optional<AwardPopularityResponse> getTopPopularityWinner(Long festivalId) {
        return getTopPopularity(festivalId, 1).stream().findFirst();
    }

    private record RankingEntry(DreamFilm film, double judgeAverage, int voteCount, double finalScore) {}
    private record PopularityEntry(DreamFilm film, int voteCount) {}
}

