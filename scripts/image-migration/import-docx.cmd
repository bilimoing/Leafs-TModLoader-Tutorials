@echo off
setlocal
cd /d "%~dp0..\.."
if "%~1"=="" (
  node scripts\image-migration\import-docx.cjs "C:\Users\32387\Downloads"
) else (
  node scripts\image-migration\import-docx.cjs "%~1" %2 %3 %4
)
if errorlevel 1 pause
endlocal
