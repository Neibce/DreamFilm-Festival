package dreamfilmfestival.film.domain;

import java.util.Arrays;

public enum FilmGenre {
    FANTASY("판타지"),
    SF("SF"),
    DRAMA("드라마"),
    ADVENTURE("어드벤처"),
    THRILLER("공포/스릴러"),
    ROMANCE("로맨스");

    private final String label;

    FilmGenre(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public static FilmGenre from(String value) {
        if (value == null) {
            throw new IllegalArgumentException("장르는 필수입니다.");
        }
        String normalized = value.replace("-", "")
                .replace("_", "")
                .replace(" ", "")
                .toUpperCase();
        if (normalized.equals("SCIFI") || normalized.equals("SCIF") || normalized.equals("SCIFICTION")) {
            return SF;
        }
        return Arrays.stream(values())
                .filter(g -> g.name().equalsIgnoreCase(value) || g.label.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("허용되지 않는 장르입니다."));
    }
}

