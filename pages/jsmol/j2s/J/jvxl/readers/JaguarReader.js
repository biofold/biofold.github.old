Clazz.declarePackage ("J.jvxl.readers");
Clazz.load (["J.jvxl.readers.VolumeFileReader"], "J.jvxl.readers.JaguarReader", ["J.util.Parser", "$.SB"], function () {
c$ = Clazz.decorateAsClass (function () {
this.extents = null;
Clazz.instantialize (this, arguments);
}, J.jvxl.readers, "JaguarReader", J.jvxl.readers.VolumeFileReader);
Clazz.prepareFields (c$, function () {
this.extents =  Clazz.newFloatArray (3, 0);
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, J.jvxl.readers.JaguarReader, []);
});
Clazz.defineMethod (c$, "init2", 
function (sg, br) {
Clazz.superCall (this, J.jvxl.readers.JaguarReader, "init2", [sg, br]);
this.nSurfaces = 1;
}, "J.jvxl.readers.SurfaceGenerator,java.io.BufferedReader");
Clazz.overrideMethod (c$, "readParameters", 
function () {
this.jvxlFileHeaderBuffer =  new J.util.SB ();
this.jvxlFileHeaderBuffer.append ("Jaguar data\n");
this.jvxlFileHeaderBuffer.append ("\n");
var atomLine;
while ((atomLine = this.readLine ()) != null && atomLine.indexOf ("origin=") < 0) {
}
var tokens = J.util.Parser.getTokensAt (atomLine, 0);
if (tokens.length == 4 && tokens[0].equals ("origin=")) {
this.volumetricOrigin.set (this.parseFloatStr (tokens[1]), this.parseFloatStr (tokens[2]), this.parseFloatStr (tokens[3]));
J.jvxl.readers.VolumeFileReader.checkAtomLine (this.isXLowToHigh, this.isAngstroms, "0", "0 " + tokens[1] + " " + tokens[2] + " " + tokens[3], this.jvxlFileHeaderBuffer);
if (!this.isAngstroms) this.volumetricOrigin.scale (0.5291772);
}this.readExtents (0);
this.readExtents (1);
this.readExtents (2);
tokens = J.util.Parser.getTokens (this.readLine ());
this.voxelCounts[0] = this.parseIntStr (tokens[1]);
this.voxelCounts[1] = this.parseIntStr (tokens[2]);
this.voxelCounts[2] = this.parseIntStr (tokens[3]);
var factor = (this.isAngstroms ? 1 : 0.5291772);
var d = this.extents[0] / (this.voxelCounts[0] - 1);
this.volumetricVectors[0].set (d * factor, 0, 0);
this.jvxlFileHeaderBuffer.append (this.voxelCounts[0] + " " + d + " 0.0 0.0\n");
d = this.extents[1] / (this.voxelCounts[1] - 1);
this.volumetricVectors[1].set (0, d * factor, 0);
this.jvxlFileHeaderBuffer.append (this.voxelCounts[1] + " 0.0 " + d + " 0.0\n");
d = this.extents[2] / (this.voxelCounts[2] - 1);
this.volumetricVectors[2].set (0, 0, d * factor);
this.jvxlFileHeaderBuffer.append (this.voxelCounts[2] + " 0.0 0.0 " + d + "\n");
this.readLine ();
});
Clazz.defineMethod (c$, "readExtents", 
($fz = function (voxelVectorIndex) {
var tokens = J.util.Parser.getTokens (this.readLine ());
this.extents[voxelVectorIndex] = this.parseFloatStr (tokens[voxelVectorIndex + 1]);
}, $fz.isPrivate = true, $fz), "~N");
});
