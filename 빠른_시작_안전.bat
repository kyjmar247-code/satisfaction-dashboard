@echo off
setlocal enabledelayedexpansion

REM 한글 인코딩
chcp 65001 >nul 2>&1

title 2025 하반기 만족도 조사 대시보드

echo ========================================
echo 2025 하반기 만족도 조사 대시보드
echo ========================================
echo.

REM 현재 위치로 이동
cd /d "%~dp0"
echo 현재 위치: %CD%
echo.

REM Node.js 확인
echo [1단계] Node.js 확인...
node --version >nul 2>&1
if errorlevel 1 (
    echo [오류] Node.js가 설치되어 있지 않습니다.
    echo.
    echo 해결 방법:
    echo 1. https://nodejs.org 접속
    echo 2. LTS 버전 다운로드 및 설치
    echo 3. 컴퓨터 재시작 후 다시 실행
    echo.
    pause
    exit /b 1
)

node --version
npm --version
echo [OK] Node.js 확인 완료
echo.

REM CSV 파일 확인 (간단하게)
echo [2단계] CSV 파일 확인...
if exist "public\converted\*.csv" (
    echo [OK] CSV 파일 확인됨
) else (
    echo [경고] CSV 파일을 찾을 수 없습니다.
    echo CSV_파일_복사.bat를 실행하거나 수동으로 복사하세요.
    echo 계속 진행합니다...
)
echo.

REM node_modules 확인
echo [3단계] 의존성 확인...
if not exist "node_modules" (
    echo node_modules 폴더가 없습니다. 설치를 시작합니다...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [오류] 의존성 설치 실패
        echo.
        pause
        exit /b 1
    )
    echo.
    echo [OK] 의존성 설치 완료
) else (
    echo [OK] 의존성 이미 설치됨
)
echo.

REM 서버 시작
echo [4단계] 서버 시작...
echo.
echo ========================================
echo 서버 안내
echo ========================================
echo 서버 주소: http://localhost:3000
echo.
echo 서버가 시작되면 브라우저에서 자동으로 열립니다.
echo 서버를 중지하려면 Ctrl+C를 누르세요.
echo.
echo ========================================
echo.

REM 브라우저 자동 열기 (5초 후)
start "" cmd /c "timeout /t 5 /nobreak >nul && start http://localhost:3000" 2>nul

REM 서버 시작
call npm run dev

REM 서버 종료 후
echo.
echo 서버가 종료되었습니다.
pause

