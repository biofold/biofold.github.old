if not exist ..\j2s\%1 goto done
echo // > t
echo //// %1 >> t
echo // >> t
type ..\j2s\%1 >> t
type t >> core.js
del t
:done 