@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul 2>&1

echo ========================================
echo 문제 진단 도구
echo ========================================
echo.

cd /d "%~dp0"

echo [1/6] 현재 위치 확인
echo 위치: %CD%
echo.

echo [2/6] Node.js 설치 확인
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Node.js가 설치되어 있지 않습니다.
    echo      해결: https://nodejs.org 에서 설치
) else (
    node --version
    echo [OK] Node.js 설치됨
)
echo.

echo [3/6] npm 확인
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] npm을 사용할 수 없습니다.
) else (
    npm --version
    echo [OK] npm 사용 가능
)
echo.

echo [4/6] node_modules 확인
if not exist "node_modules" (
    echo [X] node_modules 폴더가 없습니다.
    echo      해결: npm install 실행 필요
) else (
    echo [OK] node_modules 폴더 존재
)
echo.

echo [5/6] CSV 파일 확인
if not exist "public\converted\2025 하반기 재원생 만족도조사 데이터 및 문항속성_챗GPT_데이터.csv" (
    echo [X] 데이터 CSV 파일이 없습니다.
    echo      위치: public\converted\
) else (
    echo [OK] 데이터 CSV 파일 존재
)

if not exist "public\converted\2025 하반기 재원생 만족도조사 데이터 및 문항속성_챗GPT_문항 및 보기.csv" (
    echo [X] 문항 및 보기 CSV 파일이 없습니다.
    echo      위치: public\converted\
) else (
    echo [OK] 문항 및 보기 CSV 파일 존재
)
echo.

echo [6/6] package.json 확인
if not exist "package.json" (
    echo [X] package.json 파일이 없습니다.
) else (
    echo [OK] package.json 파일 존재
)
echo.

echo ========================================
echo 진단 완료
echo ========================================
echo.
pause

