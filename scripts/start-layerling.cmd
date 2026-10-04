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

rem Only changed tracked files hold an update back. Files of your own in this
rem folder do not, and neither does package-lock.json: npm rewrites it when its
rem version differs from ours, so it is put back before updating.
set DIRTY=
for /f "delims=" %%i in ('git status --porcelain --untracked-files^=no ^| findstr /v /e /c:"package-lock.json"') do set DIRTY=1
if defined DIRTY (
  echo These files were changed in this folder, so the update was skipped:
  git status --short --untracked-files=no
  echo To drop those changes and update anyway, run "git stash" in this folder and start layerling again.
  goto start
)
git checkout -- package-lock.json 2>nul

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
  call npm install --no-save
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
