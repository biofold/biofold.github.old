echo min.bat
type ..\js\JSmoljQuery.js > min.js
type ..\js\JSmolCore.js >> min.js
type ..\js\JSmol.js >> min.js
type ..\js\JSmolApplet.js >> min.js
type ..\js\JSmolControls.js >> min.js
type ..\js\JSmolApi.js >> min.js
type j2sjmolFull.js >> min.js
java -jar closure_compiler.jar --js min.js --js_output_file ..\JSmol.min.js
pause
del min.js
call zip.bat
