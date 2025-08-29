@echo off
title Minecraft Bot Spawner
color 0A
cls

echo ==========================================
echo      Minecraft Bot Spawner (test.js)
echo ==========================================

:: Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Download it from: https://nodejs.org/
    pause
    exit /b
)

echo [OK] Node.js found.

:: Check for test.js file
if not exist test.js (
    echo [ERROR] test.js not found in current folder: %CD%
    pause
    exit /b
)

echo [OK] test.js found.

:: Install dependencies silently
echo [INFO] Installing required packages (if not already installed)...
call npm install mineflayer mineflayer-pathfinder minecraft-data >nul 2>&1

:: Run the bot spawner script
echo [INFO] Launching bot spawner...
echo.
node --no-warnings test.js

:: Wait for user before closing
echo.
echo [DONE] Script finished. Press any key to close.
pause >nul
