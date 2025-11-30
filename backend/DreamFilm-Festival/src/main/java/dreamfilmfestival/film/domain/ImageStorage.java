package dreamfilmfestival.film.domain;

/**
 * 이미지 저장소 인터페이스 (Domain Layer)
 * <p>
 * DIP(의존성 역전 원칙)를 준수하여 도메인이 인프라에 의존하지 않도록 함
 */
public interface ImageStorage {

    /**
     * 이미지 데이터를 저장하고 접근 가능한 URL을 반환
     *
     * @param imageData 저장할 이미지 바이트 데이터
     * @param filmId    영화 ID (파일명 생성에 사용)
     * @return 저장된 이미지의 접근 URL
     */
    String save(byte[] imageData, Long filmId);

    /**
     * 저장된 이미지를 삭제
     *
     * @param imageUrl 삭제할 이미지 URL
     */
    void delete(String imageUrl);
}
