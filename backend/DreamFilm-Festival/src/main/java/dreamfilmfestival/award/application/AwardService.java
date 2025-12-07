package dreamfilmfestival.award.application;

import dreamfilmfestival.award.domain.Award;
import dreamfilmfestival.award.domain.AwardRepository;
import dreamfilmfestival.award.presentation.dto.AwardRankingResponse;
import dreamfilmfestival.award.presentation.dto.AwardPopularityResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AwardService {
    private static final int POPULARITY_FIXED_RANK = 4;

    private final AwardRepository awardRepository;
    private final AwardQueryService awardQueryService;

    public List<Award> getAwardsByFestivalId(Long festivalId) {
        return awardRepository.findByFestivalId(festivalId);
    }

    @Transactional
    public List<Award> finalizeAwards(Long festivalId, int rankingLimit, int popularityLimit) {
        if (festivalId == null) {
            throw new IllegalArgumentException("festivalId는 필수입니다.");
        }

        if (!awardRepository.findByFestivalId(festivalId).isEmpty()) {
            throw new IllegalStateException("이미 수상작이 확정된 영화제입니다.");
        }

        int effectiveRankingLimit = Math.max(1, rankingLimit);
        List<AwardRankingResponse> rankings = awardQueryService.getTopRankings(festivalId, effectiveRankingLimit);
        if (rankings.isEmpty()) {
            throw new IllegalStateException("확정할 랭킹 대상 작품이 없습니다.");
        }

        var popularityWinner = popularityLimit <= 0
                ? java.util.Optional.<AwardPopularityResponse>empty()
                : awardQueryService.getTopPopularityWinner(festivalId);

        awardRepository.deleteByFestivalId(festivalId);

        List<Award> saved = new ArrayList<>();

        for (int i = 0; i < rankings.size(); i++) {
            AwardRankingResponse ranking = rankings.get(i);
            
            if (i == 0) {
                // 첫 번째 Award는 SQL Transaction (BEGIN/COMMIT/ROLLBACK) 사용
                awardRepository.finalizeAwardWithTransaction(ranking.filmId(), festivalId, ranking.rank());
                saved.add(awardRepository.findByFestivalId(festivalId).stream()
                        .filter(a -> a.getFilmId().equals(ranking.filmId()))
                        .findFirst()
                        .orElse(null));
            } else {
                Award award = Award.builder()
                        .filmId(ranking.filmId())
                        .festivalId(festivalId)
                        .rank(ranking.rank())
                        .awardName(null)
                        .announcedAt(null)
                        .build();
                saved.add(awardRepository.save(award));
            }
        }

        if (popularityWinner.isPresent()) {
            AwardPopularityResponse pop = popularityWinner.get();
            Award award = Award.builder()
                    .filmId(pop.filmId())
                    .festivalId(festivalId)
                    .rank(POPULARITY_FIXED_RANK) // 인기상 구분용 고정 랭크
                    .awardName(null)
                    .announcedAt(null)
                    .build();
            saved.add(awardRepository.save(award));
        }

        return saved;
    }
}
