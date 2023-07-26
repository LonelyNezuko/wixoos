@ECHO off

cls
echo RageMP server started
echo Compiling...

cmd /c "build.bat"

echo Start server
"ragemp-server.exe"