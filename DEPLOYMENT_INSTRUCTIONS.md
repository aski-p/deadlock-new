# Deadlock API Korean - 배포 가이드

이 프로젝트를 GitHub과 Railway에 배포하는 방법을 안내합니다.

## 📋 배포 전 준비사항

### 1. GitHub 저장소 생성
1. [GitHub](https://github.com)에 로그인
2. 새 저장소 생성 (Repository name: `deadlock-api-korean`)
3. Public 저장소로 설정
4. README, .gitignore, 라이선스는 추가하지 않음 (이미 있음)

### 2. 로컬 저장소와 GitHub 연결
```bash
# 현재 디렉토리에서 실행
git remote add origin https://github.com/YOUR_USERNAME/deadlock-api-korean.git
git branch -M main
git push -u origin main
```

## 🚀 Railway 배포

### 1. Railway 계정 생성
1. [Railway](https://railway.app)에 접속
2. GitHub 계정으로 로그인
3. 새 프로젝트 생성

### 2. GitHub 저장소 연결
1. Railway 대시보드에서 "New Project" 클릭
2. "Deploy from GitHub repo" 선택
3. `deadlock-api-korean` 저장소 선택
4. 자동 배포 활성화

### 3. 환경 변수 설정 (선택사항)
Railway에서 다음 환경 변수 설정:
- `NODE_ENV`: `production`
- `PORT`: `3000` (기본값)

### 4. 배포 확인
- Railway에서 자동으로 빌드 및 배포 시작
- 배포 완료 후 제공되는 URL에 접속하여 확인

## 📁 파일 구조
```
deadlock-api-korean/
├── index.html          # 메인 HTML 파일
├── server.js           # Express.js 서버
├── package.json        # Node.js 의존성
├── railway.toml        # Railway 설정
├── README.md           # 프로젝트 설명
├── .gitignore          # Git 무시 파일
├── public/             # 정적 파일 (선택사항)
└── DEPLOYMENT_INSTRUCTIONS.md  # 이 파일
```

## 🔧 로컬 개발 환경 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm start
```

### 3. 브라우저에서 확인
```
http://localhost:3000
```

## 🌐 배포된 사이트 특징

### 주요 기능
- **완전 한국어 지원**: 모든 텍스트가 한국어로 번역
- **반응형 디자인**: 모든 디바이스에서 최적화
- **API 문서**: 상세한 한국어 API 문서
- **코드 예제**: JavaScript, Python, cURL 예제
- **다크 테마**: 게임 분위기에 맞는 디자인

### 성능 최적화
- Gzip 압축 활성화
- 정적 파일 캐싱
- 반응형 이미지 처리
- 최적화된 폰트 로딩

## 🔍 문제 해결

### 일반적인 문제
1. **빌드 실패**: `package.json` 파일 확인
2. **포트 오류**: Railway에서 PORT 환경 변수 설정 확인
3. **404 오류**: Express.js 라우팅 설정 확인

### 로그 확인
Railway 대시보드에서 배포 로그와 런타임 로그를 확인할 수 있습니다.

## 📞 지원

문제가 발생하면 다음을 확인하세요:
- Railway 공식 문서: https://docs.railway.app/
- Express.js 문서: https://expressjs.com/
- Node.js 문서: https://nodejs.org/

## 🎯 다음 단계

배포가 완료되면:
1. 커스텀 도메인 연결 (선택사항)
2. SSL 인증서 설정 (Railway에서 자동)
3. 모니터링 설정
4. 성능 최적화

---

✅ 배포가 완료되면 이 가이드를 참고하여 사이트를 확인하세요!