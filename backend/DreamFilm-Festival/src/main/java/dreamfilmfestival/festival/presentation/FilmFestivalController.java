package dreamfilmfestival.festival.presentation;

import dreamfilmfestival.festival.application.FilmFestivalService;
import dreamfilmfestival.festival.domain.FilmFestival;
import dreamfilmfestival.festival.presentation.dto.FestivalDtoMapper;
import dreamfilmfestival.festival.presentation.dto.FestivalResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/festivals")
@RequiredArgsConstructor
public class FilmFestivalController {
    private final FilmFestivalService filmFestivalService;
    private final FestivalDtoMapper festivalDtoMapper;

    @GetMapping("/ongoing")
    public ResponseEntity<List<FestivalResponse>> getOngoingFestivals() {
        List<FilmFestival> festivals = filmFestivalService.getOngoingFestivals();
        List<FestivalResponse> response = festivalDtoMapper.toFestivalResponseList(festivals);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{festivalId}")
    public ResponseEntity<FestivalResponse> getFestivalById(@PathVariable Long festivalId) {
        return filmFestivalService.getFestivalById(festivalId)
                .map(festivalDtoMapper::toFestivalResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<FestivalResponse>> getAllFestivals() {
        List<FilmFestival> festivals = filmFestivalService.getAllFestivals();
        List<FestivalResponse> response = festivalDtoMapper.toFestivalResponseList(festivals);
        return ResponseEntity.ok(response);
    }
}

