const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dpmoafgaysocfjxlmaum.supabase.co';
const supabaseServiceKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwbW9hZmdheXNvY2ZqeGxtYXVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQ2NDMzMSwiZXhwIjoyMDY3MDQwMzMxfQ.G2woWTLhGpc0FOEyfABZs7k1wYTSYCaDeYhYtpoY73c';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  console.log('🗄️ Supabase 테이블 생성 시작...');

  try {
    // 게시글 테이블 생성
    console.log('📝 게시글 테이블 생성 중...');
    const { data: postsData, error: postsError } = await supabase.rpc('exec', {
      sql: `
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
      `,
    });

    if (postsError) {
      console.log('📝 직접 테이블 확인 시도...');
      const { data: testData, error: testError } = await supabase
        .from('board_posts')
        .select('count')
        .limit(1);
      if (testError && testError.code === 'PGRST116') {
        console.log('❌ board_posts 테이블이 존재하지 않습니다.');
      } else {
        console.log('✅ board_posts 테이블이 이미 존재합니다.');
      }
    } else {
      console.log('✅ board_posts 테이블 생성 완료');
    }

    // 댓글 테이블 생성
    console.log('💬 댓글 테이블 생성 중...');
    const { data: commentsData, error: commentsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS board_comments (
          id SERIAL PRIMARY KEY,
          post_id INTEGER REFERENCES board_posts(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          author_steam_id TEXT NOT NULL,
          author_username TEXT NOT NULL,
          author_avatar TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    });

    if (commentsError) {
      console.log('💬 직접 테이블 확인 시도...');
      const { data: testData, error: testError } = await supabase
        .from('board_comments')
        .select('count')
        .limit(1);
      if (testError && testError.code === 'PGRST116') {
        console.log('❌ board_comments 테이블이 존재하지 않습니다.');
      } else {
        console.log('✅ board_comments 테이블이 이미 존재합니다.');
      }
    } else {
      console.log('✅ board_comments 테이블 생성 완료');
    }

    // 인덱스 생성
    console.log('🔧 인덱스 생성 중...');
    await supabase.rpc('exec', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_board_posts_created_at ON board_posts(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_board_comments_post_id ON board_comments(post_id);
        CREATE INDEX IF NOT EXISTS idx_board_comments_created_at ON board_comments(created_at DESC);
      `,
    });

    console.log('🎉 모든 테이블과 인덱스 생성 완료!');
  } catch (error) {
    console.error('❌ 테이블 생성 실패:', error);
    console.log('\n📋 수동으로 Supabase SQL Editor에서 다음 SQL을 실행해주세요:');
    console.log(`
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

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_board_posts_created_at ON board_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_board_comments_post_id ON board_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_board_comments_created_at ON board_comments(created_at DESC);
    `);
  }
}

createTables();
