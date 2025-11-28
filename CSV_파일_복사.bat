@echo off
chcp 65001 >nul
echo ========================================
echo CSV 파일 복사 스크립트
echo ========================================
echo.

REM 현재 스크립트 위치로 이동
cd /d "%~dp0"

REM converted 폴더 확인
if not exist "..\converted" (
    echo [오류] 상위 폴더에 converted 폴더를 찾을 수 없습니다.
    pause
    exit /b 1
)

REM public\converted 폴더 생성
if not exist "public\converted" (
    mkdir "public\converted"
    echo public\converted 폴더를 생성했습니다.
)

REM CSV 파일 복사
echo CSV 파일 복사 중...
echo.

if exist "..\converted\2025 하반기 재원생 만족도조사 데이터 및 문항속성_챗GPT_데이터.csv" (
    copy "..\converted\2025 하반기 재원생 만족도조사 데이터 및 문항속성_챗GPT_데이터.csv" "public\converted\" >nul
    echo [완료] 데이터 CSV 파일 복사됨
) else (
    echo [오류] 데이터 CSV 파일을 찾을 수 없습니다.
)

if exist "..\converted\2025 하반기 재원생 만족도조사 데이터 및 문항속성_챗GPT_문항 및 보기.csv" (
    copy "..\converted\2025 하반기 재원생 만족도조사 데이터 및 문항속성_챗GPT_문항 및 보기.csv" "public\converted\" >nul
    echo [완료] 문항 및 보기 CSV 파일 복사됨
) else (
    echo [오류] 문항 및 보기 CSV 파일을 찾을 수 없습니다.
)

echo.
echo ========================================
echo 복사 완료!
echo.
echo 다음 단계: 빠른_시작.bat 실행
echo ========================================
echo.
pause

