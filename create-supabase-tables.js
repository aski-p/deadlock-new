const https = require('https');

const supabaseUrl = 'dpmoafgaysocfjxlmaum.supabase.co';
const serviceKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwbW9hZmdheXNvY2ZqeGxtYXVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQ2NDMzMSwiZXhwIjoyMDY3MDQwMzMxfQ.G2woWTLhGpc0FOEyfABZs7k1wYTSYCaDeYhYtpoY73c';

// Supabase에서 SQL 함수를 생성하고 실행하는 함수
async function createSQLFunction() {
  return new Promise((resolve, reject) => {
    // 먼저 SQL 실행 함수를 생성
    const functionSQL = `
CREATE OR REPLACE FUNCTION create_board_tables()
RETURNS text AS $$
BEGIN
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

  RETURN 'Tables created successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    const postData = JSON.stringify({
      query: functionSQL,
    });

    const options = {
      hostname: supabaseUrl,
      port: 443,
      path: '/rest/v1/rpc/exec',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
      },
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        console.log('함수 생성 응답:', res.statusCode, data);
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(data);
        } else {
          reject(new Error(`함수 생성 실패: ${res.statusCode} ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// 생성된 함수를 실행
async function executeSQLFunction() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({});

    const options = {
      hostname: supabaseUrl,
      port: 443,
      path: '/rest/v1/rpc/create_board_tables',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
      },
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        console.log('함수 실행 응답:', res.statusCode, data);
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`함수 실행 실패: ${res.statusCode} ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// 직접 SQL 실행 시도
async function directSQL() {
  return new Promise((resolve, reject) => {
    const sql = `
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
      
      CREATE TABLE IF NOT EXISTS board_comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES board_posts(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        author_steam_id TEXT NOT NULL,
        author_username TEXT NOT NULL,
        author_avatar TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // PostgreSQL 직접 연결 시도
    const postData = sql;

    const options = {
      hostname: 'aws-0-ap-northeast-1.pooler.supabase.com',
      port: 6543,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/sql',
        Authorization: `Bearer ${serviceKey}`,
      },
    };

    console.log('PostgreSQL 직접 연결 시도...');
    // 이 방법은 작동하지 않을 수 있지만 시도해봅시다
    resolve('직접 연결은 지원되지 않음');
  });
}

async function main() {
  console.log('🗄️ Supabase 테이블 자동 생성 시작...');

  try {
    console.log('1️⃣ SQL 함수 생성 시도...');
    await createSQLFunction();

    console.log('2️⃣ 함수 실행 시도...');
    const result = await executeSQLFunction();

    console.log('✅ 테이블 생성 완료!', result);
  } catch (error) {
    console.log('❌ 자동 생성 실패:', error.message);
    console.log('📋 Supabase에서 수동으로 다음 SQL을 실행해주세요:');
    console.log(`
-- 게시글 테이블
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

-- 댓글 테이블
CREATE TABLE IF NOT EXISTS board_comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES board_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_steam_id TEXT NOT NULL,
  author_username TEXT NOT NULL,
  author_avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_board_posts_created_at ON board_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_board_comments_post_id ON board_comments(post_id);
    `);
  }
}

main();
