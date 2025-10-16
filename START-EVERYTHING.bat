@echo off
echo ========================================
echo   Starting Assemblers Full Stack App
echo ========================================
echo.

REM Kill any existing processes
echo Stopping any existing API processes...
taskkill /F /IM dotnet.exe 2>nul
timeout /t 2 /nobreak >nul

REM Start API
echo Starting API Server...
cd /d "%~dp0AssemblersApi"
start "Assemblers API" cmd /k "dotnet run --urls http://localhost:5161"

REM Wait for API to start
echo Waiting for API to start (10 seconds)...
timeout /t 10 /nobreak >nul

REM Start Angular
echo Starting Angular Website...
cd /d "%~dp0"
start "Angular App" cmd /k "ng serve --open"

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo API: http://localhost:5161/swagger
echo Website: http://localhost:4200
echo.
echo Press any key to exit this window...
pause >nul
