@echo off
chcp 65001 >nul
echo ====================================================================
echo        DANG DAY TOAN BO DU AN LEN GITHUB (Trien-Khai-KTHP)
echo ====================================================================
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo [THANH CONG] Du an da duoc day len GitHub thanh cong!
) else (
    echo [LUU Y] Neu gap loi "Repository not found", ban chi can vao link:
    echo         https://github.com/new
    echo         Dat ten Repository name la: Trien-Khai-KTHP
    echo         Sau do chay lai file nay la thanh cong 100%!
)
echo.
pause
