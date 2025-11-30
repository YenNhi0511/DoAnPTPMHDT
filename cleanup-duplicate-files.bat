@echo off
chcp 65001 >nul
echo ============================================================
echo    GOODCV - CLEANUP DUPLICATE FILES
echo ============================================================
echo.

echo ⚠️  Script nay se xoa cac file trung lap/debug
echo.
echo Danh sach file se xoa:
echo.

:: Backend - Email Documentation (18 files)
echo [Backend] Email Documentation (18 files):
echo   - DEBUG-EMAIL*.md
echo   - EMAIL-*.md (trung lap)
echo   - SUA-LOI-EMAIL-*.md (da sua xong)
echo   - TONG-KET-EMAIL-*.md
echo.

:: Backend - Other Debug Files (4 files)
echo [Backend] Other Debug Files (4 files):
echo   - SUA-LOI-404-VERIFICATION.md
echo   - SUA-LOI-DANG-KY-*.md
echo   - SUA-LOI-KHONG-DANG-KY-*.md
echo   - SUA-LOI-USER-*.md
echo.

:: Root - Duplicate Scripts (6 files)
echo [Root] Duplicate Scripts (6 files):
echo   - start-all.bat
echo   - start-all-roles.bat
echo   - start-simple.bat
echo   - start-minimal.bat
echo   - setup-backend.bat
echo   - setup-frontend.bat
echo.

:: Root - Duplicate Documentation (3 files)
echo [Root] Duplicate Documentation (3 files):
echo   - "Huong dan setup"
echo   - CHAY-1-PORT-3-ROLES.md
echo   - HUONG-DAN-1-PORT.md
echo.

echo ============================================================
echo Tong cong: ~31 files
echo ============================================================
echo.

set /p confirm="Ban co muon xoa cac file nay? (y/n): "
if /i not "%confirm%"=="y" (
    echo Khong xoa file.
    pause
    exit /b 0
)

echo.
echo Dang xoa file...
echo.

:: Backend - Email Documentation
cd backend
if exist "DEBUG-EMAIL.md" del "DEBUG-EMAIL.md" && echo   Xoa: DEBUG-EMAIL.md
if exist "DEBUG-EMAIL-KHONG-NHAN-DUOC.md" del "DEBUG-EMAIL-KHONG-NHAN-DUOC.md" && echo   Xoa: DEBUG-EMAIL-KHONG-NHAN-DUOC.md
if exist "DEBUG-EMAIL-PLUS-ADDRESSING.md" del "DEBUG-EMAIL-PLUS-ADDRESSING.md" && echo   Xoa: DEBUG-EMAIL-PLUS-ADDRESSING.md
if exist "DEBUG-EMAIL-SUDDENLY-STOP.md" del "DEBUG-EMAIL-SUDDENLY-STOP.md" && echo   Xoa: DEBUG-EMAIL-SUDDENLY-STOP.md
if exist "DEBUG-EMAIL-VERIFICATION.md" del "DEBUG-EMAIL-VERIFICATION.md" && echo   Xoa: DEBUG-EMAIL-VERIFICATION.md
if exist "DEBUG-EMAIL-WEB-REGISTRATION.md" del "DEBUG-EMAIL-WEB-REGISTRATION.md" && echo   Xoa: DEBUG-EMAIL-WEB-REGISTRATION.md
if exist "EMAIL-PLUS-ADDRESSING-GUIDE.md" del "EMAIL-PLUS-ADDRESSING-GUIDE.md" && echo   Xoa: EMAIL-PLUS-ADDRESSING-GUIDE.md
if exist "EMAIL-SETUP-GUIDE.md" del "EMAIL-SETUP-GUIDE.md" && echo   Xoa: EMAIL-SETUP-GUIDE.md
if exist "EMAIL-VERIFICATION-RULES.md" del "EMAIL-VERIFICATION-RULES.md" && echo   Xoa: EMAIL-VERIFICATION-RULES.md
if exist "HUONG-DAN-GUI-EMAIL-THAT.md" del "HUONG-DAN-GUI-EMAIL-THAT.md" && echo   Xoa: HUONG-DAN-GUI-EMAIL-THAT.md
if exist "KHONG-NHAN-DUOC-EMAIL.md" del "KHONG-NHAN-DUOC-EMAIL.md" && echo   Xoa: KHONG-NHAN-DUOC-EMAIL.md
if exist "SUA-EMAIL-WEB-VS-TERMINAL.md" del "SUA-EMAIL-WEB-VS-TERMINAL.md" && echo   Xoa: SUA-EMAIL-WEB-VS-TERMINAL.md
if exist "SUA-LOI-404-VERIFY-EMAIL.md" del "SUA-LOI-404-VERIFY-EMAIL.md" && echo   Xoa: SUA-LOI-404-VERIFY-EMAIL.md
if exist "SUA-LOI-EMAIL-AUTH.md" del "SUA-LOI-EMAIL-AUTH.md" && echo   Xoa: SUA-LOI-EMAIL-AUTH.md
if exist "SUA-LOI-EMAIL-NOT-FOUND.md" del "SUA-LOI-EMAIL-NOT-FOUND.md" && echo   Xoa: SUA-LOI-EMAIL-NOT-FOUND.md
if exist "TOM-TAT-CAU-HINH-EMAIL.md" del "TOM-TAT-CAU-HINH-EMAIL.md" && echo   Xoa: TOM-TAT-CAU-HINH-EMAIL.md
if exist "TONG-KET-EMAIL-VERIFICATION.md" del "TONG-KET-EMAIL-VERIFICATION.md" && echo   Xoa: TONG-KET-EMAIL-VERIFICATION.md
if exist "TONG-KET-SUA-EMAIL-VERIFICATION.md" del "TONG-KET-SUA-EMAIL-VERIFICATION.md" && echo   Xoa: TONG-KET-SUA-EMAIL-VERIFICATION.md

:: Backend - Other Debug Files
if exist "SUA-LOI-404-VERIFICATION.md" del "SUA-LOI-404-VERIFICATION.md" && echo   Xoa: SUA-LOI-404-VERIFICATION.md
if exist "SUA-LOI-DANG-KY-EMAIL-TON-TAI.md" del "SUA-LOI-DANG-KY-EMAIL-TON-TAI.md" && echo   Xoa: SUA-LOI-DANG-KY-EMAIL-TON-TAI.md
if exist "SUA-LOI-KHONG-DANG-KY-DUOC.md" del "SUA-LOI-KHONG-DANG-KY-DUOC.md" && echo   Xoa: SUA-LOI-KHONG-DANG-KY-DUOC.md
if exist "SUA-LOI-USER-DA-LUU-NHUNG-EMAIL-KHONG-GUI.md" del "SUA-LOI-USER-DA-LUU-NHUNG-EMAIL-KHONG-GUI.md" && echo   Xoa: SUA-LOI-USER-DA-LUU-NHUNG-EMAIL-KHONG-GUI.md

cd ..

:: Root - Duplicate Scripts
if exist "start-all.bat" del "start-all.bat" && echo   Xoa: start-all.bat
if exist "start-all-roles.bat" del "start-all-roles.bat" && echo   Xoa: start-all-roles.bat
if exist "start-simple.bat" del "start-simple.bat" && echo   Xoa: start-simple.bat
if exist "start-minimal.bat" del "start-minimal.bat" && echo   Xoa: start-minimal.bat
if exist "setup-backend.bat" del "setup-backend.bat" && echo   Xoa: setup-backend.bat
if exist "setup-frontend.bat" del "setup-frontend.bat" && echo   Xoa: setup-frontend.bat

:: Root - Duplicate Documentation
if exist "Hướng dẫn setup" del "Hướng dẫn setup" && echo   Xoa: "Hướng dẫn setup"
if exist "CHAY-1-PORT-3-ROLES.md" del "CHAY-1-PORT-3-ROLES.md" && echo   Xoa: CHAY-1-PORT-3-ROLES.md
if exist "HUONG-DAN-1-PORT.md" del "HUONG-DAN-1-PORT.md" && echo   Xoa: HUONG-DAN-1-PORT.md

echo.
echo ============================================================
echo ✅ Da xoa xong cac file trung lap!
echo ============================================================
echo.
pause

