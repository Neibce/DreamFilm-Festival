package dreamfilmfestival.film.application;

/**
 * 영화 목록/상세 조회 시 함께 제공되는 집계 정보.
 * 엔티티를 수정하지 않고 조회용 데이터만 전달한다.
 */
public record FilmStats(
        int voteCount,
        int reviewCount,
        double averageRating
) {
}
