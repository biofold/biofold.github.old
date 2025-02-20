Clazz.declarePackage ("J.jvxl.readers");
Clazz.load (["J.jvxl.readers.VolumeFileReader"], "J.jvxl.readers.PltFormattedReader", ["J.util.SB", "J.viewer.Viewer"], function () {
c$ = Clazz.declareType (J.jvxl.readers, "PltFormattedReader", J.jvxl.readers.VolumeFileReader);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, J.jvxl.readers.PltFormattedReader, []);
});
Clazz.defineMethod (c$, "init2", 
function (sg, br) {
Clazz.superCall (this, J.jvxl.readers.PltFormattedReader, "init2", [sg, br]);
this.isAngstroms = true;
this.jvxlData.wasCubic = true;
this.jvxlFileHeaderBuffer =  new J.util.SB ();
this.nSurfaces = 1;
}, "J.jvxl.readers.SurfaceGenerator,java.io.BufferedReader");
Clazz.overrideMethod (c$, "readParameters", 
function () {
var n1 = this.parseIntStr (this.readLine ());
var n2 = this.parseInt ();
this.nPointsX = this.parseIntStr (this.readLine ());
this.nPointsY = this.parseInt ();
this.nPointsZ = this.parseInt ();
this.jvxlFileHeaderBuffer.append ("Plt formatted data (" + n1 + "," + n2 + ") " + this.nPointsX + " x " + this.nPointsY + " x " + this.nPointsZ + " \nJmol " + J.viewer.Viewer.getJmolVersion () + '\n');
this.volumetricOrigin.set (0, 0, 0);
var xmin = this.parseFloatStr (this.readLine ().substring (0, 12));
var xmax = this.parseFloatRange (this.line, 12, 24);
var ymin = this.parseFloatRange (this.line, 24, 36);
var ymax = this.parseFloatRange (this.line, 36, 48);
var zmin = this.parseFloatRange (this.line, 48, 60);
var zmax = this.parseFloatRange (this.line, 60, 72);
this.volumetricOrigin.set (xmin, ymin, zmin);
this.voxelCounts[0] = this.nPointsX;
this.voxelCounts[1] = this.nPointsY;
this.voxelCounts[2] = this.nPointsZ;
this.volumetricVectors[0].set (0, 0, (xmax - xmin) / this.nPointsX);
this.volumetricVectors[1].set (0, (ymax - ymin) / this.nPointsY, 0);
this.volumetricVectors[2].set ((zmax - zmin) / this.nPointsZ, 0, 0);
});
});
