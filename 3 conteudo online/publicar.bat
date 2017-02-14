@echo off
chcp 65001 > null

set _7zipEXE=..\tools\7za.exe
set gdriveEXE=..\tools\gdrive-windows-386.exe

set gdrivekeyfolder=..\tools\.gdrive
set gdriveCmd=%gdriveEXE% --config %gdrivekeyfolder%

if not exist ..\tools\.gdrive\foldertoken.txt (
	echo ERRO: E necessario configurar o google drive antes de executar o programa
	pause
	exit
)
if not exist ..\tools\.gdrive\updatefiletoken.txt (
	echo ERRO: E necessario configurar o google drive antes de executar o programa
	pause
	exit
)

set /p foldertoken=<..\tools\.gdrive\foldertoken.txt
set /p updatefiletoken=<..\tools\.gdrive\updatefiletoken.txt

for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /format:list') do set datetime=%%I
REM datetime in the format: 2017-01-18_23h19m19s
set datetime=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%_%datetime:~8,2%h%datetime:~10,2%m%datetime:~12,2%s
set zipfile=content%datetime%.zip


echo ***************************************************
echo *  Publicacao de conteudo online no GoogleDrive   *
echo ***************************************************
echo *                                                 *
echo * Os arquivos da pasta content serao compactados  *
echo * e enviados para a pasta no Google Drive.        *
echo *                                                 *
echo ***************************************************
echo.

echo Folder token:
echo.
echo %foldertoken%
echo.
echo Update file token:
echo.
echo %updatefiletoken%
echo.
echo criando %zipfile% ...
echo.

%_7zipEXE% a -tzip -mx9 %zipfile% content > null

echo subindo...
echo.

%gdriveCmd% upload --parent %foldertoken% --share %zipfile% > uploadinfo.txt
if NOT %errorlevel% == 0 (
	echo.
	echo ERRO: Nao foi possivel realizar conexao...
	pause
	exit
)

set uploadedfiletoken=
for /f "tokens=1,2" %%a in (uploadinfo.txt) do (
	IF "%%a"=="Uploaded" (
		set uploadedfiletoken=%%b
	)
)

if "%uploadedfiletoken%" == "" (
	echo ERRO... upload nao detectado corretamente...
	echo.
	pause
	exit
)

echo | set /p="https://drive.google.com/uc?id=%uploadedfiletoken%&export=download">urlcontent.txt

echo URL:
echo.
type urlcontent.txt
echo.
echo.
echo atualizando urlcontent.txt
echo.
%gdriveCmd% update %updatefiletoken% urlcontent.txt > updateinfo.txt
if NOT %errorlevel% == 0 (
	echo.
	echo ERRO: Nao foi possivel realizar conexao...
	pause
	exit
)

echo **********************
echo * Processo concluido *
echo **********************

del uploadinfo.txt
del urlcontent.txt
del updateinfo.txt
rem del %zipfile%
del content*.zip
del null

pause