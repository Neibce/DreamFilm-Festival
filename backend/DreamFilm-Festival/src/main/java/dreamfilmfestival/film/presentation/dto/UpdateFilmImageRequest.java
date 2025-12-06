package dreamfilmfestival.film.presentation.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateFilmImageRequest(
        @NotBlank String imageUrl
) {
    public static UpdateFilmImageRequest of(String imageUrl) {
        return new UpdateFilmImageRequest(imageUrl);
    }
}

