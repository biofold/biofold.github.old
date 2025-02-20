Clazz.declarePackage ("J.render");
Clazz.load (["J.render.CageRenderer"], "J.render.BbcageRenderer", ["J.util.BoxInfo"], function () {
c$ = Clazz.declareType (J.render, "BbcageRenderer", J.render.CageRenderer);
Clazz.overrideMethod (c$, "setEdges", 
function () {
this.tickEdges = J.util.BoxInfo.bbcageTickEdges;
});
Clazz.defineMethod (c$, "render", 
function () {
var bbox = this.shape;
if (bbox.isVisible && (this.isExport || this.g3d.checkTranslucent (false)) && !this.viewer.isJmolDataFrame ()) {
this.colix = this.viewer.getObjectColix (4);
this.render (bbox.mad, this.modelSet.getBboxVertices (), null, 0, 0xFF, 0xFF, 1);
}return false;
});
});
