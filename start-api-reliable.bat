@echo off
echo Starting Assemblers API...
echo.

REM Kill any existing API processes
taskkill /f /im "AssemblersApi.exe" 2>nul
taskkill /f /im "dotnet.exe" 2>nul

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Navigate to API directory
cd /d "%~dp0AssemblersApi"

REM Check if we're in the right directory
if not exist "AssemblersApi.csproj" (
    echo ERROR: Cannot find AssemblersApi.csproj
    echo Please run this script from the main project directory
    pause
    exit /b 1
)

echo Building API...
dotnet build

if %ERRORLEVEL% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo Starting API on http://localhost:5161
echo Swagger UI will be available at: http://localhost:5161/swagger
echo.
echo Press Ctrl+C to stop the API
echo.

dotnet run --urls "http://localhost:5161"

pause
