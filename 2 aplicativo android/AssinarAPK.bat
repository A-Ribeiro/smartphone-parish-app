@echo off
chcp 65001 > null

WHERE zipalign.exe 2> null
IF %ERRORLEVEL% NEQ 0 goto end

if exist "AndroidStudioProject\app\build\outputs\apk\app-release-aligned.apk" (
	del "AndroidStudioProject\app\build\outputs\apk\app-release-aligned.apk"
)
zipalign.exe -v 4 "AndroidStudioProject\app\build\outputs\apk\app-release-unaligned.apk" "AndroidStudioProject\app\build\outputs\apk\app-release-aligned.apk"

explorer ".\AndroidStudioProject\app\build\outputs\apk"

goto eof

:end
echo.
echo.
echo ERROR: Voce precisa configurar o path onde se encontra o zipalign.exe
echo.
echo.
pause

:eof

del null