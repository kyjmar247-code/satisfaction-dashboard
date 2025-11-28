@echo off
setlocal enabledelayedexpansion

REM 간단한 서버 시작 스크립트
chcp 65001 >nul 2>&1

echo ========================================
echo 서버 시작
echo ========================================
echo.

cd /d "%~dp0"

REM Node.js 확인
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [오류] Node.js가 설치되어 있지 않습니다.
    echo https://nodejs.org 에서 설치해주세요.
    echo.
    pause
    exit /b 1
)

REM node_modules 확인
if not exist "node_modules" (
    echo 의존성 설치 중... (처음 실행 시 약 1-2분 소요)
    call npm install
    if %errorlevel% neq 0 (
        echo [오류] 의존성 설치 실패
        pause
        exit /b 1
    )
)

echo.
echo 서버를 시작합니다...
echo 브라우저에서 http://localhost:3000 접속
echo 서버 중지: Ctrl+C
echo.
echo ========================================
echo.

REM 브라우저 자동 열기 (5초 후)
start "" cmd /c "timeout /t 5 /nobreak >nul && start http://localhost:3000" 2>nul

npm run dev

pause

