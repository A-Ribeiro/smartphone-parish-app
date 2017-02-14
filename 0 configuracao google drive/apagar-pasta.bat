@echo off
chcp 65001 > null

set _7zipEXE=..\tools\7za.exe
set gdriveEXE=..\tools\gdrive-windows-386.exe

set gdrivekeyfolder=..\tools\.gdrive
set gdriveCmd=%gdriveEXE% --config %gdrivekeyfolder%

set /p foldertoken=<..\tools\.gdrive\foldertoken.txt
set /p updatefiletoken=<..\tools\.gdrive\updatefiletoken.txt

if "%foldertoken%"=="" (
	exit
)

echo ************************************
echo *            Atencao!!             *
echo ************************************
echo *                                  *
echo * Essa operacao ira apagar a pasta *
echo * com o conteúdo do aplicativo.    *
echo *                                  *
echo ************************************

pause

%gdriveCmd% delete --recursive %foldertoken% >null

echo |set /p="">..\tools\.gdrive\foldertoken.txt
echo |set /p="">..\tools\.gdrive\updatefiletoken.txt

del null

echo **********************
echo * Processo concluido *
echo **********************
pause

