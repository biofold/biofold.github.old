Clazz.declarePackage ("J.render");
Clazz.load (["J.render.FontLineShapeRenderer", "J.util.AxisAngle4f", "$.Matrix3f"], "J.render.MeasuresRenderer", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.measurement = null;
this.doJustify = false;
this.aaT = null;
this.matrixT = null;
Clazz.instantialize (this, arguments);
}, J.render, "MeasuresRenderer", J.render.FontLineShapeRenderer);
Clazz.prepareFields (c$, function () {
this.aaT =  new J.util.AxisAngle4f ();
this.matrixT =  new J.util.Matrix3f ();
});
Clazz.defineMethod (c$, "render", 
function () {
if (!this.g3d.checkTranslucent (false)) return false;
var measures = this.shape;
this.doJustify = this.viewer.getJustifyMeasurements ();
this.mad = measures.mad;
this.imageFontScaling = this.viewer.getImageFontScaling ();
this.font3d = this.g3d.getFont3DScaled (measures.font3d, this.imageFontScaling);
this.renderPendingMeasurement (measures.measurementPending);
if (!this.viewer.getShowMeasurements ()) return false;
var showMeasurementLabels = this.viewer.getShowMeasurementLabels ();
var dynamicMeasurements = this.viewer.getDynamicMeasurements ();
measures.setVisibilityInfo ();
for (var i = measures.measurementCount; --i >= 0; ) {
var m = measures.measurements.get (i);
if (dynamicMeasurements || m.isDynamic) m.refresh ();
if (!m.isVisible) continue;
this.colix = m.colix;
if (this.colix == 0) this.colix = measures.colix;
if (this.colix == 0) this.colix = this.viewer.getColixBackgroundContrast ();
this.g3d.setColix (this.colix);
this.renderMeasurement (m.getCount (), m, showMeasurementLabels);
}
return false;
});
Clazz.defineMethod (c$, "getAtom", 
($fz = function (i) {
var a = this.measurement.getAtom (i);
if (a.screenDiameter < 0) {
this.viewer.transformPtScr (a, this.pt0);
a.screenX = this.pt0.x;
a.screenY = this.pt0.y;
a.screenZ = this.pt0.z;
}return a;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "renderMeasurement", 
($fz = function (count, measurement, renderLabel) {
this.measurement = measurement;
switch (count) {
case 1:
if (measurement.traceX != -2147483648) {
this.atomA = this.getAtom (1);
this.drawLine (this.atomA.screenX, this.atomA.screenY, this.atomA.screenZ, measurement.traceX, measurement.traceY, this.atomA.screenZ, this.mad);
}break;
case 2:
this.atomA = this.getAtom (1);
this.atomB = this.getAtom (2);
this.renderDistance (renderLabel);
break;
case 3:
this.atomA = this.getAtom (1);
this.atomB = this.getAtom (2);
this.atomC = this.getAtom (3);
this.renderAngle (renderLabel);
break;
case 4:
this.atomA = this.getAtom (1);
this.atomB = this.getAtom (2);
this.atomC = this.getAtom (3);
this.atomD = this.getAtom (4);
this.renderTorsion (renderLabel);
break;
}
this.atomA = this.atomB = this.atomC = this.atomD = null;
}, $fz.isPrivate = true, $fz), "~N,J.modelset.Measurement,~B");
Clazz.defineMethod (c$, "renderDistance", 
function (renderLabel) {
this.tickInfo = this.measurement.getTickInfo ();
if (this.tickInfo != null) {
this.drawLine (this.atomA.screenX, this.atomA.screenY, this.atomA.screenZ, this.atomB.screenX, this.atomB.screenY, this.atomB.screenZ, this.mad);
if (this.tickInfo != null) this.drawTicks (this.atomA, this.atomB, this.mad, renderLabel);
return;
}var zA = this.atomA.screenZ - this.atomA.screenDiameter - 10;
var zB = this.atomB.screenZ - this.atomB.screenDiameter - 10;
var radius = this.drawLine (this.atomA.screenX, this.atomA.screenY, zA, this.atomB.screenX, this.atomB.screenY, zB, this.mad);
if (!renderLabel) return;
var s = this.measurement.getString ();
if (s == null || s.length == 0) return;
if (this.mad > 0) radius <<= 1;
var z = Clazz.doubleToInt ((zA + zB) / 2);
if (z < 1) z = 1;
var x = Clazz.doubleToInt ((this.atomA.screenX + this.atomB.screenX) / 2);
var y = Clazz.doubleToInt ((this.atomA.screenY + this.atomB.screenY) / 2);
this.drawString (x, y, z, radius, this.doJustify && (x - this.atomA.screenX) * (y - this.atomA.screenY) > 0, false, false, (this.doJustify ? 0 : 2147483647), s);
}, "~B");
Clazz.defineMethod (c$, "renderAngle", 
($fz = function (renderLabel) {
var zOffset = this.atomB.screenDiameter + 10;
var zA = this.atomA.screenZ - this.atomA.screenDiameter - 10;
var zB = this.atomB.screenZ - zOffset;
var zC = this.atomC.screenZ - this.atomC.screenDiameter - 10;
var radius = this.drawLine (this.atomA.screenX, this.atomA.screenY, zA, this.atomB.screenX, this.atomB.screenY, zB, this.mad);
radius += this.drawLine (this.atomB.screenX, this.atomB.screenY, zB, this.atomC.screenX, this.atomC.screenY, zC, this.mad);
if (!renderLabel) return;
radius = Clazz.doubleToInt ((radius + 1) / 2);
var aa = this.measurement.getAxisAngle ();
if (aa == null) {
var offset = Clazz.doubleToInt (Math.floor (5 * this.imageFontScaling));
this.drawString (this.atomB.screenX + offset, this.atomB.screenY - offset, zB, radius, false, false, false, (this.doJustify ? 0 : 2147483647), this.measurement.getString ());
return;
}var dotCount = Clazz.doubleToInt (Math.floor ((aa.angle / (6.283185307179586)) * 64));
var stepAngle = aa.angle / dotCount;
this.aaT.setAA (aa);
var iMid = Clazz.doubleToInt (dotCount / 2);
var ptArc = this.measurement.getPointArc ();
for (var i = dotCount; --i >= 0; ) {
this.aaT.angle = i * stepAngle;
this.matrixT.setAA (this.aaT);
this.pointT.setT (ptArc);
this.matrixT.transform (this.pointT);
this.pointT.add (this.atomB);
var point3iScreenTemp = this.viewer.transformPt (this.pointT);
var zArc = point3iScreenTemp.z - zOffset;
if (zArc < 0) zArc = 0;
this.g3d.drawPixel (point3iScreenTemp.x, point3iScreenTemp.y, zArc);
if (i == iMid) {
this.pointT.setT (ptArc);
this.pointT.scale (1.1);
this.matrixT.transform (this.pointT);
this.pointT.add (this.atomB);
this.viewer.transformPt (this.pointT);
var zLabel = point3iScreenTemp.z - zOffset;
this.drawString (point3iScreenTemp.x, point3iScreenTemp.y, zLabel, radius, point3iScreenTemp.x < this.atomB.screenX, false, false, (this.doJustify ? this.atomB.screenY : 2147483647), this.measurement.getString ());
}}
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "renderTorsion", 
($fz = function (renderLabel) {
var zA = this.atomA.screenZ - this.atomA.screenDiameter - 10;
var zB = this.atomB.screenZ - this.atomB.screenDiameter - 10;
var zC = this.atomC.screenZ - this.atomC.screenDiameter - 10;
var zD = this.atomD.screenZ - this.atomD.screenDiameter - 10;
var radius = this.drawLine (this.atomA.screenX, this.atomA.screenY, zA, this.atomB.screenX, this.atomB.screenY, zB, this.mad);
radius += this.drawLine (this.atomB.screenX, this.atomB.screenY, zB, this.atomC.screenX, this.atomC.screenY, zC, this.mad);
radius += this.drawLine (this.atomC.screenX, this.atomC.screenY, zC, this.atomD.screenX, this.atomD.screenY, zD, this.mad);
if (!renderLabel) return;
radius /= 3;
this.drawString (Clazz.doubleToInt ((this.atomA.screenX + this.atomB.screenX + this.atomC.screenX + this.atomD.screenX) / 4), Clazz.doubleToInt ((this.atomA.screenY + this.atomB.screenY + this.atomC.screenY + this.atomD.screenY) / 4), Clazz.doubleToInt ((zA + zB + zC + zD) / 4), radius, false, false, false, (this.doJustify ? 0 : 2147483647), this.measurement.getString ());
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "renderPendingMeasurement", 
($fz = function (measurementPending) {
if (this.isExport || measurementPending == null) return;
var count = measurementPending.getCount ();
if (count == 0) return;
this.g3d.setColix (measurementPending.traceX == -2147483648 ? this.viewer.getColixRubberband () : count == 2 ? 20 : 23);
measurementPending.refresh ();
if (measurementPending.haveTarget ()) this.renderMeasurement (count, measurementPending, measurementPending.traceX == -2147483648);
 else this.renderPendingWithCursor (count, measurementPending);
}, $fz.isPrivate = true, $fz), "J.modelset.MeasurementPending");
Clazz.defineMethod (c$, "renderPendingWithCursor", 
($fz = function (count, measurementPending) {
if (count > 1) this.renderMeasurement (count, measurementPending, false);
this.measurement = measurementPending;
var atomLast = this.getAtom (count);
var lastZ = atomLast.screenZ - atomLast.screenDiameter - 10;
var x = this.viewer.getCursorX ();
var y = this.viewer.getCursorY ();
if (this.g3d.isAntialiased ()) {
x <<= 1;
y <<= 1;
}this.drawLine (atomLast.screenX, atomLast.screenY, lastZ, x, y, 0, this.mad);
}, $fz.isPrivate = true, $fz), "~N,J.modelset.MeasurementPending");
Clazz.defineMethod (c$, "drawLine", 
function (x1, y1, z1, x2, y2, z2, mad) {
var diameter = (mad >= 20 && this.exportType != 1 ? this.viewer.scaleToScreen (Clazz.doubleToInt ((z1 + z2) / 2), mad) : mad);
return Clazz.superCall (this, J.render.MeasuresRenderer, "drawLine", [x1, y1, z1, x2, y2, z2, diameter]);
}, "~N,~N,~N,~N,~N,~N,~N");
});
