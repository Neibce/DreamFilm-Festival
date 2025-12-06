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
            GeneratedScript generatedScript = aiScriptGenerator.generate(
                    event.getTitle(),
                    event.getDreamText(),
                    event.getGenre(),
                    event.getMood(),
                    event.getThemes()
            ).block();
            
            if (generatedScript != null) {
                updateFilmWithScript(event.getFilmId(), generatedScript.getScript(), generatedScript.getSummary());
                log.info("AI 시나리오 생성 완료 - filmId: {}", event.getFilmId());

                // 2. 이미지 생성 (시나리오 생성 후)
                generateAndSaveImage(
                        event.getFilmId(),
                        event.getTitle(),
                        event.getGenre(),
                        event.getMood(),
                        event.getThemes(),
                        generatedScript.getSummary()
                );
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

    private void generateAndSaveImage(Long filmId, String title, String genre, String mood, String themes, String summary) {
        try {
            log.info("이미지 생성 시작 - filmId: {}, title: {}", filmId, title);

            // Gemini로 이미지 생성
            String imagePrompt = """
                    다음 정보를 반영한 영화 포스터를 만들어주세요.
                    - 제목: %s
                    - 장르: %s
                    - 분위기: %s
                    - 테마: %s
                    - 줄거리 요약: %s

                    요구사항:
                    1) 주어진 분위기와 테마를 시각적으로 강조할 것
                    2) 고품질의 영화 포스터 스타일로 제작
                    3) 가능하면 텍스트를 넣지 말 것 (어쩔 수 없는 경우 제목만 최소화)
                    """.formatted(
                    nullToPlaceholder(title, "제목 미정"),
                    nullToPlaceholder(genre, "드라마"),
                    nullToPlaceholder(mood, "몽환적"),
                    nullToPlaceholder(themes, "희망, 미스터리"),
                    nullToPlaceholder(summary, "꿈에서 영감을 받은 이야기")
            );
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
        // 이미지 생성 성공/실패와 무관하게 사용자 승인 대기로 전환
        markReadyForUserApproval(filmId);
    }

    private String nullToPlaceholder(String value, String placeholder) {
        if (value == null || value.isBlank()) return placeholder;
        return value;
    }

    @Transactional
    private void updateFilmWithImageUrl(Long filmId, String imageUrl) {
        DreamFilm film = dreamFilmRepository.findById(filmId)
                .orElseThrow(() -> new IllegalArgumentException("영화를 찾을 수 없습니다."));

        film.updateImageUrl(imageUrl);
        dreamFilmRepository.save(film);
    }

    @Transactional
    private void markReadyForUserApproval(Long filmId) {
        DreamFilm film = dreamFilmRepository.findById(filmId)
                .orElseThrow(() -> new IllegalArgumentException("영화를 찾을 수 없습니다."));
        try {
            film.readyForUserApproval();
            dreamFilmRepository.save(film);
        } catch (Exception e) {
            log.error("사용자 승인 대기 전환 실패 - filmId: {}, error: {}", filmId, e.getMessage());
            throw e;
        }
    }
}


