package dreamfilmfestival.film.domain;

import reactor.core.publisher.Mono;

public interface AiScriptGenerator {
    Mono<GeneratedScript> generate(String dreamText);
}

