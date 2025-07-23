-- 사용자 포인트 및 등급 테이블 생성
CREATE TABLE IF NOT EXISTS user_points (
  steam_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  avatar TEXT,
  points INTEGER DEFAULT 0,
  rank_name TEXT DEFAULT 'Initiate',
  rank_image TEXT DEFAULT 'initiate.png',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기존 board_posts 테이블에 view_count 컬럼 추가 (없으면)
ALTER TABLE board_posts ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_points_points ON user_points(points DESC);
CREATE INDEX IF NOT EXISTS idx_user_points_steam_id ON user_points(steam_id);
CREATE INDEX IF NOT EXISTS idx_board_posts_view_count ON board_posts(view_count DESC);

-- 초기 포인트 데이터 삽입 함수
CREATE OR REPLACE FUNCTION update_user_points(p_steam_id TEXT, p_username TEXT, p_avatar TEXT, p_points_to_add INTEGER DEFAULT 0)
RETURNS void AS $$
BEGIN
  INSERT INTO user_points (steam_id, username, avatar, points)
  VALUES (p_steam_id, p_username, p_avatar, p_points_to_add)
  ON CONFLICT (steam_id) 
  DO UPDATE SET 
    username = EXCLUDED.username,
    avatar = EXCLUDED.avatar,
    points = user_points.points + p_points_to_add,
    last_updated = NOW();
    
  -- 포인트에 따른 등급 업데이트
  UPDATE user_points 
  SET 
    rank_name = CASE 
      WHEN points >= 700 THEN 'Eternus'
      WHEN points >= 600 THEN 'Phantom'
      WHEN points >= 500 THEN 'Oracle'
      WHEN points >= 400 THEN 'Ritualist'
      WHEN points >= 300 THEN 'Alchemist'
      WHEN points >= 200 THEN 'Arcanist'
      WHEN points >= 100 THEN 'Seeker'
      ELSE 'Initiate'
    END,
    rank_image = CASE 
      WHEN points >= 700 THEN 'eternus.png'
      WHEN points >= 600 THEN 'phantom.png'
      WHEN points >= 500 THEN 'oracle.png'
      WHEN points >= 400 THEN 'ritualist.png'
      WHEN points >= 300 THEN 'alchemist.png'
      WHEN points >= 200 THEN 'arcanist.png'
      WHEN points >= 100 THEN 'seeker.png'
      ELSE 'initiate.png'
    END
  WHERE steam_id = p_steam_id;
END;
$$ LANGUAGE plpgsql;