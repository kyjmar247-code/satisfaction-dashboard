# GitHub Pages 배포 가이드

이 가이드는 대시보드를 GitHub Pages에 배포하는 방법을 설명합니다.

## 📋 사전 준비

1. **GitHub 계정**이 필요합니다 (없으면 https://github.com 에서 가입)
2. **Git**이 설치되어 있어야 합니다 (없으면 https://git-scm.com/downloads 에서 다운로드)

## 🚀 배포 방법

### 1단계: GitHub 리포지토리 생성

1. GitHub에 로그인
2. 오른쪽 위의 **+** 버튼 클릭 → **New repository** 선택
3. 리포지토리 이름 입력 (예: `satisfaction-dashboard`)
4. **Public** 또는 **Private** 선택
5. **Initialize this repository with a README** 체크 해제
6. **Create repository** 클릭

### 2단계: 프로젝트 업로드

#### 방법 A: GitHub Desktop 사용 (가장 쉬움)

1. **GitHub Desktop** 다운로드: https://desktop.github.com/
2. GitHub Desktop 실행
3. **File** → **Clone repository** → 방금 만든 리포지토리 선택
4. 로컬 폴더 선택
5. `dashboard` 폴더의 모든 파일을 복사하여 리포지토리 폴더에 붙여넣기
6. GitHub Desktop에서 **Commit to main** 클릭
7. **Push origin** 클릭

#### 방법 B: 명령줄 사용

프로젝트 폴더에서 다음 명령 실행:

```bash
cd dashboard

# Git 초기화 (처음 한 번만)
git init

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit"

# GitHub 리포지토리 연결 (YOUR_USERNAME과 YOUR_REPO_NAME을 실제 값으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 업로드
git branch -M main
git push -u origin main
```

### 3단계: GitHub Pages 설정

1. GitHub 리포지토리 페이지로 이동
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Pages** 클릭
4. **Source**에서 **GitHub Actions** 선택
5. 저장 (이미 워크플로우가 설정되어 있으면 자동으로 배포 시작)

### 4단계: 배포 확인

1. 몇 분 후 **Actions** 탭에서 배포 상태 확인
2. 배포가 완료되면 **Settings** → **Pages**에서 사이트 URL 확인
3. URL은 다음과 같습니다: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## 🔄 업데이트 방법

코드를 수정한 후:

**GitHub Desktop 사용:**
1. 변경사항 커밋
2. Push origin 클릭
3. 자동으로 배포 시작

**명령줄 사용:**
```bash
git add .
git commit -m "업데이트 내용"
git push
```

## ⚠️ 주의사항

1. **CSV 파일**: `public/converted/` 폴더에 CSV 파일이 있어야 빌드가 성공합니다
2. **리포지토리 이름**: 리포지토리 이름을 변경하면 base 경로도 자동으로 변경됩니다
3. **배포 시간**: 첫 배포는 5-10분 정도 걸릴 수 있습니다

## 🐛 문제 해결

### 배포가 실패하는 경우

1. **Actions** 탭에서 오류 메시지 확인
2. CSV 파일이 `public/converted/` 폴더에 있는지 확인
3. `package.json`과 `package-lock.json`이 있는지 확인

### 사이트가 열리지 않는 경우

1. 배포가 완료되었는지 확인 (Actions 탭)
2. URL이 정확한지 확인
3. 브라우저 캐시 삭제 후 다시 시도

## 📞 문의

문제가 발생하면 교육팀에 문의하세요.

