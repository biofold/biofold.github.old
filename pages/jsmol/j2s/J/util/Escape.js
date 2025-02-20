Clazz.declarePackage ("J.util");
Clazz.load (null, "J.util.Escape", ["java.lang.Character", "$.Float", "java.util.ArrayList", "J.script.SV", "J.util.BSUtil", "$.Matrix3f", "$.Matrix4f", "$.P3", "$.Parser", "$.Point4f", "$.SB", "$.TextFormat"], function () {
c$ = Clazz.declareType (J.util, "Escape");
c$.escapeColor = Clazz.defineMethod (c$, "escapeColor", 
function (argb) {
return "[x" + J.util.Escape.getHexColorFromRGB (argb) + "]";
}, "~N");
c$.getHexColorFromRGB = Clazz.defineMethod (c$, "getHexColorFromRGB", 
function (argb) {
if (argb == 0) return null;
var r = "00" + Integer.toHexString ((argb >> 16) & 0xFF);
r = r.substring (r.length - 2);
var g = "00" + Integer.toHexString ((argb >> 8) & 0xFF);
g = g.substring (g.length - 2);
var b = "00" + Integer.toHexString (argb & 0xFF);
b = b.substring (b.length - 2);
return r + g + b;
}, "~N");
c$.eP = Clazz.defineMethod (c$, "eP", 
function (xyz) {
if (xyz == null) return "null";
return "{" + xyz.x + " " + xyz.y + " " + xyz.z + "}";
}, "J.util.Tuple3f");
c$.matrixToScript = Clazz.defineMethod (c$, "matrixToScript", 
function (m) {
return J.util.TextFormat.replaceAllCharacters (m.toString (), "\n\r ", "").$replace ('\t', ' ');
}, "~O");
c$.e = Clazz.defineMethod (c$, "e", 
function (x) {
if (Clazz.instanceOf (x, String)) return J.util.Escape.eS (x);
if (Clazz.instanceOf (x, java.util.List)) return J.util.Escape.eV (x);
if (Clazz.instanceOf (x, J.util.BS)) return J.util.Escape.eB (x, true);
if (Clazz.instanceOf (x, J.util.Matrix3f)) return J.util.TextFormat.simpleReplace ((x).toString (), "\t", ",\t");
if (Clazz.instanceOf (x, J.util.Matrix4f)) return J.util.TextFormat.simpleReplace ((x).toString (), "\t", ",\t");
if (Clazz.instanceOf (x, J.util.Tuple3f)) return J.util.Escape.eP (x);
if (Clazz.instanceOf (x, J.util.Point4f)) {
var xyzw = x;
return "{" + xyzw.x + " " + xyzw.y + " " + xyzw.z + " " + xyzw.w + "}";
}if (Clazz.instanceOf (x, J.util.AxisAngle4f)) {
var a = x;
return "{" + a.x + " " + a.y + " " + a.z + " " + (a.angle * 180 / 3.141592653589793) + "}";
}if (Clazz.instanceOf (x, java.util.Map)) return J.util.Escape.escapeMap (x);
if (J.util.Escape.isAS (x)) return J.util.Escape.escapeStrA (x, true);
if (J.util.Escape.isAP (x)) return J.util.Escape.escapeAP (x);
if (Clazz.instanceOf (x, Array) || Clazz.instanceOf (x, Array) || Clazz.instanceOf (x, Array) || Clazz.instanceOf (x, Array) || Clazz.instanceOf (x, Array) || Clazz.instanceOf (x, Array)) return J.util.Escape.toJSON (null, x);
return (x == null ? "null" : x.toString ());
}, "~O");
c$.isAS = Clazz.defineMethod (c$, "isAS", 
function (x) {
{
return Clazz.isAS(x);
}}, "~O");
c$.isASS = Clazz.defineMethod (c$, "isASS", 
function (x) {
{
return Clazz.isASS(x);
}}, "~O");
c$.isAP = Clazz.defineMethod (c$, "isAP", 
function (x) {
{
return Clazz.isAP(x);
}}, "~O");
c$.isAF = Clazz.defineMethod (c$, "isAF", 
function (x) {
return Clazz.instanceOf (x, Array);
}, "~O");
c$.isAFloat = Clazz.defineMethod (c$, "isAFloat", 
function (x) {
return Clazz.instanceOf (x, Array);
}, "~O");
c$.isAV = Clazz.defineMethod (c$, "isAV", 
function (x) {
return Clazz.instanceOf (x, Array);
}, "~O");
c$.isAD = Clazz.defineMethod (c$, "isAD", 
function (x) {
return Clazz.instanceOf (x, Array);
}, "~O");
c$.isAB = Clazz.defineMethod (c$, "isAB", 
function (x) {
return Clazz.instanceOf (x, Array);
}, "~O");
c$.isAI = Clazz.defineMethod (c$, "isAI", 
function (x) {
return Clazz.instanceOf (x, Array);
}, "~O");
c$.isAII = Clazz.defineMethod (c$, "isAII", 
function (x) {
{
return Clazz.isAII(x);
}}, "~O");
c$.isAFF = Clazz.defineMethod (c$, "isAFF", 
function (x) {
{
return Clazz.isAFF(x);
}}, "~O");
c$.isAFFF = Clazz.defineMethod (c$, "isAFFF", 
function (x) {
{
return Clazz.isAFFF(x);
}}, "~O");
c$.eS = Clazz.defineMethod (c$, "eS", 
function (str) {
if (str == null) return "\"\"";
var haveEscape = false;
var i = 0;
for (; i < "\\\\\tt\rr\nn\"\"".length; i += 2) if (str.indexOf ("\\\\\tt\rr\nn\"\"".charAt (i)) >= 0) {
haveEscape = true;
break;
}
if (haveEscape) while (i < "\\\\\tt\rr\nn\"\"".length) {
var pt = -1;
var ch = "\\\\\tt\rr\nn\"\"".charAt (i++);
var ch2 = "\\\\\tt\rr\nn\"\"".charAt (i++);
var sb =  new J.util.SB ();
var pt0 = 0;
while ((pt = str.indexOf (ch, pt + 1)) >= 0) {
sb.append (str.substring (pt0, pt)).appendC ('\\').appendC (ch2);
pt0 = pt + 1;
}
sb.append (str.substring (pt0, str.length));
str = sb.toString ();
}
for (i = str.length; --i >= 0; ) if (str.charCodeAt (i) > 0x7F) str = str.substring (0, i) + J.util.Escape.unicode (str.charAt (i)) + str.substring (i + 1);

return "\"" + str + "\"";
}, "~S");
c$.unicode = Clazz.defineMethod (c$, "unicode", 
($fz = function (c) {
var s = "0000" + Integer.toHexString (c.charCodeAt (0));
return "\\u" + s.substring (s.length - 4);
}, $fz.isPrivate = true, $fz), "~S");
c$.eV = Clazz.defineMethod (c$, "eV", 
function (list) {
if (list == null) return J.util.Escape.eS ("");
var s =  new J.util.SB ();
s.append ("[");
for (var i = 0; i < list.size (); i++) {
if (i > 0) s.append (", ");
s.append (J.util.Escape.escapeNice (list.get (i).asString ()));
}
s.append ("]");
return s.toString ();
}, "java.util.ArrayList");
c$.escapeMap = Clazz.defineMethod (c$, "escapeMap", 
function (ht) {
var sb =  new J.util.SB ();
sb.append ("{ ");
var sep = "";
for (var entry, $entry = ht.entrySet ().iterator (); $entry.hasNext () && ((entry = $entry.next ()) || true);) {
var key = entry.getKey ();
sb.append (sep).append (J.util.Escape.eS (key)).appendC (':');
var val = entry.getValue ();
if (!(Clazz.instanceOf (val, J.script.SV))) val = J.script.SV.getVariable (val);
sb.append ((val).escape ());
sep = ",";
}
sb.append (" }");
return sb.toString ();
}, "java.util.Map");
c$.escapeFloatA = Clazz.defineMethod (c$, "escapeFloatA", 
function (f, asArray) {
if (asArray) return J.util.Escape.toJSON (null, f);
var sb =  new J.util.SB ();
for (var i = 0; i < f.length; i++) {
if (i > 0) sb.appendC ('\n');
sb.appendF (f[i]);
}
return sb.toString ();
}, "~A,~B");
c$.escapeFloatAA = Clazz.defineMethod (c$, "escapeFloatAA", 
function (f, addSemi) {
var sb =  new J.util.SB ();
var eol = (addSemi ? ";\n" : "\n");
for (var i = 0; i < f.length; i++) if (f[i] != null) {
if (i > 0) sb.append (eol);
for (var j = 0; j < f[i].length; j++) sb.appendF (f[i][j]).appendC ('\t');

}
return sb.toString ();
}, "~A,~B");
c$.escapeFloatAAA = Clazz.defineMethod (c$, "escapeFloatAAA", 
function (f, addSemi) {
var sb =  new J.util.SB ();
var eol = (addSemi ? ";\n" : "\n");
if (f[0] == null || f[0][0] == null) return "0 0 0" + eol;
sb.appendI (f.length).append (" ").appendI (f[0].length).append (" ").appendI (f[0][0].length);
for (var i = 0; i < f.length; i++) if (f[i] != null) {
sb.append (eol);
for (var j = 0; j < f[i].length; j++) if (f[i][j] != null) {
sb.append (eol);
for (var k = 0; k < f[i][j].length; k++) sb.appendF (f[i][j][k]).appendC ('\t');

}
}
return sb.toString ();
}, "~A,~B");
c$.escapeStrA = Clazz.defineMethod (c$, "escapeStrA", 
function (list, nicely) {
if (list == null) return J.util.Escape.eS ("");
var s =  new J.util.SB ();
s.append ("[");
for (var i = 0; i < list.length; i++) {
if (i > 0) s.append (", ");
s.append (nicely ? J.util.Escape.escapeNice (list[i]) : J.util.Escape.eS (list[i]));
}
s.append ("]");
return s.toString ();
}, "~A,~B");
c$.escapeAI = Clazz.defineMethod (c$, "escapeAI", 
function (x) {
if (x == null) return J.util.Escape.eS ("");
var s =  new J.util.SB ();
s.append ("[");
var ilist = x;
for (var i = 0; i < ilist.length; i++) {
if (i > 0) s.append (", ");
s.appendI (ilist[i]);
}
return s.append ("]").toString ();
}, "~O");
c$.escapeAF = Clazz.defineMethod (c$, "escapeAF", 
function (x) {
if (x == null) return J.util.Escape.eS ("");
var s =  new J.util.SB ();
s.append ("[");
var flist = x;
for (var i = 0; i < flist.length; i++) {
if (i > 0) s.append (", ");
s.appendF (flist[i]);
}
return s.append ("]").toString ();
}, "~O");
c$.escapeAP = Clazz.defineMethod (c$, "escapeAP", 
function (x) {
if (x == null) return J.util.Escape.eS ("");
var s =  new J.util.SB ();
s.append ("[");
var plist = x;
for (var i = 0; i < plist.length; i++) {
if (i > 0) s.append (", ");
s.append (J.util.Escape.eP (plist[i]));
}
return s.append ("]").toString ();
}, "~O");
c$.escapeNice = Clazz.defineMethod (c$, "escapeNice", 
($fz = function (s) {
if (s == null) return "null";
var f = J.util.Parser.parseFloatStrict (s);
return (Float.isNaN (f) ? J.util.Escape.eS (s) : s);
}, $fz.isPrivate = true, $fz), "~S");
c$.unescapePointOrBitsetOrMatrixOrArray = Clazz.defineMethod (c$, "unescapePointOrBitsetOrMatrixOrArray", 
function (s) {
if (s.charAt (0) == '{') return J.util.Escape.uP (s);
if ((J.util.Escape.isStringArray (s) || s.startsWith ("[{") && s.indexOf ("[{") == s.lastIndexOf ("[{")) && s.indexOf (',') < 0 && s.indexOf ('.') < 0 && s.indexOf ('-') < 0) return J.util.Escape.uB (s);
if (s.startsWith ("[[")) return J.util.Escape.unescapeMatrix (s);
return s;
}, "~S");
c$.isStringArray = Clazz.defineMethod (c$, "isStringArray", 
function (s) {
return s.startsWith ("({") && s.lastIndexOf ("({") == 0 && s.indexOf ("})") == s.length - 2;
}, "~S");
c$.uP = Clazz.defineMethod (c$, "uP", 
function (strPoint) {
if (strPoint == null || strPoint.length == 0) return strPoint;
var str = strPoint.$replace ('\n', ' ').trim ();
if (str.charAt (0) != '{' || str.charAt (str.length - 1) != '}') return strPoint;
var points =  Clazz.newFloatArray (5, 0);
var nPoints = 0;
str = str.substring (1, str.length - 1);
var next =  Clazz.newIntArray (1, 0);
for (; nPoints < 5; nPoints++) {
points[nPoints] = J.util.Parser.parseFloatNext (str, next);
if (Float.isNaN (points[nPoints])) {
if (next[0] >= str.length || str.charAt (next[0]) != ',') break;
next[0]++;
nPoints--;
}}
if (nPoints == 3) return J.util.P3.new3 (points[0], points[1], points[2]);
if (nPoints == 4) return J.util.Point4f.new4 (points[0], points[1], points[2], points[3]);
return strPoint;
}, "~S");
c$.uB = Clazz.defineMethod (c$, "uB", 
function (str) {
var ch;
var len;
if (str == null || (len = (str = str.trim ()).length) < 4 || str.equalsIgnoreCase ("({null})") || (ch = str.charAt (0)) != '(' && ch != '[' || str.charAt (len - 1) != (ch == '(' ? ')' : ']') || str.charAt (1) != '{' || str.indexOf ('}') != len - 2) return null;
len -= 2;
for (var i = len; --i >= 2; ) if (!Character.isDigit (ch = str.charAt (i)) && ch != ' ' && ch != '\t' && ch != ':') return null;

var lastN = len;
while (Character.isDigit (str.charAt (--lastN))) {
}
if (++lastN == len) lastN = 0;
 else try {
lastN = Integer.parseInt (str.substring (lastN, len));
} catch (e) {
if (Clazz.exceptionOf (e, NumberFormatException)) {
return null;
} else {
throw e;
}
}
var bs = J.util.BSUtil.newBitSet (lastN);
lastN = -1;
var iPrev = -1;
var iThis = -2;
for (var i = 2; i <= len; i++) {
switch (ch = str.charAt (i)) {
case '\t':
case ' ':
case '}':
if (iThis < 0) break;
if (iThis < lastN) return null;
lastN = iThis;
if (iPrev < 0) iPrev = iThis;
bs.setBits (iPrev, iThis + 1);
iPrev = -1;
iThis = -2;
break;
case ':':
iPrev = lastN = iThis;
iThis = -2;
break;
default:
if (Character.isDigit (ch)) {
if (iThis < 0) iThis = 0;
iThis = (iThis << 3) + (iThis << 1) + (ch.charCodeAt (0) - 48);
}}
}
return (iPrev >= 0 ? null : bs);
}, "~S");
c$.unescapeMatrix = Clazz.defineMethod (c$, "unescapeMatrix", 
function (strMatrix) {
if (strMatrix == null || strMatrix.length == 0) return strMatrix;
var str = strMatrix.$replace ('\n', ' ').trim ();
if (str.lastIndexOf ("[[") != 0 || str.indexOf ("]]") != str.length - 2) return strMatrix;
var points =  Clazz.newFloatArray (16, 0);
str = str.substring (2, str.length - 2).$replace ('[', ' ').$replace (']', ' ').$replace (',', ' ');
var next =  Clazz.newIntArray (1, 0);
var nPoints = 0;
for (; nPoints < 16; nPoints++) {
points[nPoints] = J.util.Parser.parseFloatNext (str, next);
if (Float.isNaN (points[nPoints])) {
break;
}}
if (!Float.isNaN (J.util.Parser.parseFloatNext (str, next))) return strMatrix;
if (nPoints == 9) return J.util.Matrix3f.newA (points);
if (nPoints == 16) return J.util.Matrix4f.newA (points);
return strMatrix;
}, "~S");
c$.eB = Clazz.defineMethod (c$, "eB", 
function (bs, isAtoms) {
var chOpen = (isAtoms ? '(' : '[');
var chClose = (isAtoms ? ')' : ']');
if (bs == null) return chOpen + "{}" + chClose;
var s =  new J.util.SB ();
s.append (chOpen + "{");
var imax = bs.length ();
var iLast = -1;
var iFirst = -2;
var i = -1;
while (++i <= imax) {
var isSet = bs.get (i);
if (i == imax || iLast >= 0 && !isSet) {
if (iLast >= 0 && iFirst != iLast) s.append ((iFirst == iLast - 1 ? " " : ":") + iLast);
if (i == imax) break;
iLast = -1;
}if (bs.get (i)) {
if (iLast < 0) {
s.append ((iFirst == -2 ? "" : " ") + i);
iFirst = i;
}iLast = i;
}}
s.append ("}").appendC (chClose);
return s.toString ();
}, "J.util.BS,~B");
c$.packageJSONSb = Clazz.defineMethod (c$, "packageJSONSb", 
($fz = function (infoType, sb) {
return J.util.Escape.packageJSON (infoType, sb.toString ());
}, $fz.isPrivate = true, $fz), "~S,J.util.SB");
c$.packageJSON = Clazz.defineMethod (c$, "packageJSON", 
($fz = function (infoType, info) {
if (infoType == null) return info;
return "\"" + infoType + "\": " + info;
}, $fz.isPrivate = true, $fz), "~S,~S");
c$.fixString = Clazz.defineMethod (c$, "fixString", 
($fz = function (s) {
if (s == null || s.indexOf ("{\"") == 0) return s;
s = J.util.TextFormat.simpleReplace (s, "\"", "''");
s = J.util.TextFormat.simpleReplace (s, "\n", " | ");
return "\"" + s + "\"";
}, $fz.isPrivate = true, $fz), "~S");
c$.toJSON = Clazz.defineMethod (c$, "toJSON", 
function (infoType, info) {
var sb =  new J.util.SB ();
var sep = "";
if (info == null) return J.util.Escape.packageJSON (infoType, Clazz.castNullAs ("String"));
if (Clazz.instanceOf (info, Integer) || Clazz.instanceOf (info, Float) || Clazz.instanceOf (info, Double)) return J.util.Escape.packageJSON (infoType, info.toString ());
if (Clazz.instanceOf (info, String)) return J.util.Escape.packageJSON (infoType, J.util.Escape.fixString (info));
if (J.util.Escape.isAS (info)) {
sb.append ("[");
var imax = (info).length;
for (var i = 0; i < imax; i++) {
sb.append (sep).append (J.util.Escape.fixString ((info)[i]));
sep = ",";
}
sb.append ("]");
return J.util.Escape.packageJSONSb (infoType, sb);
}if (J.util.Escape.isAI (info)) {
sb.append ("[");
var imax = (info).length;
for (var i = 0; i < imax; i++) {
sb.append (sep).appendI ((info)[i]);
sep = ",";
}
sb.append ("]");
return J.util.Escape.packageJSONSb (infoType, sb);
}if (J.util.Escape.isAF (info)) {
sb.append ("[");
var imax = (info).length;
for (var i = 0; i < imax; i++) {
sb.append (sep).appendF ((info)[i]);
sep = ",";
}
sb.append ("]");
return J.util.Escape.packageJSONSb (infoType, sb);
}if (J.util.Escape.isAD (info)) {
sb.append ("[");
var imax = (info).length;
for (var i = 0; i < imax; i++) {
sb.append (sep).appendD ((info)[i]);
sep = ",";
}
sb.append ("]");
return J.util.Escape.packageJSONSb (infoType, sb);
}if (J.util.Escape.isAP (info)) {
sb.append ("[");
var imax = (info).length;
for (var i = 0; i < imax; i++) {
sb.append (sep);
J.util.Escape.addJsonTuple (sb, (info)[i]);
sep = ",";
}
sb.append ("]");
return J.util.Escape.packageJSONSb (infoType, sb);
}if (J.util.Escape.isASS (info)) {
sb.append ("[");
var imax = (info).length;
for (var i = 0; i < imax; i++) {
sb.append (sep).append (J.util.Escape.toJSON (null, (info)[i]));
sep = ",";
}
sb.append ("]");
return J.util.Escape.packageJSONSb (infoType, sb);
}if (J.util.Escape.isAII (info)) {
sb.append ("[");
var imax = (info).length;
for (var i = 0; i < imax; i++) {
sb.append (sep).append (J.util.Escape.toJSON (null, (info)[i]));
sep = ",";
}
sb.append ("]");
return J.util.Escape.packageJSONSb (infoType, sb);
}if (J.util.Escape.isAFF (info)) {
sb.append ("[");
var imax = (info).length;
for (var i = 0; i < imax; i++) {
sb.append (sep).append (J.util.Escape.toJSON (null, (info)[i]));
sep = ",";
}
sb.append ("]");
return J.util.Escape.packageJSONSb (infoType, sb);
}if (J.util.Escape.isAFFF (info)) {
sb.append ("[");
var imax = (info).length;
for (var i = 0; i < imax; i++) {
sb.append (sep).append (J.util.Escape.toJSON (null, (info)[i]));
sep = ",";
}
sb.append ("]");
return J.util.Escape.packageJSONSb (infoType, sb);
}if (Clazz.instanceOf (info, java.util.List)) {
sb.append ("[ ");
var imax = (info).size ();
for (var i = 0; i < imax; i++) {
sb.append (sep).append (J.util.Escape.toJSON (null, (info).get (i)));
sep = ",";
}
sb.append (" ]");
return J.util.Escape.packageJSONSb (infoType, sb);
}if (Clazz.instanceOf (info, J.util.Matrix4f)) {
var x =  Clazz.newFloatArray (4, 0);
var m4 = info;
sb.appendC ('[');
for (var i = 0; i < 4; i++) {
if (i > 0) sb.appendC (',');
m4.getRow (i, x);
sb.append (J.util.Escape.toJSON (null, x));
}
sb.appendC (']');
return J.util.Escape.packageJSONSb (infoType, sb);
}if (Clazz.instanceOf (info, J.util.Matrix3f)) {
var x =  Clazz.newFloatArray (3, 0);
var m3 = info;
sb.appendC ('[');
for (var i = 0; i < 3; i++) {
if (i > 0) sb.appendC (',');
m3.getRow (i, x);
sb.append (J.util.Escape.toJSON (null, x));
}
sb.appendC (']');
return J.util.Escape.packageJSONSb (infoType, sb);
}if (Clazz.instanceOf (info, J.util.Tuple3f)) {
J.util.Escape.addJsonTuple (sb, info);
return J.util.Escape.packageJSONSb (infoType, sb);
}if (Clazz.instanceOf (info, J.util.AxisAngle4f)) {
sb.append ("[").appendF ((info).x).append (",").appendF ((info).y).append (",").appendF ((info).z).append (",").appendF (((info).angle * 180 / 3.141592653589793)).append ("]");
return J.util.Escape.packageJSONSb (infoType, sb);
}if (Clazz.instanceOf (info, J.util.Point4f)) {
sb.append ("[").appendF ((info).x).append (",").appendF ((info).y).append (",").appendF ((info).z).append (",").appendF ((info).w).append ("]");
return J.util.Escape.packageJSONSb (infoType, sb);
}if (Clazz.instanceOf (info, java.util.Map)) {
sb.append ("{ ");
var e = (info).keySet ().iterator ();
while (e.hasNext ()) {
var key = e.next ();
sb.append (sep).append (J.util.Escape.packageJSON (key, J.util.Escape.toJSON (null, (info).get (key))));
sep = ",";
}
sb.append (" }");
return J.util.Escape.packageJSONSb (infoType, sb);
}return J.util.Escape.packageJSON (infoType, J.util.Escape.fixString (info.toString ()));
}, "~S,~O");
c$.addJsonTuple = Clazz.defineMethod (c$, "addJsonTuple", 
($fz = function (sb, pt) {
sb.append ("[").appendF (pt.x).append (",").appendF (pt.y).append (",").appendF (pt.z).append ("]");
}, $fz.isPrivate = true, $fz), "J.util.SB,J.util.Tuple3f");
c$.toReadable = Clazz.defineMethod (c$, "toReadable", 
function (name, info) {
var sb =  new J.util.SB ();
var sep = "";
if (info == null) return "null";
if (Clazz.instanceOf (info, String)) return J.util.Escape.packageReadable (name, null, J.util.Escape.eS (info));
if (J.util.Escape.isAS (info)) {
sb.append ("[");
var imax = (info).length;
for (var i = 0; i < imax; i++) {
sb.append (sep).append (J.util.Escape.eS ((info)[i]));
sep = ",";
}
sb.append ("]");
return J.util.Escape.packageReadableSb (name, "String[" + imax + "]", sb);
}if (J.util.Escape.isAI (info)) {
sb.append ("[");
var imax = (info).length;
for (var i = 0; i < imax; i++) {
sb.append (sep).appendI ((info)[i]);
sep = ",";
}
sb.append ("]");
return J.util.Escape.packageReadableSb (name, "int[" + imax + "]", sb);
}if (J.util.Escape.isAF (info)) {
sb.append ("[");
var imax = (info).length;
for (var i = 0; i < imax; i++) {
sb.append (sep).appendF ((info)[i]);
sep = ",";
}
sb.append ("]");
return J.util.Escape.packageReadableSb (name, "float[" + imax + "]", sb);
}if (J.util.Escape.isAP (info)) {
sb.append ("[");
var imax = (info).length;
for (var i = 0; i < imax; i++) {
sb.append (sep).append (J.util.Escape.eP ((info)[i]));
sep = ",";
}
sb.append ("]");
return J.util.Escape.packageReadableSb (name, "point3f[" + imax + "]", sb);
}if (J.util.Escape.isASS (info)) {
sb.append ("[");
var imax = (info).length;
for (var i = 0; i < imax; i++) {
sb.append (sep).append (J.util.Escape.toReadable (null, (info)[i]));
sep = ",\n";
}
sb.append ("]");
return J.util.Escape.packageReadableSb (name, "String[" + imax + "][]", sb);
}if (J.util.Escape.isAII (info)) {
sb.append ("[");
var imax = (info).length;
for (var i = 0; i < imax; i++) {
sb.append (sep).append (J.util.Escape.toReadable (null, (info)[i]));
sep = ",";
}
sb.append ("]");
return J.util.Escape.packageReadableSb (name, "int[" + imax + "][]", sb);
}if (J.util.Escape.isAFF (info)) {
sb.append ("[\n");
var imax = (info).length;
for (var i = 0; i < imax; i++) {
sb.append (sep).append (J.util.Escape.toReadable (null, (info)[i]));
sep = ",\n";
}
sb.append ("]");
return J.util.Escape.packageReadableSb (name, "float[][]", sb);
}if (Clazz.instanceOf (info, java.util.List)) {
var imax = (info).size ();
for (var i = 0; i < imax; i++) {
sb.append (J.util.Escape.toReadable (name + "[" + (i + 1) + "]", (info).get (i)));
}
return J.util.Escape.packageReadableSb (name, "List[" + imax + "]", sb);
}if (Clazz.instanceOf (info, J.util.Matrix3f) || Clazz.instanceOf (info, J.util.Tuple3f) || Clazz.instanceOf (info, J.util.Point4f) || Clazz.instanceOf (info, J.util.AxisAngle4f)) {
sb.append (J.util.Escape.e (info));
return J.util.Escape.packageReadableSb (name, null, sb);
}if (Clazz.instanceOf (info, java.util.Map)) {
var e = (info).keySet ().iterator ();
while (e.hasNext ()) {
var key = e.next ();
sb.append (J.util.Escape.toReadable ((name == null ? "" : name + ".") + key, (info).get (key)));
}
return sb.toString ();
}return J.util.Escape.packageReadable (name, null, info.toString ());
}, "~S,~O");
c$.packageReadableSb = Clazz.defineMethod (c$, "packageReadableSb", 
($fz = function (infoName, infoType, sb) {
return J.util.Escape.packageReadable (infoName, infoType, sb.toString ());
}, $fz.isPrivate = true, $fz), "~S,~S,J.util.SB");
c$.packageReadable = Clazz.defineMethod (c$, "packageReadable", 
($fz = function (infoName, infoType, info) {
var s = (infoType == null ? "" : infoType + "\t");
if (infoName == null) return s + info;
return "\n" + infoName + "\t" + (infoType == null ? "" : "*" + infoType + "\t") + info;
}, $fz.isPrivate = true, $fz), "~S,~S,~S");
c$.escapeModelFileNumber = Clazz.defineMethod (c$, "escapeModelFileNumber", 
function (iv) {
return "" + (Clazz.doubleToInt (iv / 1000000)) + "." + (iv % 1000000);
}, "~N");
c$.encapsulateData = Clazz.defineMethod (c$, "encapsulateData", 
function (name, data, depth) {
return "  DATA \"" + name + "\"\n" + (depth == 2 ? J.util.Escape.escapeFloatAA (data, true) + ";\n" : depth == 3 ? J.util.Escape.escapeFloatAAA (data, true) + ";\n" : data) + "    END \"" + name + "\";\n";
}, "~S,~O,~N");
c$.unescapeUnicode = Clazz.defineMethod (c$, "unescapeUnicode", 
function (s) {
var ichMax = s.length;
var sb = J.util.SB.newN (ichMax);
var ich = 0;
while (ich < ichMax) {
var ch = s.charAt (ich++);
if (ch == '\\' && ich < ichMax) {
ch = s.charAt (ich++);
switch (ch) {
case 'u':
if (ich < ichMax) {
var unicode = 0;
for (var k = 4; --k >= 0 && ich < ichMax; ) {
var chT = s.charAt (ich);
var hexit = J.util.Escape.getHexitValue (chT);
if (hexit < 0) break;
unicode <<= 4;
unicode += hexit;
++ich;
}
ch = String.fromCharCode (unicode);
}}
}sb.appendC (ch);
}
return sb.toString ();
}, "~S");
c$.getHexitValue = Clazz.defineMethod (c$, "getHexitValue", 
function (ch) {
if (ch >= '0' && ch <= '9') return ch.charCodeAt (0) - 48;
 else if (ch >= 'a' && ch <= 'f') return 10 + ch.charCodeAt (0) - 97;
 else if (ch >= 'A' && ch <= 'F') return 10 + ch.charCodeAt (0) - 65;
 else return -1;
}, "~S");
c$.unescapeStringArray = Clazz.defineMethod (c$, "unescapeStringArray", 
function (data) {
if (data == null || !data.startsWith ("[") || !data.endsWith ("]")) return null;
var v =  new java.util.ArrayList ();
var next =  Clazz.newIntArray (1, 0);
next[0] = 1;
while (next[0] < data.length) {
var s = J.util.Parser.getQuotedStringNext (data, next);
if (s == null) return null;
v.add (s);
while (next[0] < data.length && data.charAt (next[0]) != '"') next[0]++;

}
return v.toArray ( new Array (v.size ()));
}, "~S");
c$.escapeUrl = Clazz.defineMethod (c$, "escapeUrl", 
function (url) {
url = J.util.TextFormat.simpleReplace (url, "\n", "");
url = J.util.TextFormat.simpleReplace (url, "%", "%25");
url = J.util.TextFormat.simpleReplace (url, "[", "%5B");
url = J.util.TextFormat.simpleReplace (url, "]", "%5D");
url = J.util.TextFormat.simpleReplace (url, " ", "%20");
return url;
}, "~S");
Clazz.defineStatics (c$,
"escapable", "\\\\\tt\rr\nn\"\"");
});
