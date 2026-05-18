@echo off
REM MyShelf - Setup and Run Commands for Windows

echo.
echo ====================================
echo MyShelf - Personal E-Library Setup
echo ====================================
echo.

REM Check if npm is installed
where npm >nul 2>nul
if errorlevel 1 (
    echo ERROR: npm is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

echo [1/3] Installing dependencies...
echo.
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    exit /b 1
)

echo.
echo ====================================
echo Installation Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Create Supabase project at https://supabase.com
echo 2. Copy VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from Supabase
echo 3. Edit .env and add your credentials
echo 4. Run SUPABASE_SETUP.sql in Supabase SQL Editor
echo 5. Create "covers" storage bucket (PUBLIC) in Supabase
echo.
echo To start the dev server, run:
echo   npm run dev
echo.
echo To build for production, run:
echo   npm run build
echo.
pause
