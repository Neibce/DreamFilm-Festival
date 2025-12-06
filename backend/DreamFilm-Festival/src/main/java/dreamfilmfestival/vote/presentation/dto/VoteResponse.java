package dreamfilmfestival.vote.presentation.dto;

import dreamfilmfestival.vote.domain.Vote;

public record VoteResponse(
        Long voteId,
        Long filmId,
        Long userId
) {
    public static VoteResponse from(Vote vote) {
        return new VoteResponse(
                vote.getVoteId(),
                vote.getFilmId(),
                vote.getUserId()
        );
    }
}

