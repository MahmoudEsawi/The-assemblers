@echo off
echo Starting Angular Development Server...
echo.

REM Navigate to Angular project directory
cd /d "%~dp0"

REM Check if we're in the right directory
if not exist "package.json" (
    echo ERROR: Cannot find package.json
    echo Please run this script from the Angular project directory
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install --legacy-peer-deps
)

echo.
echo Starting Angular on http://localhost:4200
echo.
echo Press Ctrl+C to stop Angular
echo.

ng serve --open

pause
