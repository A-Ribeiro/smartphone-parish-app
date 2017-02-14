@echo off
setlocal EnableDelayedExpansion
chcp 65001 > null

set _7zipEXE=..\..\..\..\tools\7za.exe

if exist repertorios (
	rmdir /q /s repertorios > null
)

del null

mkdir repertorios

%_7zipEXE% x site.zip -o"repertorios/"
%_7zipEXE% x "repertorios/_3rdparty/html2pdf.zip" -o"repertorios/"

rem ***********************************************************************************************
rem * OBS: como o sistema foi instalado local, nao e' necessario descompactar a biblioteca google *
rem ***********************************************************************************************
rem %_7zipEXE% x "repertorios/_3rdparty/google-api-php-client-2.1.1.zip" -o"repertorios/"

cls

echo.
echo PRONTO
echo.

pause

explorer "repertorios\"
