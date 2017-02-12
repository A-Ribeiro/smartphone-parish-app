@echo off
setlocal EnableDelayedExpansion
chcp 65001 > null

set ARQUIVO_DE_SAIDA=novena-nossa-senhora-do-carmo.json


echo Compilando documento digital: %ARQUIVO_DE_SAIDA%
echo.

..\..\tools\json-generator ./pagina-inicial.txt ./dia1.txt ./dia2.txt ./dia3.txt ./dia4.txt ./dia5.txt ./dia6.txt ./dia7.txt ./dia8.txt ./dia9.txt

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
