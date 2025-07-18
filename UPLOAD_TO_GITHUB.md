# GitHub에 업로드하기

## 🚀 deadlock-new 레포지토리에 업로드

### 1. GitHub에서 레포지토리 생성
1. [GitHub](https://github.com) 로그인
2. 오른쪽 상단 `+` 버튼 → `New repository` 클릭
3. Repository name: `deadlock-new`
4. Description: `Deadlock API 한국어 번역 웹사이트`
5. Public 선택
6. **중요**: Add a README file, .gitignore, license 모두 체크 해제
7. `Create repository` 클릭

### 2. 생성된 레포지토리 URL 확인
생성 후 나타나는 URL을 확인하세요:
- 예: `https://github.com/YOUR_USERNAME/deadlock-new.git`

### 3. 로컬에서 GitHub에 업로드
터미널에서 다음 명령어 실행:

```bash
# deadlock-api-korean 폴더로 이동
cd /home/aski/deadlock-api-korean

# GitHub 레포지토리 연결 (YOUR_USERNAME을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/deadlock-new.git

# 메인 브랜치로 변경
git branch -M main

# GitHub에 푸시
git push -u origin main
```

### 4. 업로드 확인
GitHub 웹사이트에서 deadlock-new 레포지토리를 확인하여 모든 파일이 업로드되었는지 확인하세요.

## 🚀 Railway에서 즉시 배포

### 1. Railway 프로젝트 생성
1. [Railway](https://railway.app) 접속
2. GitHub 계정으로 로그인
3. `New Project` 클릭
4. `Deploy from GitHub repo` 선택
5. `deadlock-new` 레포지토리 선택
6. `Deploy Now` 클릭

### 2. 자동 배포 완료
Railway가 자동으로:
- ✅ Node.js 환경 감지
- ✅ 의존성 설치 (npm install)
- ✅ 서버 시작 (npm start)
- ✅ 도메인 할당

### 3. 배포 완료 확인
- Railway 대시보드에서 배포 상태 확인
- 제공된 URL 클릭하여 웹사이트 확인
- 모든 기능 정상 작동 확인

## 📋 업로드할 파일 목록

현재 준비된 파일들:
- ✅ `index.html` - 메인 웹사이트
- ✅ `server.js` - Express 서버
- ✅ `package.json` - Node.js 설정
- ✅ `railway.toml` - Railway 배포 설정
- ✅ `Dockerfile` - 컨테이너 설정
- ✅ `vercel.json` - Vercel 배포 설정
- ✅ `healthcheck.js` - 헬스체크 스크립트
- ✅ `README.md` - 프로젝트 문서
- ✅ `.gitignore` - Git 무시 파일
- ✅ `.dockerignore` - Docker 무시 파일

## 🔧 Railway 배포 후 설정

### 선택사항: 환경 변수 설정
Railway 대시보드에서:
1. 프로젝트 선택
2. `Variables` 탭 클릭
3. 필요시 환경 변수 추가:
   - `NODE_ENV`: `production`

### 선택사항: 커스텀 도메인 설정
1. `Settings` 탭 클릭
2. `Domains` 섹션에서 커스텀 도메인 추가

## 🎯 배포 완료 후 확인사항

### 웹사이트 기능 테스트
- [ ] 메인 페이지 로딩
- [ ] 네비게이션 메뉴 작동
- [ ] 반응형 디자인 확인
- [ ] 한국어 폰트 정상 표시
- [ ] 모든 섹션 정상 작동

### 성능 확인
- [ ] 페이지 로딩 속도
- [ ] 모바일 환경 테스트
- [ ] 헬스체크 엔드포인트 (`/health`)

---

🎉 **이제 Railway에서 즉시 배포 가능합니다!**

배포 후 제공되는 URL: `https://YOUR_PROJECT_NAME.railway.app`