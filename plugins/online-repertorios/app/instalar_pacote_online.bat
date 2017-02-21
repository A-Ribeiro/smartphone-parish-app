@echo off
setlocal EnableDelayedExpansion
chcp 65001 > null
echo.
echo ********************************
echo * Instalação de pacote ONLINE  *
echo ********************************
echo.
echo Será instalado o plugin 'repertorios' na
echo pasta '3 conteudo online\content'.
echo.
pause
cls

if exist "..\..\..\3 conteudo online\content\repertorios" (
	rmdir /q /s "..\..\..\3 conteudo online\content\repertorios" > null
)
xcopy /hiev content\repertorios "..\..\..\3 conteudo online\content\repertorios"

del null

..\..\..\tools\plugin_op.exe add "..\..\..\3 conteudo online\content\plugins.json"

cls
echo.
echo **********************
echo * Processo concluido *
echo **********************
echo.
echo.
echo Obs.: Nao e necessario gerar pacote embutido para esse plugin
echo.
pause