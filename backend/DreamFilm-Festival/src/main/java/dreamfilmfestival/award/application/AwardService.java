package dreamfilmfestival.award.application;

import dreamfilmfestival.award.domain.Award;
import dreamfilmfestival.award.domain.AwardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AwardService {
    private final AwardRepository awardRepository;

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
}

