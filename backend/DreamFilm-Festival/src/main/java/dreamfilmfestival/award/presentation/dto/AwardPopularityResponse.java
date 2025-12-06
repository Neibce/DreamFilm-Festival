package dreamfilmfestival.award.presentation.dto;

public record AwardPopularityResponse(
        Long filmId,
        String title,
        Long directorId,
        String genre,
        String imageUrl,
        Integer rank,
        Integer voteCount
) {
    public static AwardPopularityResponse of(Long filmId,
                                             String title,
                                             Long directorId,
                                             String genre,
                                             String imageUrl,
                                             Integer rank,
                                             Integer voteCount) {
        return new AwardPopularityResponse(filmId, title, directorId, genre, imageUrl, rank, voteCount);
    }
}

