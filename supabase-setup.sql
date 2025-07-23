-- 게시글 테이블 생성
CREATE TABLE IF NOT EXISTS board_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_steam_id TEXT NOT NULL,
  author_username TEXT NOT NULL,
  author_avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 댓글 테이블 생성
CREATE TABLE IF NOT EXISTS board_comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES board_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_steam_id TEXT NOT NULL,
  author_username TEXT NOT NULL,
  author_avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_board_posts_created_at ON board_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_board_comments_post_id ON board_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_board_comments_created_at ON board_comments(created_at DESC);

-- Row Level Security (RLS) 정책 설정 (선택사항)
-- ALTER TABLE board_posts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE board_comments ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 게시글과 댓글을 읽을 수 있도록 허용
-- CREATE POLICY "Anyone can read posts" ON board_posts FOR SELECT USING (true);
-- CREATE POLICY "Anyone can read comments" ON board_comments FOR SELECT USING (true);

-- 인증된 사용자만 게시글과 댓글을 작성/수정/삭제할 수 있도록 설정
-- CREATE POLICY "Authenticated users can insert posts" ON board_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Authors can update their posts" ON board_posts FOR UPDATE USING (auth.uid()::text = author_steam_id);
-- CREATE POLICY "Authors can delete their posts" ON board_posts FOR DELETE USING (auth.uid()::text = author_steam_id);