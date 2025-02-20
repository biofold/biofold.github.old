Clazz.declarePackage ("J.adapter.readers.xtal");
Clazz.load (["J.adapter.smarter.AtomSetCollectionReader"], "J.adapter.readers.xtal.EspressoReader", ["java.lang.Double"], function () {
c$ = Clazz.decorateAsClass (function () {
this.cellParams = null;
this.totEnergy = null;
this.endFlag = false;
this.aPar = 0;
Clazz.instantialize (this, arguments);
}, J.adapter.readers.xtal, "EspressoReader", J.adapter.smarter.AtomSetCollectionReader);
Clazz.overrideMethod (c$, "initializeReader", 
function () {
this.setSpaceGroupName ("P1");
this.doApplySymmetry = true;
});
Clazz.overrideMethod (c$, "checkLine", 
function () {
if (this.line.contains ("lattice parameter (a_0)") || this.line.contains ("lattice parameter (alat)")) {
this.readAparam ();
} else if (this.line.contains ("crystal axes:")) {
this.readCellParam (false);
} else if (this.line.contains ("CELL_PARAMETERS")) {
this.readCellParam (true);
} else if (this.line.contains ("Cartesian axes")) {
this.discardLinesUntilContains ("positions (");
if (this.doGetModel (++this.modelNumber, null)) this.readAtoms ();
} else if (this.line.contains ("POSITIONS (")) {
if (this.doGetModel (++this.modelNumber, null)) this.readAtoms ();
} else if (this.line.contains ("!    total energy")) {
this.readEnergy ();
} else if (this.line.contains ("A final scf")) {
this.endFlag = true;
}return true;
});
Clazz.defineMethod (c$, "readAparam", 
($fz = function () {
this.aPar = this.parseFloatStr (this.getTokens ()[4]) * 0.5291772;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "readCellParam", 
($fz = function (andAPar) {
var i0 = (andAPar ? 0 : 3);
if (andAPar && this.line.contains ("=")) this.aPar = this.parseFloatStr (this.line.substring (this.line.indexOf ("=") + 1)) * 0.5291772;
this.cellParams =  Clazz.newFloatArray (9, 0);
for (var n = 0, i = 0; n < 3; n++) {
var tokens = J.adapter.smarter.AtomSetCollectionReader.getTokensStr (this.readLine ());
this.cellParams[i++] = this.parseFloatStr (tokens[i0]) * this.aPar;
this.cellParams[i++] = this.parseFloatStr (tokens[i0 + 1]) * this.aPar;
this.cellParams[i++] = this.parseFloatStr (tokens[i0 + 2]) * this.aPar;
}
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "newAtomSet", 
($fz = function () {
this.atomSetCollection.newAtomSet ();
if (this.totEnergy != null) this.setEnergy ();
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setCellParams", 
($fz = function () {
if (this.cellParams != null) {
this.addPrimitiveLatticeVector (0, this.cellParams, 0);
this.addPrimitiveLatticeVector (1, this.cellParams, 3);
this.addPrimitiveLatticeVector (2, this.cellParams, 6);
this.setSpaceGroupName ("P1");
}}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "readAtoms", 
($fz = function () {
this.newAtomSet ();
var isAlat = (this.line.contains ("alat") || this.line.contains ("a_0"));
var firstStr = (this.line.contains ("site n."));
var isFractional = this.line.contains ("crystal");
var isBohr = this.line.contains ("bohr");
var isAngstrom = this.line.contains ("angstrom");
if (isAlat || isFractional || isAngstrom) this.setCellParams ();
this.setFractionalCoordinates (isFractional);
while (this.readLine () != null && this.line.length > 45) {
var tokens = this.getTokens ();
var atom = this.atomSetCollection.addNewAtom ();
atom.atomName = tokens[(isBohr || tokens.length == 4 || !firstStr ? 0 : 1)];
var i1 = (isBohr || tokens.length == 4 || !firstStr ? 1 : tokens.length - 4);
var x = this.parseFloatStr (tokens[i1++]);
var y = this.parseFloatStr (tokens[i1++]);
var z = this.parseFloatStr (tokens[i1++]);
atom.set (x, y, z);
if (isBohr) {
atom.scale (0.5291772);
} else if (isAlat) {
atom.scale (this.aPar);
}this.setAtomCoord (atom);
}
this.applySymmetryAndSetTrajectory ();
if (this.endFlag) this.discardLinesUntilContains ("Harris-Foulkes estimate");
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "readEnergy", 
($fz = function () {
this.totEnergy = Double.$valueOf (Double.parseDouble (J.adapter.smarter.AtomSetCollectionReader.getTokensStr (this.line.substring (this.line.indexOf ("=") + 1))[0]));
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setEnergy", 
($fz = function () {
this.atomSetCollection.setAtomSetEnergy ("" + this.totEnergy, this.totEnergy.floatValue ());
this.atomSetCollection.setAtomSetCollectionAuxiliaryInfo ("Energy", this.totEnergy);
this.atomSetCollection.setAtomSetName ("E = " + this.totEnergy + " Ry");
}, $fz.isPrivate = true, $fz));
});
