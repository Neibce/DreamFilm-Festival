package dreamfilmfestival.film.domain;

import reactor.core.publisher.Mono;

public interface AiScriptGenerator {
    Mono<GeneratedScript> generate(String title, String dreamText, String genre, String mood, String themes);
}

