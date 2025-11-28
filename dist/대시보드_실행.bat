@echo off
chcp 65001 >nul
title 만족도 조사 대시보드

REM 현재 폴더로 이동
cd /d "%~dp0"

REM Python 확인
python --version >nul 2>&1
if errorlevel 1 (
    REM Python이 없으면 Node.js 확인
    node --version >nul 2>&1
    if errorlevel 1 (
        REM 둘 다 없으면 브라우저로 직접 열기 시도
        echo 브라우저를 열고 있습니다...
        if exist "%~dp0index.html" (
            start "" "%~dp0index.html"
        ) else (
            echo 오류: index.html 파일을 찾을 수 없습니다.
            pause
            exit /b 1
        )
        timeout /t 3 >nul
        echo.
        echo ========================================
        echo 주의: 일부 기능이 제한될 수 있습니다
        echo ========================================
        echo.
        echo 데이터가 표시되지 않으면:
        echo 1. Python 설치: https://www.python.org/downloads/
        echo 2. 또는 교육팀에 문의하세요
        echo.
        pause
        exit /b 0
    ) else (
        REM Node.js가 있으면 serve 사용
        echo ========================================
        echo 만족도 조사 대시보드
        echo ========================================
        echo.
        echo 서버를 시작합니다...
        echo.
        REM 브라우저 자동 열기 (3초 후, PowerShell 사용)
        start "" powershell -Command "Start-Sleep -Seconds 3; Start-Process 'http://localhost:3000'"
        echo.
        echo 브라우저가 자동으로 열립니다.
        echo 만약 브라우저가 열리지 않으면:
        echo 브라우저에서 http://localhost:3000 을 입력하세요
        echo.
        echo 서버를 종료하려면 이 창을 닫으세요.
        echo.
        REM 서버 실행 (포그라운드)
        npx --yes serve -s . -l 3000
        exit /b 0
    )
) else (
    REM Python이 있으면 Python 서버 사용
    echo ========================================
    echo 만족도 조사 대시보드
    echo ========================================
    echo.
    echo 서버를 시작합니다...
    echo.
    REM 브라우저 자동 열기 (3초 후, PowerShell 사용)
    start "" powershell -Command "Start-Sleep -Seconds 3; Start-Process 'http://localhost:8000'"
    echo.
    echo 브라우저가 자동으로 열립니다.
    echo 만약 브라우저가 열리지 않으면:
    echo 브라우저에서 http://localhost:8000 을 입력하세요
    echo.
    echo 서버를 종료하려면 이 창을 닫으세요.
    echo.
    REM 서버 실행 (포그라운드)
    python -m http.server 8000
    exit /b 0
)
