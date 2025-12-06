package dreamfilmfestival.festival.presentation;

import dreamfilmfestival.festival.application.FilmFestivalService;
import dreamfilmfestival.festival.domain.FilmFestival;
import dreamfilmfestival.festival.presentation.dto.CreateFestivalRequest;
import dreamfilmfestival.festival.presentation.dto.FestivalDtoMapper;
import dreamfilmfestival.festival.presentation.dto.FestivalResponse;
import dreamfilmfestival.festival.presentation.dto.UpdateFestivalRequest;
import dreamfilmfestival.festival.presentation.dto.FestivalStatsResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/festivals")
@RequiredArgsConstructor
public class FilmFestivalController {
    private final FilmFestivalService filmFestivalService;
    private final FestivalDtoMapper festivalDtoMapper;

    @PostMapping
    public ResponseEntity<FestivalResponse> createFestival(
            @Valid @RequestBody CreateFestivalRequest request
    ) {
        FilmFestival festival = FilmFestival.builder()
                .festivalName(request.festivalName())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .build();
        FilmFestival saved = filmFestivalService.createFestival(festival);
        return ResponseEntity.status(HttpStatus.CREATED).body(festivalDtoMapper.toFestivalResponse(saved));
    }

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

    @GetMapping("/{festivalId}/stats")
    public ResponseEntity<FestivalStatsResponse> getStats(@PathVariable Long festivalId) {
        var stats = filmFestivalService.getFestivalStats(festivalId);
        return ResponseEntity.ok(FestivalStatsResponse.of(
                stats.totalFilms(),
                stats.submittedFilms(),
                stats.waitingUserApproval(),
                stats.waitingAdminApproval(),
                stats.rejectedFilms()
        ));
    }

    @PutMapping("/{festivalId}")
    public ResponseEntity<FestivalResponse> updateFestival(
            @PathVariable Long festivalId,
            @Valid @RequestBody UpdateFestivalRequest request
    ) {
        FilmFestival updated = filmFestivalService.updateFestival(
                festivalId,
                request.festivalName(),
                request.startDate(),
                request.endDate()
        );
        return ResponseEntity.ok(festivalDtoMapper.toFestivalResponse(updated));
    }

    @DeleteMapping("/{festivalId}")
    public ResponseEntity<Void> deleteFestival(@PathVariable Long festivalId) {
        filmFestivalService.deleteFestival(festivalId);
        return ResponseEntity.noContent().build();
    }
}

