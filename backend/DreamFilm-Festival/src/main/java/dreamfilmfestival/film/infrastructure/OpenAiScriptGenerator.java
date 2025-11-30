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
    public Mono<GeneratedScript> generate(String dreamText) {
        log.info("OpenAI 시나리오 생성 시작: dreamText length={}", dreamText.length());

        Map<String, Object> request = Map.of(
                "model", "gpt-4.1-mini",
                "input", List.of(
                        Map.of("role", "user", "content", List.of(
                                Map.of("type", "input_text", "text",
                                        """
                                        너는 AI 꿈 영화제의 공식 영화 소개 작성자야.
                                        사용자가 입력한 **꿈** 내용을 바탕으로, 그 꿈을 모티브로 제작된 가상의 영화 소개글을 작성해줘.
                                        
                                        ### 응답 형식
                                        반드시 JSON 형식으로만 응답해야 해. 다른 설명은 포함하지 마.
                                        
                                        {
                                            "summary": "한 문단 요약글(100자 내외)",
                                            "script": "영화 소개글 (최소 300자 이상)"
                                        }
                                        
                                        ### 작성 규칙
                                        1. 사용자의 꿈 내용을 핵심 아이디어로 활용하되, 영화 소개에 걸맞게 창의적으로 각색
                                        2. 줄거리를 모두 밝히지 말고, 관객이 궁금증을 느끼도록 설정
                                        3. 감정의 흐름, 세계관, 주요 인물 혹은 상징 요소를 영화적으로 매력 있게 표현
                                        4. 분위기가 선명히 드러나는 문장 사용
                                        5. 소개글은 최소 300자 이상
                                        
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

