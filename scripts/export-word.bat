@echo off
chcp 65001 >nul
echo Đang tạo file báo cáo Word (.docx)...
powershell -ExecutionPolicy Bypass -File "%~dp0export-word.ps1"
echo.
pause

