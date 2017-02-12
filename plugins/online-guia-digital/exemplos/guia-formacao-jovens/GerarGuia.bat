@echo off
setlocal EnableDelayedExpansion
chcp 65001 > null

set ARQUIVO_DE_SAIDA=guia-formacao-jovens.json


echo Compilando documento digital: %ARQUIVO_DE_SAIDA%
echo.

..\..\tools\json-generator ./dia1.txt ./dia2.txt ./dia3.txt ./dia4.txt ./dia5.txt

del dia*.json
del pagina-inicial.json
del music-template.json
del null

move allpages.json %ARQUIVO_DE_SAIDA%
cls
echo.
echo Pronto
echo.
echo A novena esta no arquivo '%ARQUIVO_DE_SAIDA%'
echo.
pause
