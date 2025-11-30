package dreamfilmfestival.film.presentation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CreateFilmRequest {
    @NotNull(message = "영화제 ID는 필수입니다.")
    private Long festivalId;

    @NotNull(message = "감독 ID는 필수입니다.")
    private Long directorId;

    @NotBlank(message = "제목은 필수입니다.")
    @Size(min = 1, max = 255, message = "제목은 1자 이상 255자 이하여야 합니다.")
    private String title;

    @NotBlank(message = "꿈 내용은 필수입니다.")
    @Size(min = 10, message = "꿈 내용은 최소 10자 이상이어야 합니다.")
    private String dreamText;
}

