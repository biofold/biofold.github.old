Clazz.declarePackage ("J.symmetry");
Clazz.load (["J.util.Matrix4f", "$.P3"], "J.symmetry.SymmetryOperation", ["java.lang.Float", "java.util.ArrayList", "J.util.Escape", "$.Logger", "$.Measure", "$.Parser", "$.Point4f", "$.Quaternion", "$.SB", "$.TextFormat", "$.TriangleData", "$.V3"], function () {
c$ = Clazz.decorateAsClass (function () {
this.xyzOriginal = null;
this.xyz = null;
this.doNormalize = true;
this.isFinalized = false;
this.opId = 0;
this.temp3 = null;
this.atomTest = null;
Clazz.instantialize (this, arguments);
}, J.symmetry, "SymmetryOperation", J.util.Matrix4f);
Clazz.prepareFields (c$, function () {
this.temp3 =  new J.util.P3 ();
this.atomTest =  new J.util.P3 ();
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, J.symmetry.SymmetryOperation, []);
});
Clazz.makeConstructor (c$, 
function (doNormalize, opId) {
Clazz.superConstructor (this, J.symmetry.SymmetryOperation, []);
this.doNormalize = doNormalize;
this.opId = opId;
}, "~B,~N");
Clazz.makeConstructor (c$, 
function (op, atoms, atomIndex, count, doNormalize) {
Clazz.superConstructor (this, J.symmetry.SymmetryOperation, []);
this.doNormalize = doNormalize;
this.xyzOriginal = op.xyzOriginal;
this.xyz = op.xyz;
this.opId = op.opId;
this.setM (op);
this.doFinalize ();
if (doNormalize) this.setOffset (atoms, atomIndex, count);
}, "J.symmetry.SymmetryOperation,~A,~N,~N,~B");
Clazz.defineMethod (c$, "doFinalize", 
function () {
this.m03 /= 12;
this.m13 /= 12;
this.m23 /= 12;
this.isFinalized = true;
});
Clazz.defineMethod (c$, "getXyz", 
function (normalized) {
return (normalized || this.xyzOriginal == null ? this.xyz : this.xyzOriginal);
}, "~B");
Clazz.defineMethod (c$, "newPoint", 
function (atom1, atom2, transX, transY, transZ) {
this.temp3.setT (atom1);
this.transform2 (this.temp3, this.temp3);
atom2.set (this.temp3.x + transX, this.temp3.y + transY, this.temp3.z + transZ);
}, "J.util.P3,J.util.P3,~N,~N,~N");
Clazz.defineMethod (c$, "dumpInfo", 
function () {
return "\n" + this.xyz + "\ninternal matrix representation:\n" + (this).toString ();
});
c$.dumpSeitz = Clazz.defineMethod (c$, "dumpSeitz", 
function (s) {
return  new J.util.SB ().append ("{\t").appendI (Clazz.floatToInt (s.m00)).append ("\t").appendI (Clazz.floatToInt (s.m01)).append ("\t").appendI (Clazz.floatToInt (s.m02)).append ("\t").append (J.symmetry.SymmetryOperation.twelfthsOf (s.m03)).append ("\t}\n").append ("{\t").appendI (Clazz.floatToInt (s.m10)).append ("\t").appendI (Clazz.floatToInt (s.m11)).append ("\t").appendI (Clazz.floatToInt (s.m12)).append ("\t").append (J.symmetry.SymmetryOperation.twelfthsOf (s.m13)).append ("\t}\n").append ("{\t").appendI (Clazz.floatToInt (s.m20)).append ("\t").appendI (Clazz.floatToInt (s.m21)).append ("\t").appendI (Clazz.floatToInt (s.m22)).append ("\t").append (J.symmetry.SymmetryOperation.twelfthsOf (s.m23)).append ("\t}\n").append ("{\t0\t0\t0\t1\t}\n").toString ();
}, "J.util.Matrix4f");
c$.dumpCanonicalSeitz = Clazz.defineMethod (c$, "dumpCanonicalSeitz", 
function (s) {
return  new J.util.SB ().append ("{\t").appendI (Clazz.floatToInt (s.m00)).append ("\t").appendI (Clazz.floatToInt (s.m01)).append ("\t").appendI (Clazz.floatToInt (s.m02)).append ("\t").append (J.symmetry.SymmetryOperation.twelfthsOf (s.m03 + 12)).append ("\t}\n").append ("{\t").appendI (Clazz.floatToInt (s.m10)).append ("\t").appendI (Clazz.floatToInt (s.m11)).append ("\t").appendI (Clazz.floatToInt (s.m12)).append ("\t").append (J.symmetry.SymmetryOperation.twelfthsOf (s.m13 + 12)).append ("\t}\n").append ("{\t").appendI (Clazz.floatToInt (s.m20)).append ("\t").appendI (Clazz.floatToInt (s.m21)).append ("\t").appendI (Clazz.floatToInt (s.m22)).append ("\t").append (J.symmetry.SymmetryOperation.twelfthsOf (s.m23 + 12)).append ("\t}\n").append ("{\t0\t0\t0\t1\t}\n").toString ();
}, "J.util.Matrix4f");
Clazz.defineMethod (c$, "setMatrixFromXYZ", 
function (xyz) {
if (xyz == null) return false;
this.xyzOriginal = xyz;
xyz = xyz.toLowerCase ();
var temp =  Clazz.newFloatArray (16, 0);
var isReverse = (xyz.startsWith ("!"));
if (isReverse) xyz = xyz.substring (1);
if (xyz.indexOf ("xyz matrix:") == 0) {
this.xyz = xyz;
J.util.Parser.parseStringInfestedFloatArray (xyz, null, temp);
for (var i = 0; i < 16; i++) {
if (Float.isNaN (temp[i])) return false;
var v = temp[i];
if (Math.abs (v) < 0.00001) v = 0;
if (i % 4 == 3) v = J.symmetry.SymmetryOperation.normalizeTwelfths ((v < 0 ? -1 : 1) * Math.round (Math.abs (v * 12)), this.doNormalize);
temp[i] = v;
}
temp[15] = 1;
this.setA (temp);
this.isFinalized = true;
if (isReverse) this.invertM (this);
this.xyz = J.symmetry.SymmetryOperation.getXYZFromMatrix (this, true, false, false);
return true;
}if (xyz.indexOf ("[[") == 0) {
xyz = xyz.$replace ('[', ' ').$replace (']', ' ').$replace (',', ' ');
J.util.Parser.parseStringInfestedFloatArray (xyz, null, temp);
for (var i = 0; i < 16; i++) {
if (Float.isNaN (temp[i])) return false;
}
this.setA (temp);
this.isFinalized = true;
if (isReverse) this.invertM (this);
this.xyz = J.symmetry.SymmetryOperation.getXYZFromMatrix (this, false, false, false);
return true;
}var strOut = J.symmetry.SymmetryOperation.getMatrixFromString (xyz, temp, this.doNormalize, false);
if (strOut == null) return false;
this.setA (temp);
if (isReverse) {
this.invertM (this);
this.xyz = J.symmetry.SymmetryOperation.getXYZFromMatrix (this, true, false, false);
} else {
this.xyz = strOut;
}if (J.util.Logger.debugging) J.util.Logger.debug ("" + this);
return true;
}, "~S");
c$.getMatrixFromString = Clazz.defineMethod (c$, "getMatrixFromString", 
function (xyz, temp, doNormalize, allowScaling) {
var isDenominator = false;
var isDecimal = false;
var isNegative = false;
var ch;
var x = 0;
var y = 0;
var z = 0;
var iValue = 0;
var strOut = "";
var strT;
var rowPt = -1;
var decimalMultiplier = 1;
while (xyz.indexOf ("x4") >= 0) {
J.util.Logger.info ("ignoring last parameter in " + xyz);
xyz = xyz.substring (0, xyz.lastIndexOf (","));
xyz = J.util.TextFormat.simpleReplace (xyz, "x1", "x");
xyz = J.util.TextFormat.simpleReplace (xyz, "x2", "y");
xyz = J.util.TextFormat.simpleReplace (xyz, "x3", "z");
}
xyz += ",";
for (var i = 0; i < xyz.length; i++) {
ch = xyz.charAt (i);
switch (ch) {
case '\'':
case ' ':
case '{':
case '}':
case '!':
continue;
case '-':
isNegative = true;
continue;
case '+':
isNegative = false;
continue;
case '/':
isDenominator = true;
continue;
case 'X':
case 'x':
x = (isNegative ? -1 : 1);
if (allowScaling && iValue != 0) {
x *= iValue;
iValue = 0;
}break;
case 'Y':
case 'y':
y = (isNegative ? -1 : 1);
if (allowScaling && iValue != 0) {
y *= iValue;
iValue = 0;
}break;
case 'Z':
case 'z':
z = (isNegative ? -1 : 1);
if (allowScaling && iValue != 0) {
z *= iValue;
iValue = 0;
}break;
case ',':
if (++rowPt > 2) {
J.util.Logger.warn ("Symmetry Operation? " + xyz);
return null;
}var tpt = rowPt * 4;
iValue = J.symmetry.SymmetryOperation.normalizeTwelfths (iValue, doNormalize);
temp[tpt++] = x;
temp[tpt++] = y;
temp[tpt++] = z;
temp[tpt] = iValue;
strT = "";
strT += (x == 0 ? "" : x < 0 ? "-x" : strT.length == 0 ? "x" : "+x");
strT += (y == 0 ? "" : y < 0 ? "-y" : strT.length == 0 ? "y" : "+y");
strT += (z == 0 ? "" : z < 0 ? "-z" : strT.length == 0 ? "z" : "+z");
strT += J.symmetry.SymmetryOperation.xyzFraction (iValue, false, true);
strOut += (strOut === "" ? "" : ",") + strT;
if (rowPt == 2) {
temp[15] = 1;
return strOut;
}x = y = z = 0;
iValue = 0;
break;
case '.':
isDecimal = true;
decimalMultiplier = 1;
continue;
case '0':
if (!isDecimal && (isDenominator || !allowScaling)) continue;
default:
var ich = ch.charCodeAt (0) - 48;
if (isDecimal && ich >= 0 && ich <= 9) {
decimalMultiplier /= 10;
if (iValue < 0) isNegative = true;
iValue += decimalMultiplier * ich * (isNegative ? -1 : 1);
continue;
}if (ich >= 0 && ich <= 9) {
if (isDenominator) {
iValue /= ich;
} else {
iValue = iValue * 10 + (isNegative ? -1 : 1) * ich;
isNegative = false;
}} else {
J.util.Logger.warn ("symmetry character?" + ch);
}}
isDecimal = isDenominator = isNegative = false;
}
return null;
}, "~S,~A,~B,~B");
c$.normalizeTwelfths = Clazz.defineMethod (c$, "normalizeTwelfths", 
($fz = function (iValue, doNormalize) {
iValue *= 12;
if (doNormalize) {
while (iValue > 6) iValue -= 12;

while (iValue <= -6) iValue += 12;

}return iValue;
}, $fz.isPrivate = true, $fz), "~N,~B");
c$.getXYZFromMatrix = Clazz.defineMethod (c$, "getXYZFromMatrix", 
function (mat, is12ths, allPositive, halfOrLess) {
var str = "";
var row =  Clazz.newFloatArray (4, 0);
for (var i = 0; i < 3; i++) {
mat.getRow (i, row);
var term = "";
if (row[0] != 0) term += (row[0] < 0 ? "-" : "+") + "x";
if (row[1] != 0) term += (row[1] < 0 ? "-" : "+") + "y";
if (row[2] != 0) term += (row[2] < 0 ? "-" : "+") + "z";
term += J.symmetry.SymmetryOperation.xyzFraction ((is12ths ? row[3] : row[3] * 12), allPositive, halfOrLess);
if (term.length > 0 && term.charAt (0) == '+') term = term.substring (1);
str += "," + term;
}
return str.substring (1);
}, "J.util.Matrix4f,~B,~B,~B");
c$.twelfthsOf = Clazz.defineMethod (c$, "twelfthsOf", 
($fz = function (n12ths) {
var str = "";
var i12ths = Math.round (n12ths);
if (i12ths == 12) return "1";
if (i12ths == -12) return "-1";
if (i12ths < 0) {
i12ths = -i12ths;
if (i12ths % 12 != 0) str = "-";
}var n = Clazz.doubleToInt (i12ths / 12);
if (n < 1) return str + J.symmetry.SymmetryOperation.twelfths[i12ths % 12];
var m = 0;
switch (i12ths % 12) {
case 0:
return str + n;
case 1:
case 5:
case 7:
case 11:
m = 12;
break;
case 2:
case 10:
m = 6;
break;
case 3:
case 9:
m = 4;
break;
case 4:
case 8:
m = 3;
break;
case 6:
m = 2;
break;
}
return str + (Clazz.doubleToInt (i12ths * m / 12)) + "/" + m;
}, $fz.isPrivate = true, $fz), "~N");
c$.xyzFraction = Clazz.defineMethod (c$, "xyzFraction", 
($fz = function (n12ths, allPositive, halfOrLess) {
n12ths = Math.round (n12ths);
if (allPositive) {
while (n12ths < 0) n12ths += 12;

} else if (halfOrLess && n12ths > 6) {
n12ths -= 12;
}var s = J.symmetry.SymmetryOperation.twelfthsOf (n12ths);
return (s.charAt (0) == '0' ? "" : n12ths > 0 ? "+" + s : s);
}, $fz.isPrivate = true, $fz), "~N,~B,~B");
Clazz.defineMethod (c$, "setOffset", 
($fz = function (atoms, atomIndex, count) {
var i1 = atomIndex;
var i2 = i1 + count;
var x = 0;
var y = 0;
var z = 0;
for (var i = i1; i < i2; i++) {
this.newPoint (atoms[i], this.atomTest, 0, 0, 0);
x += this.atomTest.x;
y += this.atomTest.y;
z += this.atomTest.z;
}
while (x < -0.001 || x >= count + 0.001) {
this.m03 += (x < 0 ? 1 : -1);
x += (x < 0 ? count : -count);
}
while (y < -0.001 || y >= count + 0.001) {
this.m13 += (y < 0 ? 1 : -1);
y += (y < 0 ? count : -count);
}
while (z < -0.001 || z >= count + 0.001) {
this.m23 += (z < 0 ? 1 : -1);
z += (z < 0 ? count : -count);
}
}, $fz.isPrivate = true, $fz), "~A,~N,~N");
Clazz.defineMethod (c$, "transformCartesian", 
($fz = function (unitcell, pt) {
unitcell.toFractional (pt, false);
this.transform (pt);
unitcell.toCartesian (pt, false);
}, $fz.isPrivate = true, $fz), "J.symmetry.UnitCell,J.util.P3");
Clazz.defineMethod (c$, "rotateEllipsoid", 
function (cartCenter, vectors, unitcell, ptTemp1, ptTemp2) {
var vRot =  new Array (3);
ptTemp2.setT (cartCenter);
this.transformCartesian (unitcell, ptTemp2);
for (var i = vectors.length; --i >= 0; ) {
ptTemp1.setT (cartCenter);
ptTemp1.add (vectors[i]);
this.transformCartesian (unitcell, ptTemp1);
vRot[i] = J.util.V3.newV (ptTemp1);
vRot[i].sub (ptTemp2);
}
return vRot;
}, "J.util.P3,~A,J.symmetry.UnitCell,J.util.P3,J.util.P3");
Clazz.defineMethod (c$, "getDescription", 
function (uc, pt00, ptTarget, id) {
if (!this.isFinalized) this.doFinalize ();
return J.symmetry.SymmetryOperation.getDescription (this, this.xyzOriginal, uc, pt00, ptTarget, id);
}, "J.api.SymmetryInterface,J.util.P3,J.util.P3,~S");
c$.getDescription = Clazz.defineMethod (c$, "getDescription", 
($fz = function (m, xyzOriginal, uc, pt00, ptTarget, id) {
var vtemp =  new J.util.V3 ();
var ptemp =  new J.util.P3 ();
var pt01 =  new J.util.P3 ();
var pt02 =  new J.util.P3 ();
var pt03 =  new J.util.P3 ();
var ftrans =  new J.util.V3 ();
var vtrans =  new J.util.V3 ();
var xyz = J.symmetry.SymmetryOperation.getXYZFromMatrix (m, false, false, false);
var typeOnly = (id == null);
if (pt00 == null || Float.isNaN (pt00.x)) pt00 =  new J.util.P3 ();
if (ptTarget != null) {
pt01.setT (pt00);
pt02.setT (ptTarget);
uc.toUnitCell (pt01, ptemp);
uc.toUnitCell (pt02, ptemp);
uc.toFractional (pt01, false);
m.transform (pt01);
uc.toCartesian (pt01, false);
uc.toUnitCell (pt01, ptemp);
if (pt01.distance (pt02) > 0.1) return null;
pt01.setT (pt00);
pt02.setT (ptTarget);
uc.toFractional (pt01, false);
uc.toFractional (pt02, false);
m.transform (pt01);
vtrans.sub2 (pt02, pt01);
pt01.set (0, 0, 0);
pt02.set (0, 0, 0);
}pt01.x = pt02.y = pt03.z = 1;
pt01.add (pt00);
pt02.add (pt00);
pt03.add (pt00);
var p0 = J.util.P3.newP (pt00);
var p1 = J.util.P3.newP (pt01);
var p2 = J.util.P3.newP (pt02);
var p3 = J.util.P3.newP (pt03);
uc.toFractional (p0, false);
uc.toFractional (p1, false);
uc.toFractional (p2, false);
uc.toFractional (p3, false);
m.transform2 (p0, p0);
m.transform2 (p1, p1);
m.transform2 (p2, p2);
m.transform2 (p3, p3);
p0.add (vtrans);
p1.add (vtrans);
p2.add (vtrans);
p3.add (vtrans);
J.symmetry.SymmetryOperation.approx (vtrans);
uc.toCartesian (p0, false);
uc.toCartesian (p1, false);
uc.toCartesian (p2, false);
uc.toCartesian (p3, false);
var v01 =  new J.util.V3 ();
v01.sub2 (p1, p0);
var v02 =  new J.util.V3 ();
v02.sub2 (p2, p0);
var v03 =  new J.util.V3 ();
v03.sub2 (p3, p0);
vtemp.cross (v01, v02);
var haveinversion = (vtemp.dot (v03) < 0);
if (haveinversion) {
p1.scaleAdd2 (-2, v01, p1);
p2.scaleAdd2 (-2, v02, p2);
p3.scaleAdd2 (-2, v03, p3);
}var info;
info = J.util.Measure.computeHelicalAxis (null, 135266306, pt00, p0, J.util.Quaternion.getQuaternionFrame (p0, p1, p2).div (J.util.Quaternion.getQuaternionFrame (pt00, pt01, pt02)));
var pa1 = info[0];
var ax1 = info[1];
var ang1 = Clazz.floatToInt (Math.abs (J.util.Parser.approx ((info[3]).x, 1)));
var pitch1 = J.symmetry.SymmetryOperation.approx ((info[3]).y);
if (haveinversion) {
p1.scaleAdd2 (2, v01, p1);
p2.scaleAdd2 (2, v02, p2);
p3.scaleAdd2 (2, v03, p3);
}var trans = J.util.V3.newV (p0);
trans.sub (pt00);
if (trans.length () < 0.1) trans = null;
var ptinv = null;
var ipt = null;
var pt0 = null;
var istranslation = (ang1 == 0);
var isrotation = !istranslation;
var isinversion = false;
var ismirrorplane = false;
if (isrotation || haveinversion) trans = null;
if (haveinversion && istranslation) {
ipt = J.util.P3.newP (pt00);
ipt.add (p0);
ipt.scale (0.5);
ptinv = p0;
isinversion = true;
} else if (haveinversion) {
var d = (pitch1 == 0 ?  new J.util.V3 () : ax1);
var f = 0;
switch (ang1) {
case 60:
f = 0.6666667;
break;
case 120:
f = 2;
break;
case 90:
f = 1;
break;
case 180:
pt0 =  new J.util.P3 ();
pt0.setT (pt00);
pt0.add (d);
pa1.scaleAdd2 (0.5, d, pt00);
if (pt0.distance (p0) > 0.1) {
trans = J.util.V3.newV (p0);
trans.sub (pt0);
ptemp.setT (trans);
uc.toFractional (ptemp, false);
ftrans.setT (ptemp);
} else {
trans = null;
}isrotation = false;
haveinversion = false;
ismirrorplane = true;
}
if (f != 0) {
vtemp.setT (pt00);
vtemp.sub (pa1);
vtemp.add (p0);
vtemp.sub (pa1);
vtemp.sub (d);
vtemp.scale (f);
pa1.add (vtemp);
ipt =  new J.util.P3 ();
ipt.scaleAdd2 (0.5, d, pa1);
ptinv =  new J.util.P3 ();
ptinv.scaleAdd2 (-2, ipt, pt00);
ptinv.scale (-1);
}} else if (trans != null) {
ptemp.setT (trans);
uc.toFractional (ptemp, false);
if (J.symmetry.SymmetryOperation.approx (ptemp.x) == 1) {
ptemp.x = 0;
}if (J.symmetry.SymmetryOperation.approx (ptemp.y) == 1) {
ptemp.y = 0;
}if (J.symmetry.SymmetryOperation.approx (ptemp.z) == 1) {
ptemp.z = 0;
}ftrans.setT (ptemp);
uc.toCartesian (ptemp, false);
trans.setT (ptemp);
}var ang = ang1;
J.symmetry.SymmetryOperation.approx0 (ax1);
if (isrotation) {
var pt1 =  new J.util.P3 ();
vtemp.setT (ax1);
var ang2 = ang1;
if (haveinversion) {
pt1.setT (pa1);
pt1.add (vtemp);
ang2 = Math.round (J.util.Measure.computeTorsion (ptinv, pa1, pt1, p0, true));
} else if (pitch1 == 0) {
pt1.setT (pa1);
ptemp.scaleAdd2 (1, pt1, vtemp);
ang2 = Math.round (J.util.Measure.computeTorsion (pt00, pa1, ptemp, p0, true));
} else {
ptemp.setT (pa1);
ptemp.add (vtemp);
pt1.scaleAdd2 (0.5, vtemp, pa1);
ang2 = Math.round (J.util.Measure.computeTorsion (pt00, pa1, ptemp, p0, true));
}if (ang2 != 0) ang1 = ang2;
}if (isrotation && !haveinversion && pitch1 == 0) {
if (ax1.z < 0 || ax1.z == 0 && (ax1.y < 0 || ax1.y == 0 && ax1.x < 0)) {
ax1.scale (-1);
ang1 = -ang1;
}}var info1 = "identity";
var draw1 =  new J.util.SB ();
var drawid;
if (isinversion) {
ptemp.setT (ipt);
uc.toFractional (ptemp, false);
info1 = "inversion center|" + J.symmetry.SymmetryOperation.fcoord (ptemp);
} else if (isrotation) {
if (haveinversion) {
info1 = "" + (Clazz.doubleToInt (360 / ang)) + "-bar axis";
} else if (pitch1 != 0) {
info1 = "" + (Clazz.doubleToInt (360 / ang)) + "-fold screw axis";
ptemp.setT (ax1);
uc.toFractional (ptemp, false);
info1 += "|translation: " + J.symmetry.SymmetryOperation.fcoord (ptemp);
} else {
info1 = "C" + (Clazz.doubleToInt (360 / ang)) + " axis";
}} else if (trans != null) {
var s = " " + J.symmetry.SymmetryOperation.fcoord (ftrans);
if (istranslation) {
info1 = "translation:" + s;
} else if (ismirrorplane) {
var fx = J.symmetry.SymmetryOperation.approx (ftrans.x);
var fy = J.symmetry.SymmetryOperation.approx (ftrans.y);
var fz = J.symmetry.SymmetryOperation.approx (ftrans.z);
s = " " + J.symmetry.SymmetryOperation.fcoord (ftrans);
if (fx != 0 && fy != 0 && fz != 0) info1 = "d-";
 else if (fx != 0 && fy != 0 || fy != 0 && fz != 0 || fz != 0 && fx != 0) info1 = "n-";
 else if (fx != 0) info1 = "a-";
 else if (fy != 0) info1 = "b-";
 else info1 = "c-";
info1 += "glide plane |translation:" + s;
}} else if (ismirrorplane) {
info1 = "mirror plane";
}if (haveinversion && !isinversion) {
ptemp.setT (ipt);
uc.toFractional (ptemp, false);
info1 += "|inversion center at " + J.symmetry.SymmetryOperation.fcoord (ptemp);
}var cmds = null;
if (!typeOnly) {
drawid = "\ndraw ID " + id + "_";
draw1 =  new J.util.SB ();
draw1.append ("// " + xyzOriginal + "|" + xyz + "|" + info1 + "\n");
draw1.append (drawid).append ("* delete");
J.symmetry.SymmetryOperation.drawLine (draw1, drawid + "frame1X", 0.15, pt00, pt01, "red");
J.symmetry.SymmetryOperation.drawLine (draw1, drawid + "frame1Y", 0.15, pt00, pt02, "green");
J.symmetry.SymmetryOperation.drawLine (draw1, drawid + "frame1Z", 0.15, pt00, pt03, "blue");
ptemp.setT (p1);
ptemp.sub (p0);
ptemp.scaleAdd2 (0.9, ptemp, p0);
J.symmetry.SymmetryOperation.drawLine (draw1, drawid + "frame2X", 0.2, p0, ptemp, "red");
ptemp.setT (p2);
ptemp.sub (p0);
ptemp.scaleAdd2 (0.9, ptemp, p0);
J.symmetry.SymmetryOperation.drawLine (draw1, drawid + "frame2Y", 0.2, p0, ptemp, "green");
ptemp.setT (p3);
ptemp.sub (p0);
ptemp.scaleAdd2 (0.9, ptemp, p0);
J.symmetry.SymmetryOperation.drawLine (draw1, drawid + "frame2Z", 0.2, p0, ptemp, "purple");
var color;
if (isrotation) {
var pt1 =  new J.util.P3 ();
color = "red";
ang = ang1;
var scale = 1.0;
vtemp.setT (ax1);
if (haveinversion) {
pt1.setT (pa1);
pt1.add (vtemp);
if (pitch1 == 0) {
pt1.setT (ipt);
vtemp.scale (3);
ptemp.scaleAdd2 (-1, vtemp, pa1);
draw1.append (drawid).append ("rotVector2 diameter 0.1 ").append (J.util.Escape.eP (pa1)).append (J.util.Escape.eP (ptemp)).append (" color red");
}scale = p0.distance (pt1);
draw1.append (drawid).append ("rotLine1 ").append (J.util.Escape.eP (pt1)).append (J.util.Escape.eP (ptinv)).append (" color red");
draw1.append (drawid).append ("rotLine2 ").append (J.util.Escape.eP (pt1)).append (J.util.Escape.eP (p0)).append (" color red");
} else if (pitch1 == 0) {
var isSpecial = (pt00.distance (p0) < 0.2);
if (!isSpecial) {
draw1.append (drawid).append ("rotLine1 ").append (J.util.Escape.eP (pt00)).append (J.util.Escape.eP (pa1)).append (" color red");
draw1.append (drawid).append ("rotLine2 ").append (J.util.Escape.eP (p0)).append (J.util.Escape.eP (pa1)).append (" color red");
}vtemp.scale (3);
ptemp.scaleAdd2 (-1, vtemp, pa1);
draw1.append (drawid).append ("rotVector2 diameter 0.1 ").append (J.util.Escape.eP (pa1)).append (J.util.Escape.eP (ptemp)).append (" color red");
pt1.setT (pa1);
if (pitch1 == 0 && pt00.distance (p0) < 0.2) pt1.scaleAdd2 (0.5, pt1, vtemp);
} else {
color = "orange";
draw1.append (drawid).append ("rotLine1 ").append (J.util.Escape.eP (pt00)).append (J.util.Escape.eP (pa1)).append (" color red");
ptemp.setT (pa1);
ptemp.add (vtemp);
draw1.append (drawid).append ("rotLine2 ").append (J.util.Escape.eP (p0)).append (J.util.Escape.eP (ptemp)).append (" color red");
pt1.scaleAdd2 (0.5, vtemp, pa1);
}ptemp.setT (pt1);
ptemp.add (vtemp);
if (haveinversion && pitch1 != 0) {
draw1.append (drawid).append ("rotRotLine1").append (J.util.Escape.eP (pt1)).append (J.util.Escape.eP (ptinv)).append (" color red");
draw1.append (drawid).append ("rotRotLine2").append (J.util.Escape.eP (pt1)).append (J.util.Escape.eP (p0)).append (" color red");
}draw1.append (drawid).append ("rotRotArrow arrow width 0.10 scale " + scale + " arc ").append (J.util.Escape.eP (pt1)).append (J.util.Escape.eP (ptemp));
if (haveinversion) ptemp.setT (ptinv);
 else ptemp.setT (pt00);
if (ptemp.distance (p0) < 0.1) ptemp.set (Math.random (), Math.random (), Math.random ());
draw1.append (J.util.Escape.eP (ptemp));
ptemp.set (0, ang, 0);
draw1.append (J.util.Escape.eP (ptemp)).append (" color red");
draw1.append (drawid).append ("rotVector1 vector diameter 0.1 ").append (J.util.Escape.eP (pa1)).append (J.util.Escape.eP (vtemp)).append ("color ").append (color);
}if (ismirrorplane) {
if (pt00.distance (pt0) > 0.2) draw1.append (drawid).append ("planeVector arrow ").append (J.util.Escape.eP (pt00)).append (J.util.Escape.eP (pt0)).append (" color indigo");
if (trans != null) {
ptemp.scaleAdd2 (-1, p0, p1);
ptemp.add (pt0);
J.symmetry.SymmetryOperation.drawLine (draw1, drawid + "planeFrameX", 0.15, pt0, ptemp, "translucent red");
ptemp.scaleAdd2 (-1, p0, p2);
ptemp.add (pt0);
J.symmetry.SymmetryOperation.drawLine (draw1, drawid + "planeFrameY", 0.15, pt0, ptemp, "translucent green");
ptemp.scaleAdd2 (-1, p0, p3);
ptemp.add (pt0);
J.symmetry.SymmetryOperation.drawLine (draw1, drawid + "planeFrameZ", 0.15, pt0, ptemp, "translucent blue");
}color = (trans == null ? "green" : "blue");
vtemp.setT (ax1);
vtemp.normalize ();
var w = -vtemp.x * pa1.x - vtemp.y * pa1.y - vtemp.z * pa1.z;
var plane = J.util.Point4f.new4 (vtemp.x, vtemp.y, vtemp.z, w);
var v =  new java.util.ArrayList ();
v.add (uc.getCanonicalCopy (1.05));
J.util.TriangleData.intersectPlane (plane, v, 3);
for (var i = v.size (); --i >= 0; ) {
var pts = v.get (i);
draw1.append (drawid).append ("planep").appendI (i).append (J.util.Escape.eP (pts[0])).append (J.util.Escape.eP (pts[1]));
if (pts.length == 3) draw1.append (J.util.Escape.eP (pts[2]));
draw1.append (" color translucent ").append (color);
}
if (v.size () == 0) {
ptemp.setT (pa1);
ptemp.add (ax1);
draw1.append (drawid).append ("planeCircle scale 2.0 circle ").append (J.util.Escape.eP (pa1)).append (J.util.Escape.eP (ptemp)).append (" color translucent ").append (color).append (" mesh fill");
}}if (haveinversion) {
draw1.append (drawid).append ("invPoint diameter 0.4 ").append (J.util.Escape.eP (ipt));
draw1.append (drawid).append ("invArrow arrow ").append (J.util.Escape.eP (pt00)).append (J.util.Escape.eP (ptinv)).append (" color indigo");
if (!isinversion) {
ptemp.setT (ptinv);
ptemp.add (pt00);
ptemp.sub (pt01);
J.symmetry.SymmetryOperation.drawLine (draw1, drawid + "invFrameX", 0.15, ptinv, ptemp, "translucent red");
ptemp.setT (ptinv);
ptemp.add (pt00);
ptemp.sub (pt02);
J.symmetry.SymmetryOperation.drawLine (draw1, drawid + "invFrameY", 0.15, ptinv, ptemp, "translucent green");
ptemp.setT (ptinv);
ptemp.add (pt00);
ptemp.sub (pt03);
J.symmetry.SymmetryOperation.drawLine (draw1, drawid + "invFrameZ", 0.15, ptinv, ptemp, "translucent blue");
}}if (trans != null) {
if (pt0 == null) pt0 = J.util.P3.newP (pt00);
draw1.append (drawid).append ("transVector vector ").append (J.util.Escape.eP (pt0)).append (J.util.Escape.eP (trans));
}draw1.append ("\nvar pt00 = " + J.util.Escape.eP (pt00));
draw1.append ("\nvar p0 = " + J.util.Escape.eP (p0));
draw1.append ("\nif (within(0.2,p0).length == 0) {");
draw1.append ("\nvar set2 = within(0.2,p0.uxyz.xyz)");
draw1.append ("\nif (set2) {");
draw1.append (drawid).append ("cellOffsetVector arrow @p0 @set2 color grey");
draw1.append (drawid).append ("offsetFrameX diameter 0.20 @{set2.xyz} @{set2.xyz + ").append (J.util.Escape.eP (v01)).append ("*0.9} color red");
draw1.append (drawid).append ("offsetFrameY diameter 0.20 @{set2.xyz} @{set2.xyz + ").append (J.util.Escape.eP (v02)).append ("*0.9} color green");
draw1.append (drawid).append ("offsetFrameZ diameter 0.20 @{set2.xyz} @{set2.xyz + ").append (J.util.Escape.eP (v03)).append ("*0.9} color purple");
draw1.append ("\n}}\n");
cmds = draw1.toString ();
draw1 = null;
drawid = null;
}if (trans == null) ftrans = null;
if (isrotation) {
if (haveinversion) {
} else if (pitch1 == 0) {
} else {
trans = J.util.V3.newV (ax1);
ptemp.setT (trans);
uc.toFractional (ptemp, false);
ftrans = J.util.V3.newV (ptemp);
}if (haveinversion && pitch1 != 0) {
}}if (ismirrorplane) {
if (trans != null) {
}ang1 = 0;
}if (haveinversion) {
if (isinversion) {
pa1 = null;
ax1 = null;
trans = null;
ftrans = null;
}} else if (istranslation) {
pa1 = null;
ax1 = null;
}if (ax1 != null) ax1.normalize ();
var m2 = null;
m2 = J.util.Matrix4f.newM (m);
if (vtrans.length () != 0) {
m2.m03 += vtrans.x;
m2.m13 += vtrans.y;
m2.m23 += vtrans.z;
}xyz = J.symmetry.SymmetryOperation.getXYZFromMatrix (m2, false, false, false);
return [xyz, xyzOriginal, info1, cmds, J.symmetry.SymmetryOperation.approx0 (ftrans), J.symmetry.SymmetryOperation.approx0 (trans), J.symmetry.SymmetryOperation.approx0 (ipt), J.symmetry.SymmetryOperation.approx0 (pa1), J.symmetry.SymmetryOperation.approx0 (ax1), Integer.$valueOf (ang1), m2, vtrans];
}, $fz.isPrivate = true, $fz), "J.symmetry.SymmetryOperation,~S,J.api.SymmetryInterface,J.util.P3,J.util.P3,~S");
c$.drawLine = Clazz.defineMethod (c$, "drawLine", 
($fz = function (s, id, diameter, pt0, pt1, color) {
s.append (id).append (" diameter ").appendF (diameter).append (J.util.Escape.eP (pt0)).append (J.util.Escape.eP (pt1)).append (" color ").append (color);
}, $fz.isPrivate = true, $fz), "J.util.SB,~S,~N,J.util.P3,J.util.P3,~S");
c$.fcoord = Clazz.defineMethod (c$, "fcoord", 
function (p) {
return J.symmetry.SymmetryOperation.fc (p.x) + " " + J.symmetry.SymmetryOperation.fc (p.y) + " " + J.symmetry.SymmetryOperation.fc (p.z);
}, "J.util.Tuple3f");
c$.fc = Clazz.defineMethod (c$, "fc", 
($fz = function (x) {
var xabs = Math.abs (x);
var x24 = Clazz.floatToInt (J.symmetry.SymmetryOperation.approx (xabs * 24));
var m = (x < 0 ? "-" : "");
if (x24 % 8 != 0) return m + J.symmetry.SymmetryOperation.twelfthsOf (x24 >> 1);
return (x24 == 0 ? "0" : x24 == 24 ? m + "1" : m + (Clazz.doubleToInt (x24 / 8)) + "/3");
}, $fz.isPrivate = true, $fz), "~N");
c$.approx0 = Clazz.defineMethod (c$, "approx0", 
($fz = function (pt) {
if (pt != null) {
if (Math.abs (pt.x) < 0.0001) pt.x = 0;
if (Math.abs (pt.y) < 0.0001) pt.y = 0;
if (Math.abs (pt.z) < 0.0001) pt.z = 0;
}return pt;
}, $fz.isPrivate = true, $fz), "J.util.Tuple3f");
c$.approx = Clazz.defineMethod (c$, "approx", 
($fz = function (pt) {
if (pt != null) {
pt.x = J.symmetry.SymmetryOperation.approx (pt.x);
pt.y = J.symmetry.SymmetryOperation.approx (pt.y);
pt.z = J.symmetry.SymmetryOperation.approx (pt.z);
}return pt;
}, $fz.isPrivate = true, $fz), "J.util.Tuple3f");
c$.approx = Clazz.defineMethod (c$, "approx", 
($fz = function (f) {
return J.util.Parser.approx (f, 100);
}, $fz.isPrivate = true, $fz), "~N");
c$.normalizeTranslation = Clazz.defineMethod (c$, "normalizeTranslation", 
function (operation) {
operation.m03 = (Clazz.floatToInt (operation.m03) + 12) % 12;
operation.m13 = (Clazz.floatToInt (operation.m13) + 12) % 12;
operation.m23 = (Clazz.floatToInt (operation.m23) + 12) % 12;
}, "J.util.Matrix4f");
Clazz.defineStatics (c$,
"twelfths", ["0", "1/12", "1/6", "1/4", "1/3", "5/12", "1/2", "7/12", "2/3", "3/4", "5/6", "11/12"]);
});
