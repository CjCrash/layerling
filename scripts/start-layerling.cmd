@echo off
rem Starts layerling from this checkout: updates it first (when it is a git copy without
rem local changes), starts the server in its own window, waits until the server answers,
rem and only then opens the browser. Works from any folder - it finds the checkout itself.
setlocal
cd /d "%~dp0.."
title layerling

if not exist ".git" goto start
where git >nul 2>nul
if errorlevel 1 goto start

set DIRTY=
for /f "delims=" %%i in ('git status --porcelain') do set DIRTY=1
if defined DIRTY (
  echo There are local changes in this folder, so the update was skipped.
  goto start
)

echo Checking for updates...
for /f %%i in ('git rev-parse HEAD') do set BEFORE=%%i
git pull --ff-only --quiet
if errorlevel 1 (
  echo The update could not be fetched - continuing with the version that is already here.
  goto start
)
for /f %%i in ('git rev-parse HEAD') do set AFTER=%%i
if not "%BEFORE%"=="%AFTER%" (
  echo layerling was updated. Installing dependencies...
  call npm install
)

:start
start "layerling server" cmd /k "npm run dev"
echo Waiting for the server to come up...
powershell -NoProfile -Command "for ($i = 0; $i -lt 90; $i++) { try { (New-Object Net.Sockets.TcpClient('127.0.0.1', 3000)).Close(); exit 0 } catch { Start-Sleep -Seconds 1 } }; exit 1"
if errorlevel 1 (
  echo.
  echo layerling did not start within 90 seconds. Check the "layerling server" window for errors.
  pause
  exit /b 1
)
start "" "http://127.0.0.1:3000/"
exit /b 0
