Clazz.declarePackage ("J.adapter.readers.quantum");
Clazz.load (["J.adapter.readers.quantum.SlaterReader", "java.util.Hashtable"], "J.adapter.readers.quantum.DgridReader", ["java.lang.Float", "J.quantum.SlaterData", "J.util.Logger", "$.SB"], function () {
c$ = Clazz.decorateAsClass (function () {
this.title = null;
this.htExponents = null;
this.htFuncMap = null;
Clazz.instantialize (this, arguments);
}, J.adapter.readers.quantum, "DgridReader", J.adapter.readers.quantum.SlaterReader);
Clazz.prepareFields (c$, function () {
this.htExponents =  new java.util.Hashtable ();
});
Clazz.overrideMethod (c$, "checkLine", 
function () {
if (this.line.indexOf (":title") == 0) {
this.title = this.readLine ().substring (2);
return true;
}if (this.line.indexOf ("basis:  CARTESIAN  STO") >= 0) {
this.readSlaterBasis ();
return true;
}if (this.line.indexOf (":atom") == 0) {
this.readCoordinates ();
return true;
}if (this.line.indexOf (" MO  DATA ") >= 0) {
if (this.doReadMolecularOrbitals) this.readMolecularOrbitals ();
return true;
}return true;
});
Clazz.defineMethod (c$, "readCoordinates", 
($fz = function () {
this.atomSetCollection.newAtomSet ();
this.atomSetCollection.setAtomSetName (this.title);
this.discardLinesUntilContains ("----");
while (this.readLine () != null && !this.line.startsWith (":-----")) {
var tokens = this.getTokens ();
if (tokens.length < 5) break;
var symbol = tokens[0];
var atom = this.atomSetCollection.addNewAtom ();
atom.elementSymbol = symbol;
this.setAtomCoordXYZ (atom, this.parseFloatStr (tokens[2]) * 0.5291772, this.parseFloatStr (tokens[3]) * 0.5291772, this.parseFloatStr (tokens[4]) * 0.5291772);
}
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "readSlaterBasis", 
($fz = function () {
this.discardLinesUntilContains (":-");
var ch = 'a';
while (this.readLine () != null && this.line.indexOf (":-") < 0) {
var atomSymbol = this.line.substring (3, 6).trim ();
var xyz = this.line.substring (19, 21);
var code = atomSymbol + xyz;
if (this.htExponents.get (code) == null) {
ch = 'a';
} else {
code += "_" + (ch = String.fromCharCode (($c$ = ch).charCodeAt (0) + 1), $c$);
}var exp = this.line.substring (34);
this.htExponents.put (code, Float.$valueOf (this.parseFloatStr (exp)));
}
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "readMolecularOrbitals", 
($fz = function () {
this.htFuncMap =  new java.util.Hashtable ();
this.readLines (3);
while (this.line != null && this.line.indexOf (":") != 0) {
this.discardLinesUntilContains ("sym: ");
var symmetry = this.line.substring (4, 10).trim ();
if (symmetry.indexOf ("_FC") >= 0) break;
var data =  new J.util.SB ();
data.append (this.line.substring (15));
while (this.readLine () != null && this.line.length >= 15) data.append (this.line);

var tokens = J.adapter.smarter.AtomSetCollectionReader.getTokensStr (data.toString ());
var nFuncs = Clazz.doubleToInt (tokens.length / 2);
var ptSlater =  Clazz.newIntArray (nFuncs, 0);
var atoms = this.atomSetCollection.getAtoms ();
for (var i = 0, pt = 0; i < tokens.length; ) {
var iAtom = this.parseIntStr (tokens[i++]) - 1;
var code = tokens[i++];
var key = iAtom + "_" + code;
if (this.htFuncMap.containsKey (key)) {
ptSlater[pt++] = this.htFuncMap.get (key).intValue ();
} else {
var n = this.slaters.size ();
ptSlater[pt++] = n;
this.htFuncMap.put (key, Integer.$valueOf (n));
this.addSlater (this.createSlaterData (iAtom, atoms[iAtom].elementSymbol, code), n);
}}
this.discardLinesUntilContains (":-");
this.readLine ();
while (this.line != null && this.line.length >= 20) {
var iOrb = this.parseIntRange (this.line, 0, 10);
var energy = this.parseFloatRange (this.line, 10, 20);
var cData =  new J.util.SB ();
cData.append (this.line.substring (20));
while (this.readLine () != null && this.line.length >= 10) {
if (this.line.charAt (3) != ' ') break;
cData.append (this.line);
}
var list =  Clazz.newFloatArray (this.slaters.size (), 0);
tokens = J.adapter.smarter.AtomSetCollectionReader.getTokensStr (cData.toString ());
if (tokens.length != nFuncs) J.util.Logger.error ("DgridReader: number of coefficients (" + tokens.length + ") does not equal number of functions (" + nFuncs + ")");
for (var i = 0; i < tokens.length; i++) {
var pt = ptSlater[i];
list[pt] = this.parseFloatStr (tokens[i]);
}
var mo =  new java.util.Hashtable ();
mo.put ("energy",  new Float (energy));
mo.put ("coefficients", list);
mo.put ("symmetry", symmetry + "_" + iOrb);
this.setMO (mo);
}
}
this.discardLinesUntilContains (":  #  symmetry");
this.readLine ();
for (var i = 0; i < this.orbitals.size (); i++) {
this.readLine ();
var occupancy = this.parseFloatRange (this.line, 31, 45) + this.parseFloatRange (this.line, 47, 61);
this.orbitals.get (i).put ("occupancy", Float.$valueOf (occupancy));
}
this.sortOrbitals ();
this.setSlaters (true, true);
this.setMOs ("eV");
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "createSlaterData", 
($fz = function (iAtom, atomSymbol, xyz) {
var ch;
var abc = ' ';
var type = ' ';
var exp = 1;
var el = 0;
var x = 0;
var y = 0;
var z = 0;
for (var i = xyz.length; --i >= 0; ) {
switch (ch = xyz.charAt (i)) {
case '_':
type = abc;
break;
case '1':
case '2':
case '3':
case '4':
exp = ch.charCodeAt (0) - 48;
break;
case 'x':
x = exp;
el += exp;
exp = 1;
break;
case 'y':
y = exp;
el += exp;
exp = 1;
break;
case 'z':
z = exp;
el += exp;
exp = 1;
break;
case 's':
case 'p':
case 'd':
case 'f':
default:
abc = ch;
}
}
var r = (exp - el - 1);
var code = atomSymbol + xyz.substring (0, 2);
if (type != ' ') code += "_" + type;
var f = this.htExponents.get (code);
var zeta = 0;
if (f == null) J.util.Logger.error ("Exponent for " + code + " not found");
 else zeta = f.floatValue ();
return  new J.quantum.SlaterData (iAtom, x, y, z, r, zeta, 1);
}, $fz.isPrivate = true, $fz), "~N,~S,~S");
});
