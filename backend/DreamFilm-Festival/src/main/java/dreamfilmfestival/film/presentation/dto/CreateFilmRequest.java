package dreamfilmfestival.film.presentation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateFilmRequest(
        @NotBlank(message = "제목은 필수입니다.") @Size(min = 1, max = 255, message = "제목은 1자 이상 255자 이하여야 합니다.") String title,
        @NotBlank(message = "꿈 내용은 필수입니다.") @Size(min = 10, message = "꿈 내용은 최소 10자 이상이어야 합니다.") String dreamText,
        @NotBlank(message = "장르는 필수입니다.") String genre,
        @Size(max = 255, message = "분위기는 255자를 초과할 수 없습니다.") String mood,
        @Size(max = 255, message = "테마는 255자를 초과할 수 없습니다.") String themes,
        @Size(max = 255, message = "타깃 관객은 255자를 초과할 수 없습니다.") String targetAudience
) {
    public static CreateFilmRequest of(
            String title,
            String dreamText,
            String genre,
            String mood,
            String themes,
            String targetAudience
    ) {
        return new CreateFilmRequest(title, dreamText, genre, mood, themes, targetAudience);
    }
}

