Clazz.declarePackage ("J.util");
Clazz.load (null, "J.util.Parser", ["java.lang.Float", "J.util.ArrayUtil", "$.Logger", "$.TextFormat"], function () {
c$ = Clazz.declareType (J.util, "Parser");
c$.parseStringInfestedFloatArray = Clazz.defineMethod (c$, "parseStringInfestedFloatArray", 
function (str, bs, data) {
return J.util.Parser.parseFloatArrayBsData (J.util.Parser.getTokens (str), bs, data);
}, "~S,J.util.BS,~A");
c$.parseFloatArray = Clazz.defineMethod (c$, "parseFloatArray", 
function (str) {
return J.util.Parser.parseFloatArrayNext (str,  Clazz.newIntArray (1, 0));
}, "~S");
c$.parseFloatArrayNext = Clazz.defineMethod (c$, "parseFloatArrayNext", 
function (str, next) {
var pt = next[0];
if (pt < 0) return  Clazz.newFloatArray (0, 0);
pt = str.indexOf ("[", pt);
if (pt >= 0) str = str.substring (pt + 1);
next[0] = pt + 1;
pt = str.indexOf ("]");
if (pt < 0) pt = str.length;
 else str = str.substring (0, pt);
next[0] += pt + 1;
var tokens = J.util.Parser.getTokens (str);
var f =  Clazz.newFloatArray (tokens.length, 0);
var n = J.util.Parser.parseFloatArrayBsData (tokens, null, f);
for (var i = n; i < f.length; i++) f[i] = NaN;

return f;
}, "~S,~A");
c$.parseFloatArrayBsData = Clazz.defineMethod (c$, "parseFloatArrayBsData", 
function (tokens, bs, data) {
var len = data.length;
var nTokens = tokens.length;
var n = 0;
var max = 0;
var haveBitSet = (bs != null);
for (var i = (haveBitSet ? bs.nextSetBit (0) : 0); i >= 0 && i < len && n < nTokens; i = (haveBitSet ? bs.nextSetBit (i + 1) : i + 1)) {
var f;
while (Float.isNaN (f = J.util.Parser.parseFloatStr (tokens[n++])) && n < nTokens) {
}
if (!Float.isNaN (f)) data[(max = i)] = f;
if (n == nTokens) break;
}
return max + 1;
}, "~A,J.util.BS,~A");
c$.fixDataString = Clazz.defineMethod (c$, "fixDataString", 
($fz = function (str) {
str = str.$replace (';', str.indexOf ('\n') < 0 ? '\n' : ' ');
str = J.util.TextFormat.trim (str, "\n \t");
str = J.util.TextFormat.simpleReplace (str, "\n ", "\n");
str = J.util.TextFormat.simpleReplace (str, "\n\n", "\n");
return str;
}, $fz.isPrivate = true, $fz), "~S");
c$.parseFloatArray2d = Clazz.defineMethod (c$, "parseFloatArray2d", 
function (str) {
str = J.util.Parser.fixDataString (str);
var lines = J.util.Parser.markLines (str, '\n');
var nLines = lines.length;
var data = J.util.ArrayUtil.newFloat2 (nLines);
for (var iLine = 0, pt = 0; iLine < nLines; pt = lines[iLine++]) {
var tokens = J.util.Parser.getTokens (str.substring (pt, lines[iLine]));
J.util.Parser.parseFloatArrayData (tokens, data[iLine] =  Clazz.newFloatArray (tokens.length, 0));
}
return data;
}, "~S");
c$.parseFloatArray3d = Clazz.defineMethod (c$, "parseFloatArray3d", 
function (str) {
str = J.util.Parser.fixDataString (str);
var lines = J.util.Parser.markLines (str, '\n');
var nLines = lines.length;
var tokens = J.util.Parser.getTokens (str.substring (0, lines[0]));
if (tokens.length != 3) return  Clazz.newFloatArray (0, 0, 0, 0);
var nX = J.util.Parser.parseInt (tokens[0]);
var nY = J.util.Parser.parseInt (tokens[1]);
var nZ = J.util.Parser.parseInt (tokens[2]);
if (nX < 1 || nY < 1 || nZ < 1) return  Clazz.newFloatArray (1, 1, 1, 0);
var data = J.util.ArrayUtil.newFloat3 (nX, nY);
var iX = 0;
var iY = 0;
for (var iLine = 1, pt = lines[0]; iLine < nLines && iX < nX; pt = lines[iLine++]) {
tokens = J.util.Parser.getTokens (str.substring (pt, lines[iLine]));
if (tokens.length < nZ) continue;
J.util.Parser.parseFloatArrayData (tokens, data[iX][iY] =  Clazz.newFloatArray (tokens.length, 0));
if (++iY == nY) {
iX++;
iY = 0;
}}
if (iX != nX) {
J.util.Logger.info ("Error reading 3D data -- nX = " + nX + ", but only " + iX + " blocks read");
return  Clazz.newFloatArray (1, 1, 1, 0);
}return data;
}, "~S");
c$.setSelectedFloats = Clazz.defineMethod (c$, "setSelectedFloats", 
function (f, bs, data) {
var isAll = (bs == null);
var i0 = (isAll ? 0 : bs.nextSetBit (0));
for (var i = i0; i >= 0 && i < data.length; i = (isAll ? i + 1 : bs.nextSetBit (i + 1))) data[i] = f;

}, "~N,J.util.BS,~A");
c$.extractData = Clazz.defineMethod (c$, "extractData", 
function (data, field, nBytes, firstLine) {
return J.util.Parser.parseFloatArrayFromMatchAndField (data, null, 0, 0, null, field, nBytes, null, firstLine);
}, "~S,~N,~N,~N");
c$.parseFloatArrayFromMatchAndField = Clazz.defineMethod (c$, "parseFloatArrayFromMatchAndField", 
function (str, bs, fieldMatch, fieldMatchColumnCount, matchData, field, fieldColumnCount, data, firstLine) {
var f;
var i = -1;
var isMatch = (matchData != null);
var lines = J.util.Parser.markLines (str, (str.indexOf ('\n') >= 0 ? '\n' : ';'));
var iLine = (firstLine <= 1 || firstLine >= lines.length ? 0 : firstLine - 1);
var pt = (iLine == 0 ? 0 : lines[iLine - 1]);
var nLines = lines.length;
if (data == null) data =  Clazz.newFloatArray (nLines - iLine, 0);
var len = data.length;
var minLen = (fieldColumnCount <= 0 ? Math.max (field, fieldMatch) : Math.max (field + fieldColumnCount, fieldMatch + fieldMatchColumnCount) - 1);
var haveBitSet = (bs != null);
for (; iLine < nLines; iLine++) {
var line = str.substring (pt, lines[iLine]).trim ();
pt = lines[iLine];
var tokens = (fieldColumnCount <= 0 ? J.util.Parser.getTokens (line) : null);
if (fieldColumnCount <= 0) {
if (tokens.length < minLen || Float.isNaN (f = J.util.Parser.parseFloatStr (tokens[field - 1]))) continue;
} else {
if (line.length < minLen || Float.isNaN (f = J.util.Parser.parseFloatStr (line.substring (field - 1, field + fieldColumnCount - 1)))) continue;
}var iData;
if (isMatch) {
iData = J.util.Parser.parseInt (tokens == null ? line.substring (fieldMatch - 1, fieldMatch + fieldMatchColumnCount - 1) : tokens[fieldMatch - 1]);
if (iData == -2147483648 || iData < 0 || iData >= len || (iData = matchData[iData]) < 0) continue;
if (haveBitSet) bs.set (iData);
} else {
if (haveBitSet) i = bs.nextSetBit (i + 1);
 else i++;
if (i < 0 || i >= len) return data;
iData = i;
}data[iData] = f;
}
return data;
}, "~S,J.util.BS,~N,~N,~A,~N,~N,~A,~N");
c$.parseFloatArrayData = Clazz.defineMethod (c$, "parseFloatArrayData", 
function (tokens, data) {
J.util.Parser.parseFloatArrayDataN (tokens, data, data.length);
}, "~A,~A");
c$.parseFloatArrayDataN = Clazz.defineMethod (c$, "parseFloatArrayDataN", 
function (tokens, data, nData) {
for (var i = nData; --i >= 0; ) data[i] = (i >= tokens.length ? NaN : J.util.Parser.parseFloatStr (tokens[i]));

}, "~A,~A,~N");
c$.parseFloatStr = Clazz.defineMethod (c$, "parseFloatStr", 
function (str) {
return J.util.Parser.parseFloatNext (str, [0]);
}, "~S");
c$.parseFloatStrict = Clazz.defineMethod (c$, "parseFloatStrict", 
function (str) {
var cch = str.length;
if (cch == 0) return NaN;
return J.util.Parser.parseFloatChecked (str, cch, [0], true);
}, "~S");
c$.parseInt = Clazz.defineMethod (c$, "parseInt", 
function (str) {
return J.util.Parser.parseIntNext (str, [0]);
}, "~S");
c$.getTokens = Clazz.defineMethod (c$, "getTokens", 
function (line) {
return J.util.Parser.getTokensAt (line, 0);
}, "~S");
c$.parseToken = Clazz.defineMethod (c$, "parseToken", 
function (str) {
return J.util.Parser.parseTokenNext (str, [0]);
}, "~S");
c$.parseTrimmed = Clazz.defineMethod (c$, "parseTrimmed", 
function (str) {
return J.util.Parser.parseTrimmedRange (str, 0, str.length);
}, "~S");
c$.parseTrimmedAt = Clazz.defineMethod (c$, "parseTrimmedAt", 
function (str, ichStart) {
return J.util.Parser.parseTrimmedRange (str, ichStart, str.length);
}, "~S,~N");
c$.parseTrimmedRange = Clazz.defineMethod (c$, "parseTrimmedRange", 
function (str, ichStart, ichMax) {
var cch = str.length;
if (ichMax < cch) cch = ichMax;
if (cch < ichStart) return "";
return J.util.Parser.parseTrimmedChecked (str, ichStart, cch);
}, "~S,~N,~N");
c$.markLines = Clazz.defineMethod (c$, "markLines", 
function (data, eol) {
var nLines = 0;
for (var i = data.length; --i >= 0; ) if (data.charAt (i) == eol) nLines++;

var lines =  Clazz.newIntArray (nLines + 1, 0);
lines[nLines--] = data.length;
for (var i = data.length; --i >= 0; ) if (data.charAt (i) == eol) lines[nLines--] = i + 1;

return lines;
}, "~S,~S");
c$.parseFloatNext = Clazz.defineMethod (c$, "parseFloatNext", 
function (str, next) {
var cch = str.length;
if (next[0] < 0 || next[0] >= cch) return NaN;
return J.util.Parser.parseFloatChecked (str, cch, next, false);
}, "~S,~A");
c$.parseFloatRange = Clazz.defineMethod (c$, "parseFloatRange", 
function (str, ichMax, next) {
var cch = str.length;
if (ichMax > cch) ichMax = cch;
if (next[0] < 0 || next[0] >= ichMax) return NaN;
return J.util.Parser.parseFloatChecked (str, ichMax, next, false);
}, "~S,~N,~A");
c$.parseFloatChecked = Clazz.defineMethod (c$, "parseFloatChecked", 
($fz = function (str, ichMax, next, isStrict) {
var digitSeen = false;
var value = 0;
var ich = next[0];
if (isStrict && str.indexOf ('\n') != str.lastIndexOf ('\n')) return NaN;
while (ich < ichMax && J.util.Parser.isWhiteSpace (str, ich)) ++ich;

var negative = false;
if (ich < ichMax && str.charAt (ich) == '-') {
++ich;
negative = true;
}var ch = String.fromCharCode (0);
while (ich < ichMax && (ch = str.charAt (ich)) >= '0' && ch <= '9') {
value = value * 10 + (ch.charCodeAt (0) - 48);
++ich;
digitSeen = true;
}
var isDecimal = false;
if (ch == '.') {
isDecimal = true;
var iscale = 0;
while (++ich < ichMax && (ch = str.charAt (ich)) >= '0' && ch <= '9') {
if (iscale < J.util.Parser.decimalScale.length) value += (ch.charCodeAt (0) - 48) * J.util.Parser.decimalScale[iscale];
++iscale;
digitSeen = true;
}
}var isExponent = false;
if (!digitSeen) value = NaN;
 else if (negative) value = -value;
if (ich < ichMax && (ch == 'E' || ch == 'e' || ch == 'D')) {
isExponent = true;
if (++ich >= ichMax) return NaN;
ch = str.charAt (ich);
if ((ch == '+') && (++ich >= ichMax)) return NaN;
next[0] = ich;
var exponent = J.util.Parser.parseIntChecked (str, ichMax, next);
if (exponent == -2147483648) return NaN;
if (exponent > 0) value *= ((exponent < J.util.Parser.tensScale.length) ? J.util.Parser.tensScale[exponent - 1] : Math.pow (10, exponent));
 else if (exponent < 0) value *= ((-exponent < J.util.Parser.decimalScale.length) ? J.util.Parser.decimalScale[-exponent - 1] : Math.pow (10, exponent));
} else {
next[0] = ich;
}if (value == -Infinity) value = -3.4028235E38;
 else if (value == Infinity) value = 3.4028235E38;
return (!isStrict || (!isExponent || isDecimal) && J.util.Parser.checkTrailingText (str, next[0], ichMax) ? value : NaN);
}, $fz.isPrivate = true, $fz), "~S,~N,~A,~B");
c$.checkTrailingText = Clazz.defineMethod (c$, "checkTrailingText", 
($fz = function (str, ich, ichMax) {
var ch;
while (ich < ichMax && ((ch = str.charAt (ich)) == ' ' || ch == '\t' || ch == '\n' || ch == ';')) ++ich;

return (ich == ichMax);
}, $fz.isPrivate = true, $fz), "~S,~N,~N");
c$.parseIntNext = Clazz.defineMethod (c$, "parseIntNext", 
function (str, next) {
var cch = str.length;
if (next[0] < 0 || next[0] >= cch) return -2147483648;
return J.util.Parser.parseIntChecked (str, cch, next);
}, "~S,~A");
c$.parseIntRange = Clazz.defineMethod (c$, "parseIntRange", 
function (str, ichMax, next) {
var cch = str.length;
if (ichMax > cch) ichMax = cch;
if (next[0] < 0 || next[0] >= ichMax) return -2147483648;
return J.util.Parser.parseIntChecked (str, ichMax, next);
}, "~S,~N,~A");
c$.parseIntChecked = Clazz.defineMethod (c$, "parseIntChecked", 
($fz = function (str, ichMax, next) {
var digitSeen = false;
var value = 0;
var ich = next[0];
if (ich < 0) return -2147483648;
var ch;
while (ich < ichMax && J.util.Parser.isWhiteSpace (str, ich)) ++ich;

var negative = false;
if (ich < ichMax && str.charAt (ich) == '-') {
negative = true;
++ich;
}while (ich < ichMax && (ch = str.charAt (ich)) >= '0' && ch <= '9') {
value = value * 10 + (ch.charCodeAt (0) - 48);
digitSeen = true;
++ich;
}
if (!digitSeen) value = -2147483648;
 else if (negative) value = -value;
next[0] = ich;
return value;
}, $fz.isPrivate = true, $fz), "~S,~N,~A");
c$.getTokensAt = Clazz.defineMethod (c$, "getTokensAt", 
function (line, ich) {
if (line == null) return null;
var cchLine = line.length;
if (ich < 0 || ich > cchLine) return null;
var tokenCount = J.util.Parser.countTokens (line, ich);
var tokens =  new Array (tokenCount);
var next =  Clazz.newIntArray (1, 0);
next[0] = ich;
for (var i = 0; i < tokenCount; ++i) tokens[i] = J.util.Parser.parseTokenChecked (line, cchLine, next);

return tokens;
}, "~S,~N");
c$.countTokens = Clazz.defineMethod (c$, "countTokens", 
($fz = function (line, ich) {
var tokenCount = 0;
if (line != null) {
var ichMax = line.length;
while (true) {
while (ich < ichMax && J.util.Parser.isWhiteSpace (line, ich)) ++ich;

if (ich == ichMax) break;
++tokenCount;
do {
++ich;
} while (ich < ichMax && !J.util.Parser.isWhiteSpace (line, ich));
}
}return tokenCount;
}, $fz.isPrivate = true, $fz), "~S,~N");
c$.parseTokenNext = Clazz.defineMethod (c$, "parseTokenNext", 
function (str, next) {
var cch = str.length;
if (next[0] < 0 || next[0] >= cch) return null;
return J.util.Parser.parseTokenChecked (str, cch, next);
}, "~S,~A");
c$.parseTokenRange = Clazz.defineMethod (c$, "parseTokenRange", 
function (str, ichMax, next) {
var cch = str.length;
if (ichMax > cch) ichMax = cch;
if (next[0] < 0 || next[0] >= ichMax) return null;
return J.util.Parser.parseTokenChecked (str, ichMax, next);
}, "~S,~N,~A");
c$.parseTokenChecked = Clazz.defineMethod (c$, "parseTokenChecked", 
($fz = function (str, ichMax, next) {
var ich = next[0];
while (ich < ichMax && J.util.Parser.isWhiteSpace (str, ich)) ++ich;

var ichNonWhite = ich;
while (ich < ichMax && !J.util.Parser.isWhiteSpace (str, ich)) ++ich;

next[0] = ich;
if (ichNonWhite == ich) return null;
return str.substring (ichNonWhite, ich);
}, $fz.isPrivate = true, $fz), "~S,~N,~A");
c$.parseTrimmedChecked = Clazz.defineMethod (c$, "parseTrimmedChecked", 
($fz = function (str, ich, ichMax) {
while (ich < ichMax && J.util.Parser.isWhiteSpace (str, ich)) ++ich;

var ichLast = ichMax - 1;
while (ichLast >= ich && J.util.Parser.isWhiteSpace (str, ichLast)) --ichLast;

if (ichLast < ich) return "";
return str.substring (ich, ichLast + 1);
}, $fz.isPrivate = true, $fz), "~S,~N,~N");
c$.concatTokens = Clazz.defineMethod (c$, "concatTokens", 
function (tokens, iFirst, iEnd) {
var str = "";
var sep = "";
for (var i = iFirst; i < iEnd; i++) {
if (i < tokens.length) {
str += sep + tokens[i];
sep = " ";
}}
return str;
}, "~A,~N,~N");
c$.getQuotedStringAt = Clazz.defineMethod (c$, "getQuotedStringAt", 
function (line, ipt0) {
var next = [ipt0];
return J.util.Parser.getQuotedStringNext (line, next);
}, "~S,~N");
c$.getQuotedStringNext = Clazz.defineMethod (c$, "getQuotedStringNext", 
function (line, next) {
var value = line;
var i = next[0];
if (i < 0 || (i = value.indexOf ("\"", i)) < 0) return "";
next[0] = ++i;
value = value.substring (i);
i = -1;
while (++i < value.length && value.charAt (i) != '"') if (value.charAt (i) == '\\') i++;

next[0] += i + 1;
return value.substring (0, i);
}, "~S,~A");
c$.isWhiteSpace = Clazz.defineMethod (c$, "isWhiteSpace", 
($fz = function (str, ich) {
var ch;
return (ich >= 0 && ((ch = str.charAt (ich)) == ' ' || ch == '\t' || ch == '\n'));
}, $fz.isPrivate = true, $fz), "~S,~N");
c$.isOneOf = Clazz.defineMethod (c$, "isOneOf", 
function (key, semiList) {
return key.indexOf (";") < 0 && (';' + semiList + ';').indexOf (';' + key + ';') >= 0;
}, "~S,~S");
c$.getQuotedAttribute = Clazz.defineMethod (c$, "getQuotedAttribute", 
function (info, name) {
var i = info.indexOf (name + "=");
return (i < 0 ? null : J.util.Parser.getQuotedStringAt (info, i));
}, "~S,~S");
c$.parseIntRadix = Clazz.defineMethod (c$, "parseIntRadix", 
function (s, i) {
{
return parseInt(s, i);
}}, "~S,~N");
c$.approx = Clazz.defineMethod (c$, "approx", 
function (f, n) {
return Math.round (f * n) / n;
}, "~N,~N");
Clazz.defineStatics (c$,
"decimalScale", [0.1, 0.01, 0.001, 0.0001, 0.00001, 0.000001, 0.0000001, 0.00000001],
"tensScale", [10, 100, 1000, 10000, 100000, 1000000]);
});
