@echo off
set USER=root
set PASSWORD=ShubhAm@230614
set DATABASE=bulls_trading
set HOST=localhost
set SQLFILE=check_mysql_status.sql

echo.
echo Running MySQL status check...
echo.

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u %USER% -p%PASSWORD% -h %HOST% %DATABASE% < %SQLFILE%

echo.
echo Done. Press any key to exit.
pause >nul
