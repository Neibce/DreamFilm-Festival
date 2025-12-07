-- DreamFilmFestival 스키마 초기화
-- Spring Boot 시작 시 자동 실행

-- 1. 테이블 생성 (없으면)
CREATE TABLE IF NOT EXISTS film_festival (
    festival_id SERIAL PRIMARY KEY,
    festival_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS "user" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dream_film (
    film_id SERIAL PRIMARY KEY,
    festival_id INTEGER REFERENCES film_festival,
    director_id INTEGER REFERENCES "user",
    title VARCHAR(255) NOT NULL,
    dream_text TEXT,
    ai_script TEXT,
    summary TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50),
    image_url TEXT,
    genre VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS award (
    award_id SERIAL PRIMARY KEY,
    film_id INTEGER REFERENCES dream_film,
    festival_id INTEGER REFERENCES film_festival,
    rank INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS judge (
    judge_id SERIAL PRIMARY KEY,
    film_id INTEGER REFERENCES dream_film,
    user_id INTEGER REFERENCES "user",
    comment TEXT,
    judged_at TIMESTAMP,
    creativity INTEGER,
    execution INTEGER,
    emotional_impact INTEGER,
    storytelling INTEGER
);

CREATE TABLE IF NOT EXISTS review (
    review_id SERIAL PRIMARY KEY,
    film_id INTEGER REFERENCES dream_film,
    user_id INTEGER REFERENCES "user",
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vote (
    vote_id SERIAL PRIMARY KEY,
    film_id INTEGER REFERENCES dream_film,
    user_id INTEGER REFERENCES "user"
);

-- 2. View 생성 (매번 재생성)
DROP VIEW IF EXISTS v_film_details CASCADE;
DROP VIEW IF EXISTS v_film_ranking CASCADE;

-- View 1: 영화 상세 + 통계 (LEFT JOIN, GROUP BY, AVG, COUNT, COALESCE)
CREATE VIEW v_film_details AS
SELECT 
    f.film_id, f.title, f.director_id, f.genre, f.status, f.image_url,
    f.created_at, f.summary, f.dream_text, f.ai_script, f.festival_id,
    u.username AS director_name, u.email AS director_email,
    COALESCE(v.vote_count, 0) AS vote_count,
    COALESCE(r.review_count, 0) AS review_count,
    COALESCE(r.avg_rating, 0.0) AS avg_rating
FROM dream_film f
LEFT JOIN "user" u ON f.director_id = u.user_id
LEFT JOIN (SELECT film_id, COUNT(*) AS vote_count FROM vote GROUP BY film_id) v ON f.film_id = v.film_id
LEFT JOIN (SELECT film_id, COUNT(*) AS review_count, AVG(rating) AS avg_rating FROM review GROUP BY film_id) r ON f.film_id = r.film_id;

-- View 2: 영화 랭킹 (LEFT JOIN, GROUP BY, AVG, COUNT)
CREATE VIEW v_film_ranking AS
SELECT 
    f.film_id, f.title, f.director_id, f.genre, f.image_url, f.festival_id, f.created_at,
    COALESCE(AVG((COALESCE(j.creativity,0) + COALESCE(j.execution,0) + COALESCE(j.emotional_impact,0) + COALESCE(j.storytelling,0))/4.0), 0.0) AS judge_score,
    COUNT(DISTINCT CASE WHEN j.creativity IS NOT NULL THEN j.judge_id END) AS judge_count,
    COUNT(DISTINCT v.vote_id) AS vote_count
FROM dream_film f
LEFT JOIN judge j ON f.film_id = j.film_id
LEFT JOIN vote v ON f.film_id = v.film_id
WHERE f.status = 'SUBMITTED'
GROUP BY f.film_id, f.title, f.director_id, f.genre, f.image_url, f.festival_id, f.created_at;

-- 3. Index 생성 (없으면)
CREATE INDEX IF NOT EXISTS idx_film_status ON dream_film(status);
CREATE INDEX IF NOT EXISTS idx_film_director ON dream_film(director_id);
CREATE INDEX IF NOT EXISTS idx_film_festival ON dream_film(festival_id);
CREATE INDEX IF NOT EXISTS idx_vote_film ON vote(film_id);
CREATE INDEX IF NOT EXISTS idx_vote_user ON vote(user_id);
CREATE INDEX IF NOT EXISTS idx_review_film ON review(film_id);
CREATE INDEX IF NOT EXISTS idx_review_user ON review(user_id);
CREATE INDEX IF NOT EXISTS idx_judge_film ON judge(film_id);
CREATE INDEX IF NOT EXISTS idx_judge_user ON judge(user_id);
CREATE INDEX IF NOT EXISTS idx_award_film ON award(film_id);
CREATE INDEX IF NOT EXISTS idx_award_festival ON award(festival_id);
CREATE INDEX IF NOT EXISTS idx_user_role ON "user"(role);
CREATE INDEX IF NOT EXISTS idx_festival_dates ON film_festival(start_date, end_date);

-- 4. Authorization
-- 기존 역할 삭제 후 재생성
-- 4. Authorization
-- 기존 역할의 권한 제거 후 삭제
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM app_director, app_audience, app_judge, app_admin;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM app_director, app_audience, app_judge, app_admin;
REVOKE USAGE ON SCHEMA public FROM app_director, app_audience, app_judge, app_admin;

DROP ROLE IF EXISTS app_director;
DROP ROLE IF EXISTS app_audience;
DROP ROLE IF EXISTS app_judge;
DROP ROLE IF EXISTS app_admin;

-- 역할 생성 (CREATE ROLE)
CREATE ROLE app_director LOGIN PASSWORD 'director_pw_2024' CONNECTION LIMIT 20;
CREATE ROLE app_audience LOGIN PASSWORD 'audience_pw_2024' CONNECTION LIMIT 50;
CREATE ROLE app_judge LOGIN PASSWORD 'judge_pw_2024' CONNECTION LIMIT 10;
CREATE ROLE app_admin LOGIN PASSWORD 'admin_pw_2024' CREATEDB CONNECTION LIMIT 5;

-- 공통 권한 (GRANT)
GRANT USAGE ON SCHEMA public TO app_director, app_audience, app_judge, app_admin;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_director, app_audience, app_judge;

-- 역할별 차별 권한 (GRANT)
GRANT INSERT, UPDATE ON dream_film TO app_director;
GRANT USAGE ON SEQUENCE dream_film_film_id_seq TO app_director;

GRANT INSERT, DELETE ON vote TO app_audience;
GRANT INSERT, UPDATE, DELETE ON review TO app_audience;
GRANT USAGE ON SEQUENCE vote_vote_id_seq TO app_audience;
GRANT USAGE ON SEQUENCE review_review_id_seq TO app_audience;

GRANT INSERT, UPDATE ON judge TO app_judge;
GRANT USAGE ON SEQUENCE judge_judge_id_seq TO app_judge;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_admin;

-- 민감 정보 보호 
REVOKE SELECT ON "user" FROM app_director, app_audience, app_judge;
GRANT SELECT (user_id, username, role, email, created_at) ON "user" TO app_director, app_audience, app_judge;
