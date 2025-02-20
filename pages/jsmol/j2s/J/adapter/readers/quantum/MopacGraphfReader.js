Clazz.declarePackage ("J.adapter.readers.quantum");
Clazz.load (["J.adapter.readers.quantum.MopacSlaterReader"], "J.adapter.readers.quantum.MopacGraphfReader", ["java.lang.Float", "java.util.ArrayList", "$.Hashtable", "J.adapter.smarter.AtomSetCollectionReader", "J.util.ArrayUtil"], function () {
c$ = Clazz.decorateAsClass (function () {
this.atomCount = 0;
this.nCoefficients = 0;
this.invMatrix = null;
this.isNewFormat = false;
this.orbitalData = null;
this.orbitalInfo = null;
Clazz.instantialize (this, arguments);
}, J.adapter.readers.quantum, "MopacGraphfReader", J.adapter.readers.quantum.MopacSlaterReader);
Clazz.overrideMethod (c$, "initializeReader", 
function () {
this.alphaBeta = "alpha";
});
Clazz.overrideMethod (c$, "checkLine", 
function () {
this.readAtoms ();
if (this.doReadMolecularOrbitals) {
this.readSlaterBasis ();
this.readMolecularOrbitals (false);
if (this.readKeywords ()) this.readMolecularOrbitals (true);
}this.continuing = false;
return false;
});
Clazz.defineMethod (c$, "readAtoms", 
($fz = function () {
this.atomSetCollection.newAtomSet ();
this.atomCount = this.parseIntStr (this.line);
this.atomicNumbers =  Clazz.newIntArray (this.atomCount, 0);
for (var i = 0; i < this.atomCount; i++) {
this.readLine ();
this.atomicNumbers[i] = this.parseIntRange (this.line, 0, 4);
var atom = this.atomSetCollection.addNewAtom ();
this.setAtomCoordXYZ (atom, this.parseFloatRange (this.line, 4, 17), this.parseFloatRange (this.line, 17, 29), this.parseFloatRange (this.line, 29, 41));
if (this.line.length > 41) atom.partialCharge = this.parseFloatStr (this.line.substring (41));
atom.elementSymbol = J.adapter.smarter.AtomSetCollectionReader.getElementSymbol (this.atomicNumbers[i]);
}
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "readSlaterBasis", 
($fz = function () {
this.nCoefficients = 0;
var values =  Clazz.newFloatArray (3, 0);
for (var iAtom = 0; iAtom < this.atomCount; iAtom++) {
J.adapter.smarter.AtomSetCollectionReader.getTokensFloat (this.readLine (), values, 3);
var atomicNumber = this.atomicNumbers[iAtom];
var zeta;
if ((zeta = values[0]) != 0) {
this.createSphericalSlaterByType (iAtom, atomicNumber, "S", zeta, 1);
}if ((zeta = values[1]) != 0) {
this.createSphericalSlaterByType (iAtom, atomicNumber, "Px", zeta, 1);
this.createSphericalSlaterByType (iAtom, atomicNumber, "Py", zeta, 1);
this.createSphericalSlaterByType (iAtom, atomicNumber, "Pz", zeta, 1);
}if ((zeta = values[2]) != 0) {
this.createSphericalSlaterByType (iAtom, atomicNumber, "Dx2-y2", zeta, 1);
this.createSphericalSlaterByType (iAtom, atomicNumber, "Dxz", zeta, 1);
this.createSphericalSlaterByType (iAtom, atomicNumber, "Dz2", zeta, 1);
this.createSphericalSlaterByType (iAtom, atomicNumber, "Dyz", zeta, 1);
this.createSphericalSlaterByType (iAtom, atomicNumber, "Dxy", zeta, 1);
}}
this.nCoefficients = this.slaters.size ();
this.setSlaters (true, false);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "readMolecularOrbitals", 
($fz = function (isBeta) {
if (isBeta) this.alphaBeta = "beta";
var list = null;
if (this.readLine () == null) return;
this.isNewFormat = (this.line.indexOf ("ORBITAL") >= 0);
if (this.isNewFormat) {
this.orbitalData =  new java.util.ArrayList ();
if (this.line.length > 10) this.orbitalInfo =  new java.util.ArrayList ();
} else {
list =  Clazz.newFloatArray (this.nCoefficients, this.nCoefficients, 0);
}for (var iMo = 0; iMo < this.nCoefficients; iMo++) {
if (iMo != 0) this.readLine ();
var data;
if (this.isNewFormat) {
if (this.line == null || this.line.indexOf ("ORBITAL") < 0 || this.line.indexOf ("ORBITAL_LIST") >= 0) break;
this.orbitalData.add (data =  Clazz.newFloatArray (this.nCoefficients, 0));
if (this.orbitalInfo != null) this.orbitalInfo.add (this.line);
this.readLine ();
} else {
data = list[iMo];
}this.fillFloatArray (this.line, 15, data);
}
if (this.invMatrix == null) {
if (this.isNewFormat && this.line.indexOf ("MATRIX") < 0) this.readLine ();
this.invMatrix = J.util.ArrayUtil.newFloat2 (this.nCoefficients);
for (var iMo = 0; iMo < this.nCoefficients; iMo++) this.fillFloatArray (null, 15, this.invMatrix[iMo] =  Clazz.newFloatArray (iMo + 1, 0));

}this.nOrbitals = (this.orbitalData == null ? this.nCoefficients : this.orbitalData.size ());
if (this.orbitalData != null) {
list = J.util.ArrayUtil.newFloat2 (this.nOrbitals);
for (var i = this.nOrbitals; --i >= 0; ) list[i] = this.orbitalData.get (i);

}var list2 =  Clazz.newFloatArray (this.nOrbitals, this.nCoefficients, 0);
for (var i = 0; i < this.nOrbitals; i++) for (var j = 0; j < this.nCoefficients; j++) {
for (var k = 0; k < this.nCoefficients; k++) list2[i][j] += (list[i][k] * (k >= j ? this.invMatrix[k][j] : this.invMatrix[j][k]));

if (Math.abs (list2[i][j]) < 1.0E-4) list2[i][j] = 0;
}

if (this.isNewFormat && this.orbitalInfo == null && this.line != null && this.line.indexOf ("ORBITAL_LIST") < 0) this.readLine ();
var values =  Clazz.newFloatArray (2, 0);
for (var iMo = 0; iMo < this.nOrbitals; iMo++) {
var mo =  new java.util.Hashtable ();
if (this.orbitalInfo != null) {
this.line = this.orbitalInfo.get (iMo);
var tokens = this.getTokens ();
mo.put ("energy",  new Float (this.parseFloatStr (tokens[3])));
mo.put ("occupancy",  new Float (this.parseFloatStr (tokens[1])));
} else if (this.readLine () != null) {
J.adapter.smarter.AtomSetCollectionReader.getTokensFloat (this.line, values, 2);
mo.put ("energy",  new Float (values[0]));
mo.put ("occupancy",  new Float (values[1]));
}mo.put ("coefficients", list2[iMo]);
if (isBeta) mo.put ("type", "beta");
this.line = "\n";
if (this.filterMO ()) this.setMO (mo);
}
this.setMOs ("eV");
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "readKeywords", 
($fz = function () {
if (this.readLine () == null || this.line.indexOf (" Keywords:") < 0) return false;
this.moData.put ("calculationType", this.calculationType = this.line.substring (11).trim ());
var isUHF = (this.line.indexOf ("UHF") >= 0);
if (isUHF) {
for (var i = this.orbitals.size (); --i >= 0; ) {
this.orbitals.get (i).put ("type", "alpha");
}
}return isUHF;
}, $fz.isPrivate = true, $fz));
});
