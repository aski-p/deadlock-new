# Railway 배포 설정 가이드

## 🚀 Railway 즉시 배포 설정

### 1. GitHub 저장소 생성 및 업로드
```bash
# GitHub에서 'deadlock-new' 레포지토리 생성 후
git remote add origin https://github.com/YOUR_USERNAME/deadlock-new.git
git branch -M main  
git push -u origin main
```

### 2. Railway 원클릭 배포
1. [Railway](https://railway.app) 접속
2. "New Project" 클릭
3. "Deploy from GitHub repo" 선택
4. `deadlock-new` 저장소 선택

### 3. 자동 배포 설정
Railway가 자동으로 감지하는 설정:
- ✅ `package.json` - Node.js 프로젝트 감지
- ✅ `railway.toml` - Railway 설정 파일
- ✅ `server.js` - Express.js 서버 파일

### 4. 배포 완료 확인
배포 후 다음을 확인:
- 빌드 로그에서 성공 메시지 확인
- 제공된 URL에서 웹사이트 동작 확인
- 모든 페이지와 기능이 정상 작동하는지 테스트

## 📋 배포 파일 설명

### `package.json`
```json
{
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "compression": "^1.7.4",
    "cors": "^2.8.5"
  }
}
```

### `railway.toml`
```toml
[build]
builder = "NIXPACKS"

[deploy]
healthcheckPath = "/"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
```

### `server.js`
- Express.js 서버 설정
- 정적 파일 서빙
- 압축 및 CORS 설정
- 404 에러 핸들링

## 🔧 Railway 대시보드 설정

### 환경 변수 (선택사항)
Railway 대시보드에서 설정:
- `NODE_ENV`: `production`
- `PORT`: `3000` (기본값, Railway에서 자동 할당)

### 도메인 설정
1. Railway 대시보드에서 "Settings" 탭
2. "Domains" 섹션에서 커스텀 도메인 추가 (선택사항)
3. 기본 제공 도메인: `YOUR_PROJECT.railway.app`

## 🚨 배포 후 확인 사항

### 1. 웹사이트 접속 테스트
- 메인 페이지 로딩 확인
- 모든 섹션 정상 표시 확인
- 반응형 디자인 동작 확인

### 2. 성능 확인
- 페이지 로딩 속도 확인
- 모바일 환경에서 테스트
- 한국어 폰트 정상 로딩 확인

### 3. 에러 확인
- Railway 대시보드에서 로그 확인
- 콘솔 에러 메시지 확인
- 404 페이지 정상 동작 확인

## 🔄 업데이트 배포

코드 변경 시 자동 배포:
```bash
git add .
git commit -m "Update: 변경 사항 설명"
git push origin main
```
Railway에서 자동으로 새 버전 배포

## 📞 문제 해결

### 일반적인 문제
1. **빌드 실패**: package.json 의존성 확인
2. **서버 시작 실패**: server.js 파일 확인
3. **정적 파일 로딩 실패**: Express 정적 파일 설정 확인

### 로그 확인
Railway 대시보드 → 프로젝트 선택 → "Deployments" 탭 → 최신 배포 클릭

---

🎯 **이 설정으로 Railway에서 즉시 배포 가능합니다!**