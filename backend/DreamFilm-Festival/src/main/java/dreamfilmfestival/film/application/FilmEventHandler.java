package dreamfilmfestival.film.application;

import dreamfilmfestival.film.domain.*;
import dreamfilmfestival.film.domain.event.FilmCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class FilmEventHandler {
    private final AiScriptGenerator aiScriptGenerator;
    private final ImageGenerator imageGenerator;
    private final ImageStorage imageStorage;
    private final DreamFilmRepository dreamFilmRepository;

    @Async
    @EventListener
    public void handleFilmCreated(FilmCreatedEvent event) {
        log.info("AI 콘텐츠 생성 시작 - filmId: {}", event.getFilmId());

        try {
            // 1. AI 시나리오 생성
            GeneratedScript generatedScript = aiScriptGenerator.generate(event.getDreamText()).block();
            
            if (generatedScript != null) {
                updateFilmWithScript(event.getFilmId(), generatedScript.getScript(), generatedScript.getSummary());
                log.info("AI 시나리오 생성 완료 - filmId: {}", event.getFilmId());

                // 2. 이미지 생성 (시나리오 생성 후)
                generateAndSaveImage(event.getFilmId(), generatedScript.getSummary());
            }
        } catch (Exception e) {
            log.error("AI 콘텐츠 생성 실패 - filmId: {}, error: {}", event.getFilmId(), e.getMessage());
        }
    }

    @Transactional
    private void updateFilmWithScript(Long filmId, String aiScript, String summary) {
        DreamFilm film = dreamFilmRepository.findById(filmId)
                .orElseThrow(() -> new IllegalArgumentException("영화를 찾을 수 없습니다."));

        film.updateAiScript(aiScript, summary);
        dreamFilmRepository.save(film);
    }

    private void generateAndSaveImage(Long filmId, String summary) {
        try {
            log.info("이미지 생성 시작 - filmId: {}", filmId);

            // Gemini로 이미지 생성
            String imagePrompt = "Create a movie poster image based on this story: " + summary;
            byte[] imageData = imageGenerator.generate(imagePrompt);

            // 로컬에 이미지 저장
            String imageUrl = imageStorage.save(imageData, filmId);

            // DreamFilm에 이미지 URL 업데이트
            updateFilmWithImageUrl(filmId, imageUrl);

            log.info("이미지 생성 및 저장 완료 - filmId: {}, url: {}", filmId, imageUrl);
        } catch (Exception e) {
            log.error("이미지 생성 실패 - filmId: {}, error: {}", filmId, e.getMessage());
            // 이미지 생성 실패해도 영화 생성은 유지
        }
    }

    @Transactional
    private void updateFilmWithImageUrl(Long filmId, String imageUrl) {
        DreamFilm film = dreamFilmRepository.findById(filmId)
                .orElseThrow(() -> new IllegalArgumentException("영화를 찾을 수 없습니다."));

        film.updateImageUrl(imageUrl);
        dreamFilmRepository.save(film);
    }
}


