package dreamfilmfestival.film.infrastructure;

import dreamfilmfestival.film.domain.ImageStorage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 로컬 파일 시스템 기반 이미지 저장소 구현체 (Infrastructure Layer)
 */
@Slf4j
@Component
public class LocalImageStorage implements ImageStorage {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    @Value("${file.upload.path}")
    private String uploadPath;

    @Override
    public String save(byte[] imageData, Long filmId) {
        try {
            // 업로드 디렉토리 생성
            Path directory = Paths.get(uploadPath);
            if (!Files.exists(directory)) {
                Files.createDirectories(directory);
                log.info("업로드 디렉토리 생성: {}", directory.toAbsolutePath());
            }

            // 파일명 생성: film_{filmId}_{timestamp}.png
            String timestamp = LocalDateTime.now().format(FORMATTER);
            String filename = String.format("film_%d_%s.png", filmId, timestamp);
            Path filePath = directory.resolve(filename);

            // 파일 저장
            Files.write(filePath, imageData);
            log.info("이미지 저장 완료: {} ({} bytes)", filePath.toAbsolutePath(), imageData.length);

            // URL 반환 (정적 리소스로 접근 가능한 경로)
            String imageUrl = "/images/" + filename;
            return imageUrl;

        } catch (IOException e) {
            log.error("이미지 저장 실패: {}", e.getMessage(), e);
            throw new RuntimeException("이미지 저장에 실패했습니다: " + e.getMessage(), e);
        }
    }

    @Override
    public void delete(String imageUrl) {
        try {
            // URL에서 파일명 추출: /images/filename.png -> filename.png
            String filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
            Path filePath = Paths.get(uploadPath).resolve(filename);

            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("이미지 삭제 완료: {}", filePath.toAbsolutePath());
            } else {
                log.warn("삭제하려는 이미지가 존재하지 않음: {}", filePath.toAbsolutePath());
            }

        } catch (IOException e) {
            log.error("이미지 삭제 실패: {}", e.getMessage(), e);
            throw new RuntimeException("이미지 삭제에 실패했습니다: " + e.getMessage(), e);
        }
    }
}
