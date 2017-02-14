@echo off
setlocal EnableDelayedExpansion
chcp 65001 > null
echo.
echo ***********************************
echo * Desinstalacao de pacote ONLINE  *
echo ***********************************
echo.
echo O plugin 'guia-digital' sera desinstalado.
echo.
pause
cls

if exist "..\..\..\3 conteudo online\content\guia-digital" (
	rmdir /q /s "..\..\..\3 conteudo online\content\guia-digital" > null
)

del null

..\..\..\tools\plugin_op.exe remove "..\..\..\3 conteudo online\content\plugins.json"

cls
echo.
echo **********************
echo * Processo concluido *
echo **********************
echo.
echo Obs.: E um plugin online, ou seja, nao e necessario atualizar o 
echo       aplicativo na Play Store para desinstala-lo.
echo.
pause
