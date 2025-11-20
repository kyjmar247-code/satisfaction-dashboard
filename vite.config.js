import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { copyFileSync, mkdirSync, existsSync, writeFileSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'copy-files',
      closeBundle() {
        // 빌드 후 CSV 파일 복사
        try {
          const distConverted = resolve(__dirname, 'dist/converted')
          mkdirSync(distConverted, { recursive: true })
          
          const csv1 = resolve(__dirname, 'public/converted/2025 하반기 재원생 만족도조사 데이터 및 문항속성_챗GPT_데이터.csv')
          const csv2 = resolve(__dirname, 'public/converted/2025 하반기 재원생 만족도조사 데이터 및 문항속성_챗GPT_문항 및 보기.csv')
          
          if (existsSync(csv1)) {
            copyFileSync(csv1, resolve(distConverted, '2025 하반기 재원생 만족도조사 데이터 및 문항속성_챗GPT_데이터.csv'))
          }
          if (existsSync(csv2)) {
            copyFileSync(csv2, resolve(distConverted, '2025 하반기 재원생 만족도조사 데이터 및 문항속성_챗GPT_문항 및 보기.csv'))
          }
          
          // 실행 배치 파일 생성
          const batchFile = resolve(__dirname, 'dist/대시보드_실행.bat')
          const batchContent = `@echo off
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
        start "" "%~dp0index.html"
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
        echo 서버를 시작합니다...
        echo 브라우저가 자동으로 열립니다...
        echo.
        echo 서버를 종료하려면 이 창을 닫으세요.
        echo.
        timeout /t 1 >nul
        start "" "http://localhost:3000"
        timeout /t 2 >nul
        npx --yes serve -s . -l 3000
        exit /b 0
    )
) else (
    REM Python이 있으면 Python 서버 사용
    echo 서버를 시작합니다...
    echo 브라우저가 자동으로 열립니다...
    echo.
    echo 서버를 종료하려면 이 창을 닫으세요.
    echo.
    timeout /t 1 >nul
    start "" "http://localhost:8000"
    timeout /t 2 >nul
    python -m http.server 8000
    exit /b 0
)
`
          writeFileSync(batchFile, batchContent, 'utf8')
        } catch (error) {
          console.warn('파일 복사 실패:', error.message)
        }
      }
    }
  ],
  server: {
    port: 3000,
    open: '/',
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  },
  base: process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` : '/'
})

