@echo off
echo Starting Full Stack Application...
echo.

REM Kill any existing processes
taskkill /f /im "AssemblersApi.exe" 2>nul
taskkill /f /im "dotnet.exe" 2>nul
taskkill /f /im "ng.exe" 2>nul

REM Wait a moment
timeout /t 2 /nobreak >nul

echo Starting API...
start "Assemblers API" cmd /k "cd /d %~dp0AssemblersApi && dotnet run --urls http://localhost:5161"

REM Wait for API to start
echo Waiting for API to start...
timeout /t 10 /nobreak >nul

echo Starting Angular...
start "Angular App" cmd /k "cd /d %~dp0 && ng serve --open"

echo.
echo Both servers are starting...
echo API: http://localhost:5161/swagger
echo Angular: http://localhost:4200
echo.
echo Press any key to close this window (servers will continue running)
pause >nul
