package dreamfilmfestival.film.infrastructure;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dreamfilmfestival.film.domain.AiScriptGenerator;
import dreamfilmfestival.film.domain.GeneratedScript;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class OpenAiScriptGenerator implements AiScriptGenerator {

    private final WebClient openAiWebClient;
    private final ObjectMapper objectMapper;

    @Override
    public Mono<GeneratedScript> generate(String title, String dreamText, String genre, String mood,
            String themes) {
        log.info(
                "OpenAI 시나리오 생성 시작: title='{}', genre='{}', mood='{}', themes='{}', dreamText length={}",
                title, genre, mood, themes, dreamText.length());

        Map<String, Object> request = Map.of(
                "model", "gpt-4.1-mini",
                "input", List.of(
                        Map.of("role", "user", "content", List.of(
                                Map.of("type", "input_text", "text",
                                        """
                                                너는 AI 꿈 영화제의 공식 영화 소개 작성자다.
                                                사용자가 입력한 영화 제목, 장르, 꿈의 분위기(감정 톤), 테마, 꿈 내용을 바탕으로, 그 꿈을 모티브로 제작된 가상의 영화 소개글을 작성한다.
                                                
                                                출력 형식
                                                반드시 아래 JSON 형식으로만 답하라. 다른 설명은 금지한다.
                                                ```
                                                {
                                                    "summary": "한 문단 요약글 (120~180자, 꿈의 분위기와 핵심 갈등 강조)",
                                                    "script": "영화 소개글 (최소 700자, 4개 이상의 문단, 문단 사이 빈 줄)"
                                                }
                                                ```
                                                
                                                작성 규칙
                                                
                                                1. 꿈 내용의 핵심 장면, 감정, 상징 요소를 적극 활용하여 영화적 상상력으로 각색하되, 전체 줄거리를 모두 공개하지 않는다.
                                                2. **장르와 분위기에 맞는 감각적 묘사(소리, 시각, 공간, 속도, 냄새 등)**를 풍부하게 사용한다.
                                                3. 이야기는 점층적으로 전개하되, 읽는 사람이 계속 궁금증을 느끼도록 미스터리 또는 여지를 남긴다.
                                                4. 인물 또는 공간이 가진 의도·비밀·규칙 같은 요소를 암시적으로 제시하되 정답을 말하지 않는다.
                                                5. 불릿, 마크다운, 대사 블록 없이 순수 서사형 문장으로 작성한다.
                                                6. summary는 120~180자, script는 700자 이상이어야 한다.
                                                
                                                ### 입력된 영화 제목:
                                                """ + title + """
                                                
                                                ### 지정된 장르:
                                                """ + genre + """
                                                
                                                ### 꿈의 분위기:
                                                """ + mood + """
                                                
                                                ### 테마 키워드:
                                                """ + themes + """
                                                
                                                ### 입력된 꿈 내용:
                                                """ + dreamText)
                        ))
                ),
                "text", Map.of("format",
                        Map.of(
                                "type", "json_schema",
                                "name", "script_schema",
                                "schema", createScriptSchema(),
                                "strict", true
                        )
                )
        );

        return openAiWebClient.post()
                .uri("/responses")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(String.class)
                .handle((responseBody, sink) -> {
                    try {
                        log.debug("OpenAI API 응답 수신: {}",
                                responseBody.substring(0, Math.min(100, responseBody.length())));

                        // String -> JsonNode 파싱
                        JsonNode resp = objectMapper.readTree(responseBody);

                        String content = resp.get("output").get(0)
                                .get("content").get(0)
                                .get("text").asText();
                        JsonNode scriptJson = objectMapper.readTree(content);

                        GeneratedScript result = GeneratedScript.builder()
                                .script(scriptJson.get("script").asText())
                                .summary(scriptJson.get("summary").asText())
                                .build();

                        log.info("OpenAI 시나리오 생성 완료: script length={}, summary length={}",
                                result.getScript().length(), result.getSummary().length());
                        sink.next(result);
                    } catch (Exception e) {
                        log.error("OpenAI API 응답 처리 실패: {}", e.getMessage(), e);
                        sink.error(
                                new RuntimeException("OpenAI API 응답 처리 실패: " + e.getMessage(), e));
                    }
                });
    }

    private Map<String, Object> createScriptSchema() {
        return Map.of(
                "type", "object",
                "properties", Map.of(
                        "script", Map.of("type", "string"),
                        "summary", Map.of("type", "string")
                ),
                "required", List.of("script", "summary"),
                "additionalProperties", false
        );
    }
}

