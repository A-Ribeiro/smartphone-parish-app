@echo off
chcp 65001 > null

REM Programs Configuration

set GoogleDriveFolderName=AplicativoSmartphone

set _7zipEXE=..\tools\7za.exe
set gdriveEXE=..\tools\gdrive-windows-386.exe

set gdrivekeyfolder=..\tools\.gdrive
set gdriveCmd=%gdriveEXE% --config %gdrivekeyfolder%

set gdrivefoldertoken=..\tools\.gdrive\foldertoken.txt
set gdriveupdatefiletoken=..\tools\.gdrive\updatefiletoken.txt
set gdriveupdatefileurl=..\tools\.gdrive\updatefileurl.txt

echo ***********************************************************
echo * Sera configurado o seu servico do google drive          *
echo ***********************************************************
echo *                                                         *
echo * Se for a primeira vez que voce acessa essa configuracao *
echo * Ira aparecer uma URL que deve ser copiada e             *
echo * colada no navegador para autenticar o software          *
echo *                                                         *
echo ***********************************************************
echo.

%gdriveCmd% about
echo.
echo configurando pasta %GoogleDriveFolderName%


%gdriveCmd% list --query "'root' in parents and name = '%GoogleDriveFolderName%' and mimeType='application/vnd.google-apps.folder'" > output.txt
if NOT %errorlevel% == 0 (
	echo.
	echo ERRO: Nao foi possivel conectar a conta do google drive...
	pause
	exit
)

rem todas as linhas do arquivo
set foldertoken=
FOR /F "tokens=*" %%i IN (output.txt) DO (
	rem echo %%i
	rem todos os primeiros elementos das linhas
	for /f "tokens=1" %%a in ("%%i") do (
		rem echo %%a
		rem AND operator 
		IF NOT "%%a"=="Id" (
		IF NOT "%%a"=="Failed" (
			set foldertoken=%%a
		))
		
	)
)

if "%foldertoken%" == "" (
	echo.
	echo Nao existe
	echo Criando...
	
	%gdriveCmd% mkdir %GoogleDriveFolderName% > output.txt
	if NOT %errorlevel% == 0 (
		echo.
		echo ERRO: Nao foi possivel conectar a conta do google drive...
		pause
		exit
	)
	FOR /F "tokens=*" %%i IN (output.txt) DO (
		for /f "tokens=2,3" %%a in ("%%i") do (
			if "%%b"=="created" (
				set foldertoken=%%a
			)
		)
	)
)

if "%foldertoken%" == "" (
	echo.
	echo Houve um problema para criar a pasta no seu GoogleDrive,
	echo Contate o administrador do sistema.
	pause
	exit
)


echo %foldertoken%> %gdrivefoldertoken%
echo.
echo Token da pasta:
echo.
echo %foldertoken%
echo.

REM search for file in the created folder

%gdriveCmd% list --query "'%foldertoken%' in parents and name='urlcontent.txt'" > output.txt
if NOT %errorlevel% == 0 (
	echo.
	echo ERRO: Nao foi possivel conectar a conta do google drive...
	pause
	exit
)
set updatefiletoken=
FOR /F "tokens=*" %%i IN (output.txt) DO (
	rem echo %%i
	rem todos os primeiros elementos das linhas
	for /f "tokens=1" %%a in ("%%i") do (
		rem echo %%a
		rem AND operator 
		IF NOT "%%a"=="Id" (
		IF NOT "%%a"=="Failed" (
			set updatefiletoken=%%a
		))
		
	)
)

if "%updatefiletoken%" == "" (
	echo criando arquivo de atualizacao...
	echo.
	echo|set /p="">urlcontent.txt
	%gdriveCmd% upload --parent %foldertoken% --share urlcontent.txt > uploadinfo.txt
	if NOT %errorlevel% == 0 (
		echo.
		echo ERRO: Nao foi possivel conectar a conta do google drive...
		pause
		exit
	)
	for /f "tokens=1,2" %%a in (uploadinfo.txt) do (
		IF "%%a"=="Uploaded" (
			set updatefiletoken=%%b
		)
	)
)

if "%updatefiletoken%" == "" (
	echo ERROR
	pause
	exit
)

echo %updatefiletoken%>%gdriveupdatefiletoken%
echo https://drive.google.com/uc?id=%updatefiletoken%^&export=download>%gdriveupdatefileurl%

echo Token do arquivo:
echo.
echo %updatefiletoken%
echo.
echo URL:
echo.
type %gdriveupdatefileurl%
echo.


echo **********************
echo * Processo concluido *
echo **********************

del output.txt 2> null
del uploadinfo.txt 2> null
del urlcontent.txt 2> null
del null

pause

