Clazz.declarePackage ("J.shapesurface");
Clazz.load (["J.shape.Mesh", "J.jvxl.data.JvxlData"], "J.shapesurface.IsosurfaceMesh", ["java.lang.Character", "$.Float", "java.util.ArrayList", "$.Hashtable", "J.api.Interface", "J.jvxl.data.JvxlCoder", "J.script.T", "J.util.ArrayUtil", "$.BS", "$.BSUtil", "$.BoxInfo", "$.C", "$.ColorEncoder", "$.ColorUtil", "$.Escape", "$.Logger", "$.Matrix4f", "$.Measure", "$.P3", "$.Parser", "$.Point4f", "$.SB", "$.V3", "J.viewer.Viewer"], function () {
c$ = Clazz.decorateAsClass (function () {
this.jvxlData = null;
this.vertexIncrement = 1;
this.firstRealVertex = -1;
this.dataType = 0;
this.hasGridPoints = false;
this.calculatedArea = null;
this.calculatedVolume = null;
this.info = null;
this.assocGridPointMap = null;
this.assocGridPointNormals = null;
this.mergeAssociatedNormalCount = 0;
this.centers = null;
this.contourValues = null;
this.contourColixes = null;
this.colorEncoder = null;
this.volumeRenderPointSize = 0.15;
this.bsVdw = null;
this.colorPhased = false;
Clazz.instantialize (this, arguments);
}, J.shapesurface, "IsosurfaceMesh", J.shape.Mesh);
Clazz.prepareFields (c$, function () {
this.jvxlData =  new J.jvxl.data.JvxlData ();
});
Clazz.makeConstructor (c$, 
function (thisID, colix, index) {
Clazz.superConstructor (this, J.shapesurface.IsosurfaceMesh, [thisID, colix, index]);
this.checkByteCount = 2;
this.jvxlData.version = J.viewer.Viewer.getJmolVersion ();
}, "~S,~N,~N");
Clazz.defineMethod (c$, "clear", 
function (meshType, iAddGridPoints) {
Clazz.superCall (this, J.shapesurface.IsosurfaceMesh, "clear", [meshType]);
this.jvxlData.clear ();
this.assocGridPointMap = null;
this.assocGridPointNormals = null;
this.bsVdw = null;
this.calculatedVolume = null;
this.calculatedArea = null;
this.centers = null;
this.colorEncoder = null;
this.colorPhased = false;
this.firstRealVertex = -1;
this.hasGridPoints = iAddGridPoints;
this.isColorSolid = true;
this.mergeAssociatedNormalCount = 0;
this.nSets = 0;
this.polygonColixes = null;
this.showPoints = iAddGridPoints;
this.surfaceSet = null;
this.vertexColixes = null;
this.vertexColorMap = null;
this.vertexIncrement = 1;
this.vertexSets = null;
this.vertexValues = null;
this.volumeRenderPointSize = 0.15;
}, "~S,~B");
Clazz.defineMethod (c$, "allocVertexColixes", 
function () {
if (this.vertexColixes == null) {
this.vertexColixes =  Clazz.newShortArray (this.vertexCount, 0);
for (var i = this.vertexCount; --i >= 0; ) this.vertexColixes[i] = this.colix;

}this.isColorSolid = false;
});
Clazz.defineMethod (c$, "addVertexCopy", 
function (vertex, value, assocVertex, associateNormals) {
var vPt = this.addVertexCopyVal (vertex, value);
switch (assocVertex) {
case -1:
if (this.firstRealVertex < 0) this.firstRealVertex = vPt;
break;
case -2:
this.hasGridPoints = true;
break;
case -3:
this.vertexIncrement = 3;
break;
default:
if (this.firstRealVertex < 0) this.firstRealVertex = vPt;
if (associateNormals) {
if (this.assocGridPointMap == null) this.assocGridPointMap =  new java.util.Hashtable ();
this.assocGridPointMap.put (Integer.$valueOf (vPt), Integer.$valueOf (assocVertex + this.mergeAssociatedNormalCount));
}}
return vPt;
}, "J.util.P3,~N,~N,~B");
Clazz.defineMethod (c$, "setTranslucent", 
function (isTranslucent, iLevel) {
Clazz.superCall (this, J.shapesurface.IsosurfaceMesh, "setTranslucent", [isTranslucent, iLevel]);
if (this.vertexColixes != null) for (var i = this.vertexCount; --i >= 0; ) this.vertexColixes[i] = J.util.C.getColixTranslucent3 (this.vertexColixes[i], isTranslucent, iLevel);

}, "~B,~N");
Clazz.defineMethod (c$, "setMerged", 
function (TF) {
this.isMerged = TF;
this.mergePolygonCount0 = (TF ? this.polygonCount : 0);
this.mergeVertexCount0 = (TF ? this.vertexCount : 0);
if (TF) {
this.mergeAssociatedNormalCount += this.jvxlData.nPointsX * this.jvxlData.nPointsY * this.jvxlData.nPointsZ;
this.assocGridPointNormals = null;
}}, "~B");
Clazz.defineMethod (c$, "sumVertexNormals", 
function (vertices, vectorSums) {
Clazz.superCall (this, J.shapesurface.IsosurfaceMesh, "sumVertexNormals", [vertices, vectorSums]);
if (this.assocGridPointMap != null && vectorSums.length > 0 && !this.isMerged) {
if (this.assocGridPointNormals == null) this.assocGridPointNormals =  new java.util.Hashtable ();
for (var entry, $entry = this.assocGridPointMap.entrySet ().iterator (); $entry.hasNext () && ((entry = $entry.next ()) || true);) {
var gridPoint = entry.getValue ();
if (!this.assocGridPointNormals.containsKey (gridPoint)) this.assocGridPointNormals.put (gridPoint, J.util.V3.new3 (0, 0, 0));
this.assocGridPointNormals.get (gridPoint).add (vectorSums[entry.getKey ().intValue ()]);
}
for (var entry, $entry = this.assocGridPointMap.entrySet ().iterator (); $entry.hasNext () && ((entry = $entry.next ()) || true);) vectorSums[entry.getKey ().intValue ()] = this.assocGridPointNormals.get (entry.getValue ());

}}, "~A,~A");
Clazz.defineMethod (c$, "getCenters", 
function () {
if (this.centers != null) return this.centers;
this.centers =  new Array (this.polygonCount);
for (var i = 0; i < this.polygonCount; i++) {
var pi = this.polygonIndexes[i];
if (pi == null) continue;
var pt = this.centers[i] =  new J.util.P3 ();
pt.add (this.vertices[pi[0]]);
pt.add (this.vertices[pi[1]]);
pt.add (this.vertices[pi[2]]);
pt.scale (0.33333334);
}
return this.centers;
});
Clazz.defineMethod (c$, "getFacePlane", 
function (i, vNorm) {
var plane =  new J.util.Point4f ();
J.util.Measure.getPlaneThroughPoints (this.vertices[this.polygonIndexes[i][0]], this.vertices[this.polygonIndexes[i][1]], this.vertices[this.polygonIndexes[i][2]], vNorm, this.vAB, this.vAC, plane);
return plane;
}, "~N,J.util.V3");
Clazz.defineMethod (c$, "getContours", 
function () {
var n = this.jvxlData.nContours;
if (n == 0 || this.polygonIndexes == null) return null;
this.havePlanarContours = (this.jvxlData.jvxlPlane != null);
if (this.havePlanarContours) return null;
if (n < 0) n = -1 - n;
var vContours = this.jvxlData.vContours;
if (vContours != null) {
for (var i = 0; i < n; i++) {
if (vContours[i].size () > 6) return this.jvxlData.vContours;
J.jvxl.data.JvxlCoder.set3dContourVector (vContours[i], this.polygonIndexes, this.vertices);
}
return this.jvxlData.vContours;
}vContours =  new Array (n);
for (var i = 0; i < n; i++) {
vContours[i] =  new java.util.ArrayList ();
}
if (this.jvxlData.contourValuesUsed == null) {
var dv = (this.jvxlData.valueMappedToBlue - this.jvxlData.valueMappedToRed) / (n + 1);
for (var i = 0; i < n; i++) {
var value = this.jvxlData.valueMappedToRed + (i + 1) * dv;
this.get3dContour (vContours[i], value, this.jvxlData.contourColixes[i]);
}
J.util.Logger.info (n + " contour lines; separation = " + dv);
} else {
for (var i = 0; i < n; i++) {
var value = this.jvxlData.contourValuesUsed[i];
this.get3dContour (vContours[i], value, this.jvxlData.contourColixes[i]);
}
}this.jvxlData.contourColixes =  Clazz.newShortArray (n, 0);
this.jvxlData.contourValues =  Clazz.newFloatArray (n, 0);
for (var i = 0; i < n; i++) {
this.jvxlData.contourValues[i] = (vContours[i].get (2)).floatValue ();
this.jvxlData.contourColixes[i] = (vContours[i].get (3))[0];
}
return this.jvxlData.vContours = vContours;
});
Clazz.defineMethod (c$, "get3dContour", 
($fz = function (v, value, colix) {
var bsContour = J.util.BSUtil.newBitSet (this.polygonCount);
var fData =  new J.util.SB ();
var color = J.util.C.getArgb (colix);
J.shapesurface.IsosurfaceMesh.setContourVector (v, this.polygonCount, bsContour, value, colix, color, fData);
for (var i = 0; i < this.polygonCount; i++) if (this.setABC (i)) J.shapesurface.IsosurfaceMesh.addContourPoints (v, bsContour, i, fData, this.vertices, this.vertexValues, this.iA, this.iB, this.iC, value);

}, $fz.isPrivate = true, $fz), "java.util.List,~N,~N");
c$.setContourVector = Clazz.defineMethod (c$, "setContourVector", 
function (v, nPolygons, bsContour, value, colix, color, fData) {
v.add (0, Integer.$valueOf (nPolygons));
v.add (1, bsContour);
v.add (2,  new Float (value));
v.add (3, [colix]);
v.add (4, [color]);
v.add (5, fData);
}, "java.util.List,~N,J.util.BS,~N,~N,~N,J.util.SB");
c$.addContourPoints = Clazz.defineMethod (c$, "addContourPoints", 
function (v, bsContour, i, fData, vertices, vertexValues, iA, iB, iC, value) {
var pt1 = null;
var pt2 = null;
var type = 0;
var f1 = J.shapesurface.IsosurfaceMesh.checkPt (vertexValues, iA, iB, value);
if (!Float.isNaN (f1)) {
pt1 = J.shapesurface.IsosurfaceMesh.getContourPoint (vertices, iA, iB, f1);
type |= 1;
}var f2 = (f1 == 1 ? NaN : J.shapesurface.IsosurfaceMesh.checkPt (vertexValues, iB, iC, value));
if (!Float.isNaN (f2)) {
pt2 = J.shapesurface.IsosurfaceMesh.getContourPoint (vertices, iB, iC, f2);
if (type == 0) {
pt1 = pt2;
f1 = f2;
}type |= 2;
}switch (type) {
case 0:
return;
case 1:
if (f1 == 0) return;
case 2:
f2 = (f2 == 1 ? NaN : J.shapesurface.IsosurfaceMesh.checkPt (vertexValues, iC, iA, value));
if (!Float.isNaN (f2)) {
pt2 = J.shapesurface.IsosurfaceMesh.getContourPoint (vertices, iC, iA, f2);
type |= 4;
}break;
}
switch (type) {
case 3:
case 5:
case 6:
break;
default:
return;
}
bsContour.set (i);
J.jvxl.data.JvxlCoder.appendContourTriangleIntersection (type, f1, f2, fData);
v.add (pt1);
v.add (pt2);
}, "java.util.List,J.util.BS,~N,J.util.SB,~A,~A,~N,~N,~N,~N");
c$.checkPt = Clazz.defineMethod (c$, "checkPt", 
($fz = function (vertexValues, i, j, v) {
var v1;
var v2;
return (v == (v1 = vertexValues[i]) ? 0 : v == (v2 = vertexValues[j]) ? 1 : (v1 < v) == (v < v2) ? (v - v1) / (v2 - v1) : NaN);
}, $fz.isPrivate = true, $fz), "~A,~N,~N,~N");
c$.getContourPoint = Clazz.defineMethod (c$, "getContourPoint", 
($fz = function (vertices, i, j, f) {
var pt =  new J.util.P3 ();
pt.setT (vertices[j]);
pt.sub (vertices[i]);
pt.scale (f);
pt.add (vertices[i]);
return pt;
}, $fz.isPrivate = true, $fz), "~A,~N,~N,~N");
Clazz.defineMethod (c$, "setDiscreteColixes", 
function (values, colixes) {
if (values != null) this.jvxlData.contourValues = values;
if (values == null || values.length == 0) values = this.jvxlData.contourValues = this.jvxlData.contourValuesUsed;
if (colixes == null && this.jvxlData.contourColixes != null) {
colixes = this.jvxlData.contourColixes;
} else {
this.jvxlData.contourColixes = colixes;
this.jvxlData.contourColors = J.util.C.getHexCodes (colixes);
}if (this.vertices == null || this.vertexValues == null || values == null) return;
var n = values.length;
var vMax = values[n - 1];
this.colorCommand = null;
var haveColixes = (colixes != null && colixes.length > 0);
this.isColorSolid = (haveColixes && this.jvxlData.jvxlPlane != null);
if (this.jvxlData.vContours != null) {
if (haveColixes) for (var i = 0; i < this.jvxlData.vContours.length; i++) {
var colix = colixes[i % colixes.length];
(this.jvxlData.vContours[i].get (3))[0] = colix;
(this.jvxlData.vContours[i].get (4))[0] = J.util.C.getArgb (colix);
}
return;
}var defaultColix = 0;
this.polygonColixes =  Clazz.newShortArray (this.polygonCount, 0);
for (var i = 0; i < this.polygonCount; i++) {
var pi = this.polygonIndexes[i];
if (pi == null) continue;
this.polygonColixes[i] = defaultColix;
var v = (this.vertexValues[pi[0]] + this.vertexValues[pi[1]] + this.vertexValues[pi[2]]) / 3;
for (var j = n; --j >= 0; ) {
if (v >= values[j] && v < vMax) {
this.polygonColixes[i] = (haveColixes ? colixes[j % colixes.length] : 0);
break;
}}
}
}, "~A,~A");
Clazz.defineMethod (c$, "getContourList", 
function (viewer) {
var ht =  new java.util.Hashtable ();
ht.put ("values", (this.jvxlData.contourValuesUsed == null ? this.jvxlData.contourValues : this.jvxlData.contourValuesUsed));
var colors =  new java.util.ArrayList ();
if (this.jvxlData.contourColixes != null) {
for (var i = 0; i < this.jvxlData.contourColixes.length; i++) {
colors.add (J.util.ColorUtil.colorPointFromInt2 (J.util.C.getArgb (this.jvxlData.contourColixes[i])));
}
ht.put ("colors", colors);
}return ht;
}, "J.viewer.Viewer");
Clazz.defineMethod (c$, "deleteContours", 
function () {
this.jvxlData.contourValuesUsed = null;
this.jvxlData.contourValues = null;
this.jvxlData.contourColixes = null;
this.jvxlData.vContours = null;
});
Clazz.defineMethod (c$, "colorAtoms", 
function (colix, bs) {
this.colorVertices (colix, bs, true);
}, "~N,J.util.BS");
Clazz.defineMethod (c$, "colorVertices", 
function (colix, bs) {
this.colorVertices (colix, bs, false);
}, "~N,J.util.BS");
Clazz.defineMethod (c$, "colorVertices", 
($fz = function (colix, bs, isAtoms) {
if (this.vertexSource == null) return;
colix = J.util.C.copyColixTranslucency (this.colix, colix);
var bsVertices = (isAtoms ?  new J.util.BS () : bs);
if (this.vertexColixes == null || this.vertexColorMap == null && this.isColorSolid) {
this.vertexColixes =  Clazz.newShortArray (this.vertexCount, 0);
for (var i = 0; i < this.vertexCount; i++) this.vertexColixes[i] = this.colix;

}this.isColorSolid = false;
if (isAtoms) for (var i = 0; i < this.vertexCount; i++) {
if (bs.get (this.vertexSource[i])) {
this.vertexColixes[i] = colix;
bsVertices.set (i);
}}
 else for (var i = 0; i < this.vertexCount; i++) if (bsVertices.get (i)) this.vertexColixes[i] = colix;

if (!isAtoms) {
return;
}var color = J.util.C.getHexCode (colix);
if (this.vertexColorMap == null) this.vertexColorMap =  new java.util.Hashtable ();
J.shapesurface.IsosurfaceMesh.addColorToMap (this.vertexColorMap, color, bs);
}, $fz.isPrivate = true, $fz), "~N,J.util.BS,~B");
c$.addColorToMap = Clazz.defineMethod (c$, "addColorToMap", 
($fz = function (colorMap, color, bs) {
var bsMap = null;
for (var entry, $entry = colorMap.entrySet ().iterator (); $entry.hasNext () && ((entry = $entry.next ()) || true);) if (entry.getKey () === color) {
bsMap = entry.getValue ();
bsMap.or (bs);
} else {
entry.getValue ().andNot (bs);
}
if (bsMap == null) colorMap.put (color, bs);
}, $fz.isPrivate = true, $fz), "java.util.Map,~S,J.util.BS");
Clazz.defineMethod (c$, "setJvxlColorMap", 
function (isAll) {
this.jvxlData.diameter = this.diameter;
this.jvxlData.color = J.util.C.getHexCode (this.colix);
this.jvxlData.meshColor = (this.meshColix == 0 ? null : J.util.C.getHexCode (this.meshColix));
this.jvxlData.translucency = J.util.C.getColixTranslucencyFractional (this.colix);
this.jvxlData.rendering = this.getRendering ().substring (1);
this.jvxlData.colorScheme = (this.colorEncoder == null ? null : this.colorEncoder.getColorScheme ());
this.jvxlData.nVertexColors = (this.vertexColorMap == null ? 0 : this.vertexColorMap.size ());
if (this.vertexColorMap == null || this.vertexSource == null || !isAll) return;
if (this.jvxlData.vertexColorMap == null) this.jvxlData.vertexColorMap =  new java.util.Hashtable ();
for (var entry, $entry = this.vertexColorMap.entrySet ().iterator (); $entry.hasNext () && ((entry = $entry.next ()) || true);) {
var bsMap = entry.getValue ();
if (bsMap.isEmpty ()) continue;
var color = entry.getKey ();
var bs =  new J.util.BS ();
for (var i = 0; i < this.vertexCount; i++) if (bsMap.get (this.vertexSource[i])) bs.set (i);

J.shapesurface.IsosurfaceMesh.addColorToMap (this.jvxlData.vertexColorMap, color, bs);
}
this.jvxlData.nVertexColors = this.jvxlData.vertexColorMap.size ();
if (this.jvxlData.vertexColorMap.size () == 0) this.jvxlData.vertexColorMap = null;
}, "~B");
Clazz.defineMethod (c$, "setColorCommand", 
function () {
if (this.colorEncoder == null) return;
this.colorCommand = this.colorEncoder.getColorScheme ();
if (this.colorCommand.equals ("inherit")) {
this.colorCommand = "#inherit;";
return;
}if (this.colorCommand == null) return;
this.colorCommand = "color $" + (Character.isLetter (this.thisID.charAt (0)) && this.thisID.indexOf (" ") < 0 ? this.thisID : "\"" + this.thisID + "\"") + " \"" + this.colorCommand + "\" range " + (this.jvxlData.isColorReversed ? this.jvxlData.valueMappedToBlue + " " + this.jvxlData.valueMappedToRed : this.jvxlData.valueMappedToRed + " " + this.jvxlData.valueMappedToBlue);
});
Clazz.defineMethod (c$, "setColorsFromJvxlData", 
function (colorRgb) {
this.diameter = this.jvxlData.diameter;
if (colorRgb == -1) {
} else if (colorRgb != -2147483648) {
this.colix = J.util.C.getColix (colorRgb);
} else if (this.jvxlData.color != null) {
this.colix = J.util.C.getColixS (this.jvxlData.color);
}if (this.colix == 0) this.colix = 5;
this.colix = J.util.C.getColixTranslucent3 (this.colix, this.jvxlData.translucency != 0, this.jvxlData.translucency);
if (this.jvxlData.meshColor != null) this.meshColix = J.util.C.getColixS (this.jvxlData.meshColor);
this.setJvxlDataRendering ();
this.isColorSolid = !this.jvxlData.isBicolorMap;
if (this.colorEncoder != null) {
if (this.jvxlData.colorScheme != null) {
var colorScheme = this.jvxlData.colorScheme;
var isTranslucent = colorScheme.startsWith ("translucent ");
if (isTranslucent) colorScheme = colorScheme.substring (12);
this.colorEncoder.setColorScheme (colorScheme, isTranslucent);
this.remapColors (null, null, NaN);
}if (this.jvxlData.vertexColorMap != null) for (var entry, $entry = this.jvxlData.vertexColorMap.entrySet ().iterator (); $entry.hasNext () && ((entry = $entry.next ()) || true);) {
var bsMap = entry.getValue ();
var colix = J.util.C.copyColixTranslucency (this.colix, J.util.C.getColixS (entry.getKey ()));
for (var i = bsMap.nextSetBit (0); i >= 0; i = bsMap.nextSetBit (i + 1)) this.vertexColixes[i] = colix;

}
}}, "~N");
Clazz.defineMethod (c$, "setJvxlDataRendering", 
function () {
if (this.jvxlData.rendering != null) {
var tokens = J.util.Parser.getTokens (this.jvxlData.rendering);
for (var i = 0; i < tokens.length; i++) this.setTokenProperty (J.script.T.getTokFromName (tokens[i]), true);

}});
Clazz.defineMethod (c$, "remapColors", 
function (viewer, ce, translucentLevel) {
if (ce == null) ce = this.colorEncoder;
if (ce == null) ce = this.colorEncoder =  new J.util.ColorEncoder (null);
this.colorEncoder = ce;
this.setColorCommand ();
if (Float.isNaN (translucentLevel)) {
translucentLevel = J.util.C.getColixTranslucencyLevel (this.colix);
} else {
this.colix = J.util.C.getColixTranslucent3 (this.colix, true, translucentLevel);
}var min = ce.lo;
var max = ce.hi;
var inherit = (this.vertexSource != null && ce.currentPalette == 14);
this.vertexColorMap = null;
this.polygonColixes = null;
this.jvxlData.vertexCount = this.vertexCount;
if (this.vertexValues == null || this.jvxlData.vertexCount == 0) return;
if (this.vertexColixes == null || this.vertexColixes.length != this.vertexCount) this.vertexColixes =  Clazz.newShortArray (this.vertexCount, 0);
if (inherit) {
var atoms = viewer.getModelSet ().atoms;
for (var i = this.mergeVertexCount0; i < this.vertexCount; i++) {
var pt = this.vertexSource[i];
if (pt < atoms.length) this.vertexColixes[i] = J.util.C.copyColixTranslucency (this.colix, atoms[pt].getColix ());
}
return;
}if (this.jvxlData.isBicolorMap) {
for (var i = this.mergeVertexCount0; i < this.vertexCount; i++) this.vertexColixes[i] = J.util.C.copyColixTranslucency (this.colix, this.vertexValues[i] < 0 ? this.jvxlData.minColorIndex : this.jvxlData.maxColorIndex);

return;
}this.jvxlData.isColorReversed = ce.isReversed;
if (max != 3.4028235E38) {
this.jvxlData.valueMappedToRed = min;
this.jvxlData.valueMappedToBlue = max;
}ce.setRange (this.jvxlData.valueMappedToRed, this.jvxlData.valueMappedToBlue, this.jvxlData.isColorReversed);
var isTranslucent = J.util.C.isColixTranslucent (this.colix);
if (ce.isTranslucent) {
if (!isTranslucent) this.colix = J.util.C.getColixTranslucent3 (this.colix, true, 0.5);
isTranslucent = false;
}for (var i = this.vertexCount; --i >= this.mergeVertexCount0; ) this.vertexColixes[i] = ce.getColorIndex (this.vertexValues[i]);

this.setTranslucent (isTranslucent, translucentLevel);
this.colorEncoder = ce;
var contours = this.getContours ();
if (contours != null) {
for (var i = contours.length; --i >= 0; ) {
var value = (contours[i].get (2)).floatValue ();
var colix = (contours[i].get (3));
colix[0] = ce.getColorIndex (value);
var color = (contours[i].get (4));
color[0] = J.util.C.getArgb (colix[0]);
}
}if (this.contourValues != null) {
this.contourColixes =  Clazz.newShortArray (this.contourValues.length, 0);
for (var i = 0; i < this.contourValues.length; i++) this.contourColixes[i] = ce.getColorIndex (this.contourValues[i]);

this.setDiscreteColixes (null, null);
}this.jvxlData.isJvxlPrecisionColor = true;
J.jvxl.data.JvxlCoder.jvxlCreateColorData (this.jvxlData, this.vertexValues);
this.setColorCommand ();
this.isColorSolid = false;
}, "J.viewer.Viewer,J.util.ColorEncoder,~N");
Clazz.defineMethod (c$, "reinitializeLightingAndColor", 
function (viewer) {
this.initialize (this.lighting, null, null);
if (this.colorEncoder != null || this.jvxlData.isBicolorMap) {
this.vertexColixes = null;
this.remapColors (viewer, null, NaN);
}}, "J.viewer.Viewer");
Clazz.overrideMethod (c$, "getBoundingBox", 
function () {
return this.jvxlData.boundingBox;
});
Clazz.defineMethod (c$, "resetBoundingBox", 
($fz = function () {
var bi =  new J.util.BoxInfo ();
if (this.polygonCount == 0) for (var i = this.vertexCount; --i >= 0; ) {
bi.addBoundBoxPoint (this.vertices[i]);
}
 else {
var bsDone =  new J.util.BS ();
for (var i = this.polygonCount; --i >= 0; ) {
if (!this.setABC (i)) continue;
if (!bsDone.get (this.iA)) {
bi.addBoundBoxPoint (this.vertices[this.iA]);
bsDone.set (this.iA);
}if (!bsDone.get (this.iB)) {
bi.addBoundBoxPoint (this.vertices[this.iB]);
bsDone.set (this.iB);
}if (!bsDone.get (this.iC)) {
bi.addBoundBoxPoint (this.vertices[this.iC]);
bsDone.set (this.iC);
}}
}this.jvxlData.boundingBox = bi.getBoundBoxPoints (false);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "merge", 
function (m) {
var nV = this.vertexCount + (m == null ? 0 : m.vertexCount);
if (this.polygonIndexes == null) this.polygonIndexes =  Clazz.newIntArray (0, 0, 0);
if (m != null && m.polygonIndexes == null) m.polygonIndexes =  Clazz.newIntArray (0, 0, 0);
var nP = (this.bsSlabDisplay == null || this.polygonCount == 0 ? this.polygonCount : this.bsSlabDisplay.cardinality ()) + (m == null || m.polygonCount == 0 ? 0 : m.bsSlabDisplay == null ? m.polygonCount : m.bsSlabDisplay.cardinality ());
if (this.vertices == null) this.vertices =  new Array (0);
this.vertices = J.util.ArrayUtil.ensureLength (this.vertices, nV);
this.vertexValues = J.util.ArrayUtil.ensureLengthA (this.vertexValues, nV);
var haveSources = (this.vertexSource != null && (m == null || m.vertexSource != null));
this.vertexSource = J.util.ArrayUtil.ensureLengthI (this.vertexSource, nV);
var newPolygons = J.util.ArrayUtil.newInt2 (nP);
var ipt = J.shapesurface.IsosurfaceMesh.mergePolygons (this, 0, 0, newPolygons);
if (m != null) {
ipt = J.shapesurface.IsosurfaceMesh.mergePolygons (m, ipt, this.vertexCount, newPolygons);
for (var i = 0; i < m.vertexCount; i++, this.vertexCount++) {
this.vertices[this.vertexCount] = m.vertices[i];
this.vertexValues[this.vertexCount] = m.vertexValues[i];
if (haveSources) this.vertexSource[this.vertexCount] = m.vertexSource[i];
}
}this.polygonCount = this.polygonCount0 = nP;
this.vertexCount = this.vertexCount0 = nV;
if (nP > 0) this.resetSlab ();
this.polygonIndexes = newPolygons;
}, "J.jvxl.data.MeshData");
c$.mergePolygons = Clazz.defineMethod (c$, "mergePolygons", 
($fz = function (m, ipt, vertexCount, newPolygons) {
var p;
for (var i = 0; i < m.polygonCount; i++) {
if ((p = m.polygonIndexes[i]) == null || m.bsSlabDisplay != null && !m.bsSlabDisplay.get (i)) continue;
newPolygons[ipt++] = m.polygonIndexes[i];
if (vertexCount > 0) for (var j = 0; j < 3; j++) p[j] += vertexCount;

}
return ipt;
}, $fz.isPrivate = true, $fz), "J.util.MeshSurface,~N,~N,~A");
Clazz.overrideMethod (c$, "getUnitCell", 
function () {
return (this.spanningVectors == null ? null : (J.api.Interface.getOptionInterface ("symmetry.Symmetry")).getUnitCell (this.spanningVectors));
});
Clazz.overrideMethod (c$, "slabBrillouin", 
function (unitCellPoints) {
var vectors = (unitCellPoints == null ? this.spanningVectors : unitCellPoints);
if (vectors == null) return;
var pts =  new Array (27);
pts[0] = J.util.P3.newP (vectors[0]);
var pt = 0;
for (var i = -1; i <= 1; i++) for (var j = -1; j <= 1; j++) for (var k = -1; k <= 1; k++) if (i != 0 || j != 0 || k != 0) {
pts[++pt] = J.util.P3.newP (pts[0]);
pts[pt].scaleAdd2 (i, vectors[1], pts[pt]);
pts[pt].scaleAdd2 (j, vectors[2], pts[pt]);
pts[pt].scaleAdd2 (k, vectors[3], pts[pt]);
}


System.out.println ("draw line1 {0 0 0} color red" + J.util.Escape.eP (this.spanningVectors[1]));
System.out.println ("draw line2 {0 0 0} color green" + J.util.Escape.eP (this.spanningVectors[2]));
System.out.println ("draw line3 {0 0 0} color blue" + J.util.Escape.eP (this.spanningVectors[3]));
var ptTemp =  new J.util.P3 ();
var planeGammaK =  new J.util.Point4f ();
var vGammaToKPoint =  new J.util.V3 ();
var vTemp =  new J.util.V3 ();
var bsMoved =  new J.util.BS ();
var mapEdge =  new java.util.Hashtable ();
this.bsSlabGhost =  new J.util.BS ();
for (var i = 1; i < 27; i++) {
vGammaToKPoint.setT (pts[i]);
J.util.Measure.getBisectingPlane (pts[0], vGammaToKPoint, ptTemp, vTemp, planeGammaK);
this.getIntersection (1, planeGammaK, null, null, null, null, null, false, false, 135266319, true);
bsMoved.clearAll ();
mapEdge.clear ();
for (var j = this.bsSlabGhost.nextSetBit (0); j >= 0; j = this.bsSlabGhost.nextSetBit (j + 1)) {
if (!this.setABC (j)) continue;
var p = J.util.ArrayUtil.arrayCopyRangeI (this.polygonIndexes[j], 0, -1);
for (var k = 0; k < 3; k++) {
var pk = p[k];
p[k] = this.addIntersectionVertex (this.vertices[pk], this.vertexValues[pk], this.vertexSource == null ? 0 : this.vertexSource[pk], this.vertexSets == null ? 0 : this.vertexSets[pk], mapEdge, 0, pk);
if (pk != p[k] && bsMoved.get (pk)) bsMoved.set (p[k]);
}
this.addPolygonC (p, 0, this.bsSlabDisplay);
for (var k = 0; k < 3; k++) if (!bsMoved.get (p[k])) {
bsMoved.set (p[k]);
this.vertices[p[k]].sub (vGammaToKPoint);
}
}
if (this.bsSlabGhost.nextSetBit (0) >= 0) {
this.bsSlabGhost.clearAll ();
i = 0;
}}
this.bsSlabGhost = null;
this.resetBoundingBox ();
}, "~A");
Clazz.overrideMethod (c$, "getMinDistance2ForVertexGrouping", 
function () {
if (this.jvxlData.boundingBox != null && this.jvxlData.boundingBox[0] != null) {
var d2 = this.jvxlData.boundingBox[1].distanceSquared (this.jvxlData.boundingBox[0]);
if (d2 < 5) return 1e-10;
}return 1e-8;
});
Clazz.defineMethod (c$, "getVisibleVertexBitSet", 
function () {
var bs = Clazz.superCall (this, J.shapesurface.IsosurfaceMesh, "getVisibleVertexBitSet", []);
if (this.jvxlData.thisSet >= 0) for (var i = 0; i < this.vertexCount; i++) if (this.vertexSets[i] != this.jvxlData.thisSet) bs.clear (i);

return bs;
});
Clazz.defineMethod (c$, "updateCoordinates", 
function (m, bs) {
var doUpdate = (bs == null);
if (!doUpdate) for (var i = 0; i < this.connections.length; i++) if (this.connections[i] >= 0 && bs.get (this.connections[i])) {
doUpdate = true;
break;
}
if (!doUpdate) return;
if (this.mat4 == null) {
this.mat4 =  new J.util.Matrix4f ();
this.mat4.setIdentity ();
}this.mat4.mul2 (m, this.mat4);
this.recalcAltVertices = true;
}, "J.util.Matrix4f,J.util.BS");
});
