@echo off
setlocal EnableDelayedExpansion
chcp 65001 > null
echo.
echo ********************************
echo * Instalacao de pacote ONLINE  *
echo ********************************
echo.
echo Sera instalado o plugin 'guia-digital' na
echo pasta '3 conteudo online\content'.
echo.
pause
cls

if exist "..\..\..\3 conteudo online\content\guia-digital" (
	rmdir /q /s "..\..\..\3 conteudo online\content\guia-digital" > null
)
xcopy /hiev content\guia-digital "..\..\..\3 conteudo online\content\guia-digital"

del null

..\..\..\tools\plugin_op.exe add "..\..\..\3 conteudo online\content\plugins.json"

cls
echo.
echo **********************
echo * Processo concluido *
echo **********************
echo.
echo Obs.: E' um plugin online, ou seja, nao e' necessario atualizar o 
echo       aplicativo na Play Store para instala-lo.
echo.
pause
