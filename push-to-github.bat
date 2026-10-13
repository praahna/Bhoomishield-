@echo off
set "PATH=C:\Users\praahna\MinGit\cmd;C:\Users\praahna\MinGit\ucrt64\bin;%PATH%"
cd /d "%~dp0"
echo ========================================================
echo   Pushing BhoomiShield to GitHub
echo   Repository: https://github.com/praahna/Bhoomishield-
echo ========================================================
echo.
git push -u origin main
echo.
pause
