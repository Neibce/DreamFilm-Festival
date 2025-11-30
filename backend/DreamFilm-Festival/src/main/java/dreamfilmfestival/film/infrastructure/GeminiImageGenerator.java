package dreamfilmfestival.film.infrastructure;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.ImageConfig;
import com.google.genai.types.Part;
import dreamfilmfestival.film.domain.ImageGenerator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class GeminiImageGenerator implements ImageGenerator {

    private static final String MODEL_NAME = "gemini-3-pro-image-preview";

    @Override
    public byte[] generate(String prompt) {
        try {
            log.info("Gemini 이미지 생성 시작: prompt={}", prompt.substring(0, Math.min(100, prompt.length())));

            // Client 생성 (API 키는 환경 변수 GEMINI_API_KEY에서 자동 로드)
            try (Client client = new Client()) {

                // 이미지 생성 설정
                GenerateContentConfig config = GenerateContentConfig.builder()
                        .responseModalities("TEXT", "IMAGE")
                        .imageConfig(ImageConfig.builder()
                                .aspectRatio("4:5")
                                .imageSize("1K")
                                .build())
                        .build();

                // 콘텐츠 생성 요청
                GenerateContentResponse response = client.models.generateContent(
                        MODEL_NAME,
                        prompt,
                        config
                );

                // 응답에서 이미지 데이터 추출
                for (Part part : response.parts()) {
                    if (part.inlineData().isPresent()) {
                        var blob = part.inlineData().get();
                        if (blob.data().isPresent()) {
                            byte[] imageData = blob.data().get();
                            log.info("Gemini 이미지 생성 완료: {} bytes", imageData.length);
                            return imageData;
                        }
                    }
                }

                throw new RuntimeException("이미지 데이터를 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            log.error("Gemini 이미지 생성 실패: {}", e.getMessage(), e);
            throw new RuntimeException("이미지 생성에 실패했습니다: " + e.getMessage(), e);
        }
    }
}

