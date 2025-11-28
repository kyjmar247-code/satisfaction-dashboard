@echo off
chcp 65001 >nul
echo 브라우저를 여는 중...
timeout /t 2 /nobreak >nul
start http://localhost:3000
echo 브라우저가 열렸습니다.
timeout /t 2 /nobreak >nul

