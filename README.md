# Deadlock API - 한국어 버전

Deadlock API 웹사이트의 한국어 번역 버전입니다.

## 📋 프로젝트 개요

이 프로젝트는 [Deadlock API](https://deadlock-api.com/)를 한국어로 번역하여 한국 사용자들이 쉽게 접근할 수 있도록 만든 웹사이트입니다.

## 🚀 기능

- **완전 한국어 지원**: 모든 텍스트가 한국어로 번역됨
- **반응형 디자인**: 모든 디바이스에서 최적화된 사용자 경험
- **API 문서**: 상세한 한국어 API 문서 제공
- **코드 예제**: JavaScript, Python, cURL 등 다양한 언어의 예제
- **실시간 데이터**: Deadlock 게임 데이터 API 연동

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Backend**: Node.js, Express.js
- **폰트**: Noto Sans KR (한국어 최적화)
- **배포**: Railway

## 📦 설치 및 실행

### 로컬 개발 환경

```bash
# 저장소 클론
git clone https://github.com/yourusername/deadlock-api-korean.git
cd deadlock-api-korean

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

서버가 `http://localhost:3000`에서 실행됩니다.

### Railway 배포

1. Railway 계정 생성
2. GitHub 저장소 연결
3. 자동 배포 설정 완료

## 🎯 주요 페이지

### 1. 홈페이지
- Deadlock API 소개
- 주요 기능 안내
- 빠른 시작 가이드

### 2. API 문서
- 상세한 API 엔드포인트 설명
- 요청/응답 예제
- 오류 코드 설명

### 3. 엔드포인트
- **영웅 API**: 모든 영웅 데이터 조회
- **아이템 API**: 게임 아이템 정보
- **매치 API**: 게임 매치 데이터
- **통계 API**: 게임 통계 및 분석

### 4. 사용 예제
- JavaScript (Node.js)
- Python
- cURL
- 다양한 프로그래밍 언어 지원

## 📊 API 엔드포인트

### 영웅 API
- `GET /api/heroes` - 모든 영웅 목록
- `GET /api/heroes/{id}` - 특정 영웅 정보
- `GET /api/heroes/{id}/abilities` - 영웅 능력
- `GET /api/heroes/{id}/stats` - 영웅 통계

### 아이템 API
- `GET /api/items` - 모든 아이템 목록
- `GET /api/items/{id}` - 특정 아이템 정보
- `GET /api/items/categories` - 아이템 카테고리
- `GET /api/items/builds` - 추천 빌드

### 매치 API
- `GET /api/matches` - 최근 매치 목록
- `GET /api/matches/{id}` - 특정 매치 정보
- `GET /api/matches/live` - 실시간 매치
- `GET /api/matches/player/{id}` - 플레이어 매치 히스토리

### 통계 API
- `GET /api/stats/heroes` - 영웅 통계
- `GET /api/stats/items` - 아이템 통계
- `GET /api/stats/meta` - 메타 분석
- `GET /api/stats/leaderboard` - 리더보드

## 🎨 디자인 특징

- **다크 테마**: 게임 분위기에 맞는 다크 모드
- **글래스 이펙트**: 모던한 반투명 효과
- **부드러운 애니메이션**: 호버 효과 및 전환
- **한국어 폰트**: Noto Sans KR 사용
- **반응형 그리드**: 모든 화면 크기 대응

## 📱 반응형 디자인

- **모바일**: 360px 이상
- **태블릿**: 768px 이상
- **데스크톱**: 1024px 이상
- **대형 화면**: 1280px 이상

## 🔧 개발 환경 설정

### 필요 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn
- 모던 웹 브라우저

### 환경 변수
```bash
NODE_ENV=production
PORT=3000
```

## 🚀 배포 정보

- **플랫폼**: Railway
- **도메인**: deadlock-api-korean.railway.app
- **자동 배포**: GitHub 푸시 시 자동 배포
- **헬스체크**: `/` 경로에서 상태 확인

## 📄 라이선스

MIT License

## 🤝 기여하기

1. 포크 (Fork)
2. 기능 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치 푸시 (`git push origin feature/AmazingFeature`)
5. 풀 리퀘스트 생성

## 📞 문의

- 이메일: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 감사의 말

- [Deadlock API](https://deadlock-api.com/) 원본 사이트
- [Tailwind CSS](https://tailwindcss.com/) 스타일링
- [Railway](https://railway.app/) 배포 플랫폼
- [Noto Sans KR](https://fonts.google.com/noto/specimen/Noto+Sans+KR) 폰트

---

**참고**: 이 프로젝트는 학습 목적으로 제작되었으며, 원본 Deadlock API와는 직접적인 관련이 없습니다.