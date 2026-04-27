<div align="center">

<img src="frontend/public/logo.png" alt="DreamFilm Festival" width="120" />

# DreamFilm Festival

**꿈에서 영감을 얻어 AI가 시나리오·포스터를 생성하고, 관객 투표와 전문 심사위원의 평가를 거쳐 수상작을 선정하는 가상 영화제 플랫폼**

2025년 2학기 데이터베이스 과목 Term Project

[![Demo](https://img.shields.io/badge/Demo-dff.jun0.dev-000?style=flat-square)](https://dff.jun0.dev)
![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)


</div>

## 프로젝트 소개

사용자가 작성한 꿈 이야기를 **OpenAI GPT**로 한 편의 영화 시나리오로 재구성하고, **Google Gemini**로 영화 포스터까지 자동으로 만들어 줍니다. 생성된 작품은 꿈 영화제의 상영작으로 등록되고, 관객은 투표와 리뷰로, 심사위원은 네 가지 항목의 점수로 작품을 평가합니다. 영화제 종료 시점에는 집계된 결과를 기준으로 수상작이 확정됩니다.

> 꿈이라는 지극히 개인적인 소재가 AI를 거쳐 누구나 감상할 수 있는 콘텐츠로 바꾼다면 흥미로운 프로젝트가 될 것이라 생각했습니다.

## 스크린샷

| 메인 | 상영작 목록 | 작품 상세 |
| --- | --- | --- |
| _(추가 예정)_ | _(추가 예정)_ | _(추가 예정)_ |

| 심사 대시보드 | 관리자 콘솔 | 수상작 |
| --- | --- | --- |
| _(추가 예정)_ | _(추가 예정)_ | _(추가 예정)_ |


## 주요 기능

- **꿈 출품 → AI 생성**: 꿈 내용, 장르, 분위기, 테마를 입력하면 GPT-5.1이 영화 시나리오와 요약을 JSON 스키마에 맞춰 생성하고, Gemini 3 Pro가 4:5 비율의 영화 포스터 이미지를 생성합니다.
- **4단계 승인 플로우**: `AI 생성 대기 → 감독 승인 대기 → 관리자 승인 대기 → 상영`으로 이어지는 상태 머신. 감독이 결과물이 마음에 안 들면 거절, 관리자가 부적절하다고 판단하면 반려할 수 있습니다.
- **4개 역할의 분리된 UX**: 관객 / 감독 / 심사위원 / 관리자마다 네비게이션, 접근 가능한 페이지, API 권한이 모두 다릅니다. 관객이 처음 출품을 확정하면 자동으로 감독으로 승격됩니다.
- **심사위원 평가**: 창의성·연출·감정 전달력·스토리텔링 네 항목을 1~5점으로 평가. 영화제 종료 전까지 수정 가능, 종료 후에는 전부 잠금.
- **수상작 자동 선정**: 심사 평균 점수 기반 랭킹 상위권 + 관객 투표 수 기반 인기상을 영화제 종료 시 일괄 확정.


## 기술 스택

- **Backend:** Spring Boot 4 · Java 21 · Spring JDBC (JdbcClient) · Spring WebFlux · PostgreSQL · HikariCP · BCrypt · Lombok · Gradle  
- **Frontend:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Zustand · Radix UI · React Hook Form · Zod  
- **AI:** OpenAI GPT-5.1 Responses API · Google Gemini 3 Pro Image Preview


## 아키텍처

```
Next.js 16 (Vercel)            Spring Boot 4 (Java 21)
───────────────────            ─────────────────────────
App Router              ─────▶ REST API (세션 기반 인증)
Zustand (auth/toast)           ├─ domain (불변식, 상태 전이)
Tailwind + Radix UI            ├─ application (@Async 이벤트)
                               ├─ infrastructure (JDBC, AI)
                               └─ presentation (Controller, DTO)
                                         │
                                         │ JdbcClient + HikariCP
                                         ▼
                               PostgreSQL
                               ─ Role별 GRANT/REVOKE
                               ─ View (랭킹, 상세)
                               ─ 조회 패턴 기반 Index

외부 AI 연동 (비동기)
  OpenAI GPT-5.1        → 시나리오/요약 생성 (WebClient + JSON Schema)
  Google Gemini 3 Pro   → 포스터 이미지 생성 (google-genai SDK)
```

도메인은 전부 `domain / application / infrastructure / presentation` 4-layer로 통일했고, `film`, `user`, `festival`, `judge`, `vote`, `review`, `award` 각 패키지가 같은 구조를 따릅니다.


## 백엔드 구현에서 신경썼던 부분

### 1. AI 호출을 HTTP 요청 스레드에서 분리했습니다.

GPT + Gemini 왕복이 20초 이상 걸리기 때문에 출품 API를 그 동안 붙잡아 두는 건 불가능했습니다. `ApplicationEventPublisher`로 이벤트를 발행하고, `@Async` 이벤트 핸들러가 전용 `ThreadPoolTaskExecutor`(core 2 / max 5 / queue 100)에서 시나리오→이미지를 순차 처리하도록 분리했습니다. 이미지 생성이 실패해도 시나리오까지는 유지되고 상태 전이도 보장되도록 부분 실패를 격리했습니다.

### 2. 상태 전이 로직을 도메인 객체가 직접 소유하도록 했습니다.

```java
public void approveByAdmin() {
    if (this.status != FilmStatus.WAITING_ADMIN_APPROVAL) {
        throw new IllegalStateException("현재 상태에서 관리자 승인을 할 수 없습니다.");
    }
    this.status = FilmStatus.SUBMITTED;
}
```

서비스 계층에 `if status == ... else ...`가 쌓이는 걸 피하기 위해, 상태 전이 유효성 검증은 전부 `DreamFilm` 도메인 객체 안에서 수행합니다.

### 3. 애플리케이션 + DB 이중 권한 분리

Spring 세션으로 역할을 구분하는 것에 더해, PostgreSQL에 `app_admin / app_director / app_judge / app_audience` 역할을 별도로 만들고 테이블·컬럼 단위로 GRANT/REVOKE 했습니다.
과한 분리이지만, 데이터베이스 과목의 텀 프로젝트이므로 DCL 등을 사용해보기 위해 적용하였습니다.

```sql
GRANT INSERT, UPDATE ON dream_film TO app_director;
GRANT INSERT, DELETE ON vote        TO app_audience;
GRANT INSERT, UPDATE ON judge       TO app_judge;

REVOKE SELECT ON "user" FROM app_director, app_audience, app_judge;
GRANT  SELECT (user_id, username, role, email, created_at)
  ON "user" TO app_director, app_audience, app_judge;
```

### 4. JPA 없이 JdbcClient로 Repository 수동 구현

통계·랭킹 쿼리가 많기도 했고, 데이터베이스 과목의 프로젝트이기에 ORM을 걷어내고 Spring JDBC의 `JdbcClient`로 Repository를 직접 구현했습니다. 또한, DB에 View와 Index를 적극적으로 뒀습니다.

```sql
CREATE VIEW v_film_ranking AS
SELECT f.film_id, f.title, f.genre, f.image_url, f.festival_id, f.created_at,
       COALESCE(AVG((COALESCE(j.creativity,0) + COALESCE(j.execution,0)
                   + COALESCE(j.emotional_impact,0) + COALESCE(j.storytelling,0)) / 4.0), 0.0) AS judge_score,
       COUNT(DISTINCT v.vote_id) AS vote_count
FROM dream_film f
LEFT JOIN judge j ON f.film_id = j.film_id
LEFT JOIN vote  v ON f.film_id = v.film_id
WHERE f.status = 'SUBMITTED'
GROUP BY f.film_id, ...;
```

- `v_film_details` : 영화 + 감독 + 투표 수 + 리뷰 수 + 평균 평점 집계
- `v_film_ranking` : 심사 평균 점수 + 투표 수 기반 랭킹
- 조회 패턴 기반 인덱스(`idx_film_status`, `idx_vote_film`, `idx_judge_film` 등)
- 제목·감독명 부분 일치 `LIKE` 검색

---

## 디렉터리 구조

```
├── backend/DreamFilm-Festival/
│   └── src/main/java/dreamfilmfestival/
│       ├── film/                   # 꿈 영화 도메인 (AI 생성 + 상태 머신)
│       │   ├── domain/             # DreamFilm, FilmStatus, event/, ImageGenerator ...
│       │   ├── application/        # DreamFilmService, FilmEventHandler (@Async)
│       │   ├── infrastructure/     # JdbcDreamFilmRepository, OpenAiScriptGenerator,
│       │   │                       # GeminiImageGenerator, LocalImageStorage
│       │   └── presentation/       # DreamFilmController + DTO/Mapper
│       ├── user/, festival/, judge/, vote/, review/, award/   # 동일 4-layer 구조
│       └── common/
│           ├── config/             # AsyncConfig, CorsConfig, WebClientConfig
│           └── exception/          # GlobalExceptionHandler
│   └── src/main/resources/
│       ├── application.properties
│       └── schema.sql              # 테이블 + View + Index + Role + GRANT
│
└── frontend/
    ├── app/                        # explore, films/[id], submit, judge,
    │                               # admin, awards, director/[id], login, signup
    ├── components/                 # shadcn/ui + 자체 컴포넌트
    ├── hooks/useRoleGuard.ts       # 페이지 단위 권한 가드
    ├── lib/api.ts                  # fetch 래퍼 (credentials: include)
    └── store/                      # Zustand
```

## 로컬 실행

필요: Java 21+, Node.js 20+, PostgreSQL 14+

```bash
# 환경 변수
export DB_HOST=localhost DB_PORT=5432 DB_NAME=dreamfilm
export DB_USERNAME=postgres DB_PASSWORD=postgres
export OPENAI_API_KEY=sk-...
export GEMINI_API_KEY=...

# Backend - 부팅 시 schema.sql 자동 실행 (테이블/View/Index/Role 초기화)
cd backend/DreamFilm-Festival
./gradlew bootRun                        # http://localhost:8085

# Frontend
cd frontend
pnpm install
NEXT_PUBLIC_API_BASE=http://localhost:8085 pnpm dev    # http://localhost:3000
```

---

## 팀 & 담당

- 쿼리문 + 아키텍쳐 구상 : 공통
- 프론트엔드 개발: [@surfwithus](https://github.com/surfwithus/DreamFilm-Festival)
- 백엔드 개발: [@Neibce](https://github.com/Neibce)
