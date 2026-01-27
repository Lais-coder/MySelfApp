@echo off
REM Script de Inicialização - MYF'SP React App
REM Roda em: Windows PowerShell / Command Prompt

echo.
echo ======================================================================
echo   MYF'SP - Projeto Nutricional em React
echo   Script de Inicializacao
echo ======================================================================
echo.

REM Verificar se Node.js está instalado
where node >nul 2>nul
if errorlevel 1 (
    echo.
    echo ERROR: Node.js nao foi encontrado!
    echo.
    echo Baixe e instale Node.js em: https://nodejs.org
    echo Versao minima requerida: v16.0.0
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js encontrado: 
node -v

echo [OK] npm encontrado: 
npm -v

echo.
echo ======================================================================
echo   Instalando dependencias...
echo ======================================================================
echo.

npm install

if errorlevel 1 (
    echo.
    echo ERROR: Falha na instalacao de dependencias!
    echo.
    pause
    exit /b 1
)

echo.
echo ======================================================================
echo   Iniciando servidor de desenvolvimento...
echo ======================================================================
echo.
echo A aplicacao abrira em: http://localhost:3000
echo.
echo Para parar o servidor, pressione: CTRL + C
echo.

npm run dev

pause
