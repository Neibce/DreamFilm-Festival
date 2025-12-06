package dreamfilmfestival.vote.presentation.dto;

import jakarta.validation.constraints.NotNull;

public record CreateVoteRequest(
        @NotNull Long filmId
) {
    public static CreateVoteRequest of(Long filmId) {
        return new CreateVoteRequest(filmId);
    }
}

