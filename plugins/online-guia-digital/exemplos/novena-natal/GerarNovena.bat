@echo off

setlocal EnableDelayedExpansion
chcp 65001 > null

set ARQUIVO_DE_SAIDA=novena-natal
set ARQUIVO_DE_CUSTOMIZACAO=novena-natal-music-template.zip

set _7zipEXE=..\..\..\..\tools\7za.exe

..\..\tools\json-generator ./dia1.txt ./dia2.txt ./dia3.txt ./dia4.txt ./dia5.txt ./dia6.txt ./dia7.txt ./dia8.txt ./dia9.txt

move allpages.json %ARQUIVO_DE_SAIDA%.bak

rmdir music-template /S /Q
mkdir music-template
mkdir music-template\musicas

copy musicas\*.txt music-template\musicas\
move music-template.json music-template\

del *.json
del musicas\*.json
del null

move %ARQUIVO_DE_SAIDA%.bak %ARQUIVO_DE_SAIDA%.json

echo ^@echo off> music-template\GerarCustomizacaoMusica.bat
echo set ARQUIVO_DE_SAIDA^=%ARQUIVO_DE_SAIDA%-customizacao-musical.json>> music-template\GerarCustomizacaoMusica.bat
type GerarCustomizacaoMusica.bat.source >> music-template\GerarCustomizacaoMusica.bat

mkdir music-template\tools
copy ..\..\tools\json-music-processor.exe music-template\tools\

%_7zipEXE% a -tzip -mx9 %ARQUIVO_DE_CUSTOMIZACAO% music-template

rmdir music-template /S /Q

cls
echo.
echo Pronto
echo.
echo Arquivo com a novena criado: %ARQUIVO_DE_SAIDA%.json
echo.
echo Arquivo de customizacao de musicas da novena criado: %ARQUIVO_DE_CUSTOMIZACAO%
echo.
pause

rem copy json-music-processor.exe music-template\
