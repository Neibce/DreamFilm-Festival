package dreamfilmfestival.festival.presentation.dto;

import dreamfilmfestival.festival.domain.FilmFestival;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class FestivalDtoMapper {
    
    public FestivalResponse toFestivalResponse(FilmFestival festival) {
        return FestivalResponse.of(
                festival.getFestivalId(),
                festival.getFestivalName(),
                festival.getStartDate(),
                festival.getEndDate()
        );
    }

    public List<FestivalResponse> toFestivalResponseList(List<FilmFestival> festivals) {
        return festivals.stream()
                .map(this::toFestivalResponse)
                .collect(Collectors.toList());
    }
}

