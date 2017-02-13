@echo off
setlocal EnableDelayedExpansion
chcp 65001 > null

set _7zipEXE=..\..\..\tools\7za.exe

cd public_html
if exist ..\upload\site.zip (
	del ..\upload\site.zip
)

echo **************************************************
echo * Configurando Site PHP - Musicas e Repertorios  *
echo **************************************************
echo *                                                *
echo * Voce deve digitar todas as informacoes abaixo  *
echo * para que o site seja configurado adequadamente *
echo *                                                *
echo **************************************************
echo.
pause

cls
echo *******************
echo * Banco de dados  *
echo *******************
echo.
echo O plugin de edicao de repertorio e musica pode 
echo ser instalado no servidor utilizando o banco de 
echo dados MySql ou Sqlite.
echo.
echo Ambas as formas irao funcionar.
echo.
echo E' recomentado utilizar Sqlite por nao precisar
echo configurar usuario e banco no servidor.
echo.


set opt=
CHOICE /C MS /N /M "Deseja usar [M]ySql ou [S]qlite? "
IF ERRORLEVEL 1 set opt=MySql
IF ERRORLEVEL 2 set opt=Sqlite

echo ^<^?php>config.php

if "%opt%" == "MySql" (
	echo $USE_MYSQL=true;>>config.php
	cls
	echo *******************
	echo * Banco de dados  *
	echo *******************
	echo.
	echo MySql
	echo.
	echo E' necessario criar um banco de dados vazio para
	echo que o sistema construa as tabelas necessarias para
	echo seu funcionamento.
	echo.
	echo Entre com as configuracoes do MySql:
	echo.
	set /P host=host:
	echo $MYSQL_HOST="!host!";>>config.php

	set /P dbname=dbname:
	echo $MYSQL_DBNAME="!dbname!";>>config.php

	set /P dbuser=user:
	echo $MYSQL_DBUSER="!dbuser!";>>config.php

	set /P dbpasswd=password:
	echo $MYSQL_DBPASSWD="!dbpasswd!";>>config.php
	echo.
	echo Configurado!
	echo.
)

if "%opt%" == "Sqlite" (
	echo $USE_MYSQL=false;>>config.php
	cls
	echo *******************
	echo * Banco de dados  *
	echo *******************
	echo.
	echo Sqlite
	echo.
	echo Configurado!
	echo.
)

pause
cls
echo *********************
echo * Sistema de login  *
echo *********************
echo.
echo Esse plugin utiliza o sistema de login do Google.
echo.
echo Para configurar o servidor e' necessario entrar no site:
echo.
echo https://console.developers.google.com/
echo.
echo   1) Criar um projeto
echo.
echo   2) No menu credenciais:
echo        -^> Criar 'ID do cliente OAuth'
echo        -^> Marcar 'Aplicativo da Web'
echo        -^> preencher os enderecos do site em
echo          'Origens JavaScript autorizadas'
echo           Exemplo:
echo               http://meu-site.com
echo               https://meu-site.com
echo.
echo   3) Ao final, copiar o ID do Cliente para preencher
echo      a proxima etapa da configuracao
echo.
set /P googleClientID=Entre com o seu Google Client ID(...apps.googleusercontent.com):
echo $GOOGLE_CLIENT_ID="%googleClientID%";>>config.php
echo var googleClientID="%googleClientID%";>config.js
echo.

if "%googleClientID%" == "" (
	cls
	echo.
	echo OBS.: Nenhum client ID digitado.
	echo.
	echo O sistema de login do Google estará desligado.
	echo.
	echo Nao e' recomendado utilizar essa instalacao em um servidor online.
	echo.
	pause
	
	echo $email_permission_to_write ^= [ "local"^=^>true >>config.php
	echo.   ];>>config.php
	echo $email_permission_to_backup_restore ^= [ "local"^=^>true >>config.php
	echo.   ];>>config.php
	echo ^?^>>>config.php
	goto skip_user_permission
)


rem pause
cls
echo ***************************
echo * Permissoes de usuarios  *
echo ***************************
echo.
echo Cadastro de email (gmail) que podera criar musicas
echo e repertorios no sistema.
echo.

echo $email_permission_to_write ^= [ ""^=^>false >>config.php
:loop
set email=
set /P email=email (enter para sair):
if not "%email%" == "" (
	echo.   ,"%email%"^=^>true >>config.php
	goto loop
)
echo.   ];>>config.php

echo.
echo Cadastro de email (gmail) que podera fazer backup e restaurar
echo o banco de dados.
echo.

echo $email_permission_to_backup_restore ^= [ ""^=^>false >>config.php
:loop2
set email=
set /P email=email (enter para sair):
if not "%email%" == "" (
	echo.   ,"%email%"^=^>true >>config.php
	goto loop2
)
echo.   ];>>config.php



echo ^?^>>>config.php

:skip_user_permission
cls
..\%_7zipEXE% a -tzip -mx9 ..\upload\site.zip *  

cd ..
del null
del public_html\config.php
del public_html\config.js

cls
echo **********************
echo * Processo concluido *
echo **********************
echo.
echo O site esta na pasta upload\
echo.
echo Para ativar o plugin e' necessario fazer upload dos arquivos 
echo instalar.php e site.zip por um programa de FTP para a pasta do site.
echo.
echo Quando acessar o site pela primeira vez, todo o conteudo sera 
echo descomprimido e o sistema estara pronto para ser utilizado.
echo.
pause
start .\upload\

