package dreamfilmfestival.award.presentation.dto;

import java.time.LocalDateTime;

public record AwardRankingResponse(
        Long filmId,
        String title,
        Long directorId,
        String genre,
        String imageUrl,
        Integer rank,
        Double judgeAverage,
        Integer voteCount,
        Double finalScore,
        LocalDateTime announcedAt
) {
    public static AwardRankingResponse of(Long filmId,
                                          String title,
                                          Long directorId,
                                          String genre,
                                          String imageUrl,
                                          Integer rank,
                                          Double judgeAverage,
                                          Integer voteCount,
                                          Double finalScore,
                                          LocalDateTime announcedAt) {
        return new AwardRankingResponse(filmId, title, directorId, genre, imageUrl, rank, judgeAverage, voteCount, finalScore, announcedAt);
    }
}

