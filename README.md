# Deadlock Coach - Korean

데드락 게임의 최고 코칭 플랫폼 - [deadlock.coach](https://deadlock.coach/ko) 클론 프로젝트

## 🎮 프로젝트 소개

Deadlock Coach는 Steam API를 활용하여 데드락 게임의 플레이어 통계, 리더보드, 게임 분석을 제공하는 웹 플랫폼입니다.

### 주요 기능

- 🔐 **Steam 로그인 연동**: Steam 계정으로 간편 로그인
- 🏆 **글로벌 리더보드**: 지역별/영웅별 실시간 랭킹
- 📊 **플레이어 통계**: 상세한 개인 게임 데이터 분석
- 🎯 **매치 분석**: 게임 리플레이 및 성과 분석
- 📚 **게임 가이드**: 영웅별 가이드 및 아이템 빌드

## 🛠 기술 스택

- **Backend**: Node.js, Express.js
- **Authentication**: Passport.js (Steam Strategy)
- **Template Engine**: EJS
- **Styling**: CSS3 (Flexbox, Grid)
- **API**: Steam Web API
- **Deployment**: Railway, Vercel, Heroku 지원

## 📁 프로젝트 구조

```
deadlock-new/
├── public/                 # 정적 파일
│   ├── css/
│   │   └── styles.css     # 메인 스타일시트
│   ├── js/
│   │   └── app.js         # 클라이언트 JavaScript
│   └── images/            # 이미지 파일
├── views/                 # EJS 템플릿
│   ├── layout.ejs         # 공통 레이아웃
│   ├── index.ejs          # 홈페이지
│   ├── leaderboards.ejs   # 리더보드
│   └── 404.ejs           # 404 페이지
├── server.js              # Express 서버
├── package.json           # 의존성 패키지
├── .env.example          # 환경변수 예시
└── README.md             # 프로젝트 문서
```

## 🚀 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/aski-p/deadlock-new.git
cd deadlock-new
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 설정을 업데이트하세요:

```bash
cp .env.example .env
```

`.env` 파일에서 다음 값들을 설정하세요:

```env
# Steam API Configuration
STEAM_API_KEY=your-steam-api-key-here
STEAM_REALM=http://localhost:3000
STEAM_RETURN_URL=http://localhost:3000/auth/steam/return

# Session Configuration
SESSION_SECRET=your-session-secret-here

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. 서버 실행

```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm start
```

서버가 실행되면 `http://localhost:3000`에서 접속할 수 있습니다.

## 🔑 Steam API 키 발급

1. [Steam Developer](https://steamcommunity.com/dev/apikey) 페이지 방문
2. 도메인 이름 입력 (로컬 개발: `localhost`)
3. API 키 발급 받기
4. `.env` 파일의 `STEAM_API_KEY`에 설정

## 🌐 배포

### Railway 배포

1. [Railway](https://railway.app) 계정 생성
2. GitHub 저장소 연결
3. 환경변수 설정:
   - `STEAM_API_KEY`: Steam API 키
   - `SESSION_SECRET`: 세션 시크릿 키
   - `STEAM_REALM`: 배포된 도메인
   - `STEAM_RETURN_URL`: `https://your-domain.railway.app/auth/steam/return`

### Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 환경변수 설정
vercel env add STEAM_API_KEY
vercel env add SESSION_SECRET
```

### Heroku 배포

```bash
# Heroku CLI로 앱 생성
heroku create your-app-name

# 환경변수 설정
heroku config:set STEAM_API_KEY=your-api-key
heroku config:set SESSION_SECRET=your-secret

# 배포
git push heroku main
```

## 📊 API 엔드포인트

### 인증 관련

- `GET /auth/steam` - Steam 로그인
- `GET /auth/steam/return` - Steam 로그인 콜백
- `GET /logout` - 로그아웃
- `GET /api/v1/auth/login/ko` - 로그인 상태 확인

### 플레이어 데이터

- `GET /api/player/:steamId/stats` - 플레이어 통계
- `GET /api/player/:steamId/recent` - 최근 게임 기록

### 페이지 라우트

- `GET /` 또는 `GET /ko` - 홈페이지
- `GET /ko/leaderboards/:region` - 지역별 리더보드
- `GET /health` - 서버 상태 확인

## 🎨 스타일 가이드

### 컬러 팔레트

- **Primary Background**: `#000000` (검정)
- **Secondary Background**: `#1a1a1a` (어두운 회색)
- **Accent Color**: `#ffd700` (금색)
- **Text Primary**: `#f5e6d3` (크림색)
- **Text Secondary**: `#ccc` (밝은 회색)
- **Border**: `#333` (어두운 테두리)

### 타이포그래피

- **Font Family**: 'Roboto', sans-serif
- **Headings**: 700 weight
- **Body**: 400 weight
- **UI Elements**: 500-600 weight

## 🔧 개발 가이드

### 새로운 페이지 추가

1. `views/` 디렉토리에 EJS 템플릿 생성
2. `server.js`에 라우트 추가
3. 필요시 CSS 스타일 추가
4. JavaScript 기능 구현

### Steam API 활용

```javascript
// 플레이어 정보 가져오기
const response = await fetch(`/api/player/${steamId}/stats`);
const data = await response.json();

// 최근 게임 기록
const recentGames = await fetch(`/api/player/${steamId}/recent`);
const games = await recentGames.json();
```

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 참고사항

- **Steam API**: 게임 데이터는 Valve의 Steam Web API를 통해 제공됩니다
- **Deadlock**: 이 프로젝트는 Valve의 Deadlock 게임과 관련이 있지만, 공식 프로젝트가 아닙니다
- **데이터 사용**: 모든 게임 데이터는 Steam API의 이용 약관에 따라 사용됩니다

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!