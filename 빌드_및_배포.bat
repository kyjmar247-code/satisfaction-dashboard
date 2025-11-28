@echo off
chcp 65001 >nul
echo ========================================
echo 대시보드 빌드 및 배포 준비
echo ========================================
echo.

echo [1/3] 의존성 설치 중...
call npm install
if errorlevel 1 (
    echo 오류: npm install 실패
    pause
    exit /b 1
)

echo.
echo [2/3] 프로젝트 빌드 중...
call npm run build
if errorlevel 1 (
    echo 오류: 빌드 실패
    pause
    exit /b 1
)

echo.
echo [3/3] CSV 파일 복사 중...
if not exist "dist\converted" mkdir "dist\converted"
copy /Y "public\converted\*.csv" "dist\converted\" >nul
if errorlevel 1 (
    echo 경고: CSV 파일 복사 실패 (수동으로 복사해주세요)
) else (
    echo CSV 파일 복사 완료
)

echo.
echo ========================================
echo 빌드 완료!
echo ========================================
echo.
echo 배포 폴더: dist\
echo.
echo ========================================
echo 사업팀 전달 방법
echo ========================================
echo.
echo 1. dist 폴더 전체를 사업팀에 전달하세요
echo    - 폴더를 그대로 전달하거나
echo    - ZIP 파일로 압축하여 전달
echo.
echo 2. 전달 전 확인사항:
echo    - dist\converted\ 폴더에 CSV 파일 2개 있는지 확인
echo    - dist\대시보드_실행.bat 파일 있는지 확인
echo.
echo 3. 사업팀 사용 방법:
echo    - dist 폴더에서 "대시보드_실행.bat" 더블클릭
echo    - 브라우저에서 http://localhost:8000 접속
echo.
echo 자세한 내용은 "사업팀_전달_가이드.md" 파일을 참고하세요.
echo.
pause

