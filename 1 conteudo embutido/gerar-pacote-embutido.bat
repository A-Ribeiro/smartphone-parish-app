@echo off
chcp 65001 > null

if not exist ..\tools\.gdrive\updatefileurl.txt (
	echo.
	echo ERRO: deve ser configurado o google drive antes de executar esse script
	echo.
	pause
	exit
)

set _7zipEXE=..\tools\7za.exe
echo.
echo *******************************************
echo * Gerar pacote para embutir no Aplicativo *
echo *******************************************
echo.

echo increment zip version
echo.

set /a currentverion=1
:loop
set file2test=builtin\version.%currentverion%
if exist %file2test% (
	set /a currentverion=currentverion+1
	goto loop
)
echo.>%file2test%
echo criando: %file2test%
echo.

echo copiando builtin para "..\3 conteudo online\builtin"...
echo.
rem del /q /s "..\3 conteudo online\builtin"
if exist "..\3 conteudo online\builtin" (
	rmdir /q /s "..\3 conteudo online\builtin" > null
)
xcopy /hiev builtin "..\3 conteudo online\builtin" > null

echo criando: "..\3 conteudo online\content\js\builtinVersion.js"
echo.
echo | set /p="var builtinVersion='builtin/version.%currentverion%';">"..\3 conteudo online\content\js\builtinVersion.js"


set ConstantsFile="..\2 aplicativo android\AndroidStudioProject\app\src\main\java\smartphone\app\Constants.java"
echo criando: %ConstantsFile%
echo.
set /p updatefileurl=<..\tools\.gdrive\updatefileurl.txt
echo package smartphone.app;>%ConstantsFile%
echo public class Constants{>%ConstantsFile%>>%ConstantsFile%
echo 	public static String urlcontentDownload="%updatefileurl%";>>%ConstantsFile%
echo 	public static String builtinVersion="builtin/version.%currentverion%";>>%ConstantsFile%
echo }>>%ConstantsFile%

echo Compressao
echo.
echo content.zip...
echo.
if exist content.zip (
	del content.zip
)
%_7zipEXE% a -tzip -mx9 content.zip content > null

echo builtin.zip...
echo.
if exist builtin.zip (
	del builtin.zip
)
%_7zipEXE% a -tzip -mx9 builtin.zip builtin > null

echo copy files to android project location...
echo.

if not exist "..\2 aplicativo android\AndroidStudioProject\app\src\main\res\raw\" (
	mkdir "..\2 aplicativo android\AndroidStudioProject\app\src\main\res\raw\"
)

del "..\2 aplicativo android\AndroidStudioProject\app\src\main\res\raw\*.zip" >null
move content.zip "..\2 aplicativo android\AndroidStudioProject\app\src\main\res\raw\" >null
move builtin.zip "..\2 aplicativo android\AndroidStudioProject\app\src\main\res\raw\" >null

echo **********************
echo * Processo concluido *
echo **********************

del null

..\tools\app_auto_version_setup.exe android-config.txt "..\2 aplicativo android\AndroidStudioProject\app\build.gradle" "..\2 aplicativo android\AndroidStudioProject\app\src\main\res\values\strings.xml" "..\3 conteudo online\content\js\builtinVersion.js"

cd icon
call update-icon.bat

pause
