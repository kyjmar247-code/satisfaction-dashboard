# GitHub에 코드 업로드하기 (가장 쉬운 방법)

## 📋 1단계: GitHub 리포지토리 만들기

1. https://github.com 에 로그인
2. 오른쪽 위 **+** 버튼 클릭 → **New repository** 선택
3. **Repository name** 입력 (예: `satisfaction-dashboard`)
4. **Public** 또는 **Private** 선택
5. **Initialize this repository with a README** 체크 해제 ⚠️
6. **Create repository** 클릭

## 📤 2단계: 파일 업로드하기

### 방법 A: 웹에서 직접 업로드 (추천! 가장 쉬움)

1. 리포지토리 페이지에서 **"uploading an existing file"** 클릭
   (또는 **"Add file"** → **"Upload files"** 클릭)

2. `dashboard` 폴더 전체를 드래그 앤 드롭
   - 폴더 안의 모든 파일이 선택됩니다
   - 또는 파일을 하나씩 선택해도 됩니다

3. 아래로 스크롤해서 **"Commit changes"** 클릭

4. 완료! 🎉

### 방법 B: GitHub Desktop 사용 (GUI 프로그램)

1. **GitHub Desktop 다운로드**: https://desktop.github.com/
2. 설치 후 실행
3. **File** → **Clone repository** → 방금 만든 리포지토리 선택
4. 로컬 폴더 선택 (예: `C:\Users\KYJ\Desktop\dashboard-github`)
5. `dashboard` 폴더의 모든 파일을 복사하여 리포지토리 폴더에 붙여넣기
6. GitHub Desktop에서 변경사항 확인
7. 왼쪽 하단에 **"Summary"** 입력 (예: "첫 업로드")
8. **"Commit to main"** 클릭
9. **"Push origin"** 클릭
10. 완료! 🎉

## ⚙️ 3단계: GitHub Pages 설정

1. 리포지토리 페이지에서 **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Pages** 클릭
3. **Source**에서 **GitHub Actions** 선택
4. 저장 (변경사항 저장)

## ✅ 4단계: 배포 확인

1. **Actions** 탭 클릭
2. 배포가 진행 중인지 확인 (노란색 원 = 진행 중, 초록색 체크 = 완료)
3. 5-10분 후 **Settings** → **Pages**에서 사이트 URL 확인
4. URL 형식: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## 🎯 업로드해야 할 파일들

`dashboard` 폴더 안의 모든 파일:
- ✅ `.github/workflows/deploy.yml` (자동 배포 설정)
- ✅ `public/converted/` 폴더 (CSV 파일들)
- ✅ `src/` 폴더 (소스 코드)
- ✅ `package.json`, `vite.config.js` 등 모든 설정 파일
- ✅ `index.html`

**제외할 것:**
- ❌ `node_modules/` 폴더 (자동 생성됨)
- ❌ `dist/` 폴더 (자동 생성됨)

## ⚠️ 주의사항

- CSV 파일이 `public/converted/` 폴더에 있어야 합니다
- 첫 배포는 5-10분 정도 걸립니다
- 배포가 완료되면 Actions 탭에 초록색 체크가 표시됩니다

## 🐛 문제 해결

**업로드가 안 될 때:**
- 파일 크기가 100MB 이상이면 안 됩니다
- CSV 파일이 너무 크면 확인 필요

**배포가 실패할 때:**
- Actions 탭에서 오류 메시지 확인
- CSV 파일이 `public/converted/` 폴더에 있는지 확인

