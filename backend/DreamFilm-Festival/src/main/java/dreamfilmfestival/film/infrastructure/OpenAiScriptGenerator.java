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
                "model", "gpt-5.1",
                "input", List.of(
                        Map.of("role", "user", "content", List.of(
                                Map.of("type", "input_text", "text",
                                        """
                                                너는 AI 꿈 영화제의 영화 소개 작성자다.
                                                사용자가 입력한 영화 제목, 장르, 꿈의 분위기(감정 톤), 테마, 꿈 내용을 바탕으로, 그 꿈을 모티브로 제작된 가상의 영화 소개글을 작성한다.
                                                
                                                출력 형식
                                                반드시 아래 JSON 형식으로만 답하라. 다른 설명은 금지한다.
                                                ```
                                                {
                                                    "summary": "한 문단 요약글 (120~180자, 꿈의 분위기와 핵심 갈등 강조)",
                                                    "script": "영화 소개글 (최소 700자)"
                                                }
                                                ```
                                                
                                                작성 규칙
                                                
                                                1. 꿈 내용의 핵심 장면, 감정, 상징 요소를 적극 활용하여 영화적 상상력으로 각색하되, 전체 줄거리를 모두 공개하지 않는다.
                                                2. **장르와 분위기에 맞는 감각적 묘사(소리, 시각, 공간, 속도, 냄새 등)**를 풍부하게 사용한다.
                                                3. 이야기는 점층적으로 전개하되, 읽는 사람이 계속 궁금증을 느끼도록 미스터리 또는 여지를 남긴다.
                                                4. 인물 또는 공간이 가진 의도·비밀·규칙 같은 요소를 암시적으로 제시하되 정답을 말하지 않는다.
                                                5. 불릿, 마크다운, 대사 블록 없이 순수 서사형 문장으로 작성한다.
                                                6. summary는 120~180자, script는 700자 이상이어야 한다.
                                                7. 사용자가 읽기 쉽게 줄바꿈을 적절히 활용한다.
                                                8. 제 3자 시점에서 서술하지 않는다. 항상 주인공 시점으로 서술한다.
                                                
                                                예시
                                                처음엔 그냥 운동장 한가운데 있었다. 밤도 아니고 대낮이었다. 그런데 아무도 없었다. 바람 소리만 들리는데, 이상하게 멀리서 발소리가 일정하게 다가왔다. 탁… 탁… 탁… 나는 괜히 뒤를 돌아봤다. 거기 좀비 한 마리가 있었다. 근데 느리게 걷는 영화 속 좀비랑 다르다. 내가 뒤돌아본 순간, 속도가 두 배가 됐다. 난 뛰기 시작했다. 운동장 끝이 이상하게 안 가까워졌다. 발은 무거운데 다리는 허공에 걸린 것 같았다. 탁탁탁탁탁! 좀비는 뛰지도 않고 걸어오는데, 스피드가 내가 뛰는 속도랑 똑같았다. 내가 빨라지면 얘도 빨라지고, 내가 헐떡이면 얘는 숨도 안 쉰다. 눈치 챘다. 얘는 나를 쫓는 게 아니라, 내 속도를 복사하고 있었다. 운동장을 벗어나 건물 안으로 뛰어들었다. 문을 닫았다. 심장 터질 것 같았고, 손이 떨렸다. 잠깐 숨 고른 뒤 문틈으로 봤다. 좀비가 멈춰 있었다. 나를 보고 있었다. 입이 조금씩 벌어지더니, 내 목소리로 말했다. “뛰어봐.” 나도 모르게 또 뛰었다. 계단, 복도, 교실, 창문—끊임없이 뛰는데 방향은 계속 바뀌어도 좀비는 항상 내 뒤에 있었다. 쫓아오는 소리가 너무 가까워져서 숨도 못 쉬겠는데, 이상하게 부딪히거나 잡히진 않는다. 그 순간, 깨달았다. 목표는 날 잡는 게 아니라 내가 도망치는 것이다. 내가 뛰는 동안 좀비는 멀어지지 않고 끊임없이 존재한다. 왜? 탁— 뒤에서 가볍게 무언가 내 어깨를 건드렸다. 나는 비명을 지르며 뒤돌아봤다. 없었다. 좀비는 사라졌다. 대신 내 그림자가 두 개였다. 하나는 나, 하나는 입이 찢어진다. 그림자가 내 목소리로 말했다. “도망쳐줘서 고마워. 그래야 내가 여길 떠날 수 있거든.” 그리고 내 그림자가 내 발 움직임을 따라하기 시작했다. 난 뛰지도 않았는데, 그림자 혼자 뛰고 있었다. 그때 알람이 울렸다. 눈을 떴다. 숨이 턱까지 차 있었다. 그리고 방 벽에 까만 손자국 하나가 찍혀 있었다. 내 키 높이쯤에.
                                                
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

