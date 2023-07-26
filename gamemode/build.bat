@ECHO off

echo Compiling client side...
cmd /c "esbuild.cmd .//source/client_side --bundle --outfile=.//client_packages/index.js"

echo Compiling server side...
cmd /c "esbuild.cmd .//source/server_side --bundle --outfile=.//packages/wixoos/index.js --platform=node"

echo Compilation is finished