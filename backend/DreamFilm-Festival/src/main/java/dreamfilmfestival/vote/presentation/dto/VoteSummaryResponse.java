package dreamfilmfestival.vote.presentation.dto;

public record VoteSummaryResponse(
        int usedVotes,
        int remainingVotes,
        int limit
) {
    public static VoteSummaryResponse of(int usedVotes, int remainingVotes, int limit) {
        return new VoteSummaryResponse(usedVotes, remainingVotes, limit);
    }
}
