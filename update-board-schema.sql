-- 기존 테이블에 조회수 컬럼 추가
ALTER TABLE board_posts ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- 또는 처음부터 새로 생성하는 경우
CREATE TABLE IF NOT EXISTS board_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_steam_id TEXT NOT NULL,
  author_username TEXT NOT NULL,
  author_avatar TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 댓글 테이블 (기존과 동일)
CREATE TABLE IF NOT EXISTS board_comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES board_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_steam_id TEXT NOT NULL,
  author_username TEXT NOT NULL,
  author_avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_board_posts_created_at ON board_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_board_posts_view_count ON board_posts(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_board_comments_post_id ON board_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_board_comments_created_at ON board_comments(created_at DESC);