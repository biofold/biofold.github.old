Clazz.declarePackage ("J.jvxl.readers");
Clazz.load (["J.jvxl.readers.SurfaceFileReader"], "J.jvxl.readers.PolygonFileReader", ["java.util.Date", "J.util.SB"], function () {
c$ = Clazz.decorateAsClass (function () {
this.nVertices = 0;
this.nTriangles = 0;
Clazz.instantialize (this, arguments);
}, J.jvxl.readers, "PolygonFileReader", J.jvxl.readers.SurfaceFileReader);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, J.jvxl.readers.PolygonFileReader, []);
});
Clazz.defineMethod (c$, "init2", 
function (sg, br) {
Clazz.superCall (this, J.jvxl.readers.PolygonFileReader, "init2", [sg, br]);
this.jvxlFileHeaderBuffer =  new J.util.SB ();
this.jvxlFileHeaderBuffer.append ("#created ").append ("" +  new java.util.Date ()).append ("\n");
this.vertexDataOnly = true;
}, "J.jvxl.readers.SurfaceGenerator,java.io.BufferedReader");
Clazz.overrideMethod (c$, "readVolumeParameters", 
function (isMapData) {
return true;
}, "~B");
Clazz.overrideMethod (c$, "readVolumeData", 
function (isMapData) {
return true;
}, "~B");
Clazz.overrideMethod (c$, "readSurfaceData", 
function (isMapData) {
this.getSurfaceData ();
}, "~B");
});
