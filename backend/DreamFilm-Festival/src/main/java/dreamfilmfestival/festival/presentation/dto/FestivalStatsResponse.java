package dreamfilmfestival.festival.presentation.dto;

public record FestivalStatsResponse(
        int totalFilms,
        int submittedFilms,
        int waitingUserApproval,
        int waitingAdminApproval,
        int rejectedFilms
) {
    public static FestivalStatsResponse of(int totalFilms, int submittedFilms,
                                           int waitingUserApproval, int waitingAdminApproval,
                                           int rejectedFilms) {
        return new FestivalStatsResponse(totalFilms, submittedFilms, waitingUserApproval, waitingAdminApproval, rejectedFilms);
    }
}

