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
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AwardService {
    private static final int POPULARITY_FIXED_RANK = 4;

    private final AwardRepository awardRepository;
    private final AwardQueryService awardQueryService;

    public Award createAward(Award award) {
        return awardRepository.save(award);
    }

    public Optional<Award> getAwardById(Long awardId) {
        return awardRepository.findById(awardId);
    }

    public List<Award> getAwardsByFilmId(Long filmId) {
        return awardRepository.findByFilmId(filmId);
    }

    public List<Award> getAwardsByFestivalId(Long festivalId) {
        return awardRepository.findByFestivalId(festivalId);
    }

    public void deleteAward(Long awardId) {
        awardRepository.deleteById(awardId);
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

        for (AwardRankingResponse ranking : rankings) {
            Award award = Award.builder()
                    .filmId(ranking.filmId())
                    .festivalId(festivalId)
                    .rank(ranking.rank())
                    .awardName(null)
                    .announcedAt(null)
                    .build();
            saved.add(awardRepository.save(award));
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

