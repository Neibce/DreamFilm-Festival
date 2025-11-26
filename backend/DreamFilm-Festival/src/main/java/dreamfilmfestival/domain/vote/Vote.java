package dreamfilmfestival.domain.vote;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vote {
    private Long voteId;
    private Long filmId;
    private Long userId;
}

