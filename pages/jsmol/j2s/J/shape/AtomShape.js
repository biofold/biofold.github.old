Clazz.declarePackage ("J.shape");
Clazz.load (["J.shape.Shape"], "J.shape.AtomShape", ["J.atomdata.RadiusData", "J.constant.EnumPalette", "J.util.ArrayUtil", "$.BS", "$.BSUtil", "$.C"], function () {
c$ = Clazz.decorateAsClass (function () {
this.mad = -1;
this.mads = null;
this.colixes = null;
this.paletteIDs = null;
this.atomCount = 0;
this.atoms = null;
this.isActive = false;
this.monomerCount = 0;
this.bsSizeDefault = null;
Clazz.instantialize (this, arguments);
}, J.shape, "AtomShape", J.shape.Shape);
Clazz.defineMethod (c$, "getMonomers", 
function () {
return null;
});
Clazz.overrideMethod (c$, "initModelSet", 
function () {
this.atoms = this.modelSet.atoms;
this.atomCount = this.modelSet.getAtomCount ();
if (this.mads != null) this.mads = J.util.ArrayUtil.arrayCopyShort (this.mads, this.atomCount);
if (this.colixes != null) this.colixes = J.util.ArrayUtil.arrayCopyShort (this.colixes, this.atomCount);
if (this.paletteIDs != null) this.paletteIDs = J.util.ArrayUtil.arrayCopyByte (this.paletteIDs, this.atomCount);
});
Clazz.overrideMethod (c$, "getSize", 
function (atomIndex) {
return (this.mads == null ? 0 : this.mads[atomIndex]);
}, "~N");
Clazz.overrideMethod (c$, "setSize", 
function (size, bsSelected) {
if (size == 0) this.setSizeRD (null, bsSelected);
 else this.setSizeRD ( new J.atomdata.RadiusData (null, size, J.atomdata.RadiusData.EnumType.SCREEN, null), bsSelected);
}, "~N,J.util.BS");
Clazz.overrideMethod (c$, "setSizeRD", 
function (rd, bsSelected) {
if (this.atoms == null) return;
this.isActive = true;
if (this.bsSizeSet == null) this.bsSizeSet =  new J.util.BS ();
var isVisible = (rd != null && rd.value != 0);
var isAll = (bsSelected == null);
var i0 = (isAll ? this.atomCount - 1 : bsSelected.nextSetBit (0));
if (this.mads == null && i0 >= 0) this.mads =  Clazz.newShortArray (this.atomCount, 0);
for (var i = i0; i >= 0; i = (isAll ? i - 1 : bsSelected.nextSetBit (i + 1))) {
var atom = this.atoms[i];
this.mads[i] = atom.calculateMad (this.viewer, rd);
this.bsSizeSet.setBitTo (i, isVisible);
atom.setShapeVisibility (this.myVisibilityFlag, isVisible);
}
}, "J.atomdata.RadiusData,J.util.BS");
Clazz.defineMethod (c$, "setProperty", 
function (propertyName, value, bs) {
if ("color" === propertyName) {
this.isActive = true;
var colix = J.util.C.getColixO (value);
var pid = J.constant.EnumPalette.pidOf (value);
if (this.bsColixSet == null) this.bsColixSet =  new J.util.BS ();
for (var i = bs.nextSetBit (0); i >= 0; i = bs.nextSetBit (i + 1)) this.setColixAndPalette (colix, pid, i);

return;
}if ("colors" === propertyName) {
this.isActive = true;
var data = value;
var colixes = data[0];
var translucency = (data[1]).floatValue ();
if (this.bsColixSet == null) this.bsColixSet =  new J.util.BS ();
for (var i = bs.nextSetBit (0); i >= 0; i = bs.nextSetBit (i + 1)) {
var colix = colixes[i];
if (translucency > 0.01) colix = J.util.C.getColixTranslucent3 (colix, true, translucency);
this.setColixAndPalette (colix, J.constant.EnumPalette.UNKNOWN.id, i);
}
return;
}if ("translucency" === propertyName) {
this.isActive = true;
var isTranslucent = (value.equals ("translucent"));
if (this.bsColixSet == null) this.bsColixSet =  new J.util.BS ();
for (var i = bs.nextSetBit (0); i >= 0; i = bs.nextSetBit (i + 1)) {
if (this.colixes == null) {
this.colixes =  Clazz.newShortArray (this.atomCount, 0);
this.paletteIDs =  Clazz.newByteArray (this.atomCount, 0);
}this.colixes[i] = J.util.C.getColixTranslucent3 (this.colixes[i], isTranslucent, this.translucentLevel);
if (isTranslucent) this.bsColixSet.set (i);
}
return;
}if (propertyName === "deleteModelAtoms") {
this.atoms = (value)[1];
var info = (value)[2];
this.atomCount = this.modelSet.getAtomCount ();
var firstAtomDeleted = info[1];
var nAtomsDeleted = info[2];
this.mads = J.util.ArrayUtil.deleteElements (this.mads, firstAtomDeleted, nAtomsDeleted);
this.colixes = J.util.ArrayUtil.deleteElements (this.colixes, firstAtomDeleted, nAtomsDeleted);
this.paletteIDs = J.util.ArrayUtil.deleteElements (this.paletteIDs, firstAtomDeleted, nAtomsDeleted);
J.util.BSUtil.deleteBits (this.bsSizeSet, bs);
J.util.BSUtil.deleteBits (this.bsColixSet, bs);
return;
}Clazz.superCall (this, J.shape.AtomShape, "setProperty", [propertyName, value, bs]);
}, "~S,~O,J.util.BS");
Clazz.defineMethod (c$, "setColixAndPalette", 
function (colix, paletteID, atomIndex) {
if (this.colixes == null || atomIndex >= this.colixes.length) {
if (colix == 0) return;
this.colixes = J.util.ArrayUtil.ensureLengthShort (this.colixes, atomIndex + 1);
this.paletteIDs = J.util.ArrayUtil.ensureLengthByte (this.paletteIDs, atomIndex + 1);
}if (this.bsColixSet == null) this.bsColixSet = J.util.BS.newN (this.atomCount);
this.colixes[atomIndex] = colix = this.getColixI (colix, paletteID, atomIndex);
this.bsColixSet.setBitTo (atomIndex, colix != 0);
this.paletteIDs[atomIndex] = paletteID;
}, "~N,~N,~N");
Clazz.overrideMethod (c$, "setModelClickability", 
function () {
if (!this.isActive) return;
for (var i = this.atomCount; --i >= 0; ) {
var atom = this.atoms[i];
if ((atom.getShapeVisibilityFlags () & this.myVisibilityFlag) == 0 || this.modelSet.isAtomHidden (i)) continue;
atom.setClickable (this.myVisibilityFlag);
}
});
Clazz.overrideMethod (c$, "getShapeState", 
function () {
return (this.isActive ? this.viewer.getAtomShapeState (this) : "");
});
Clazz.defineMethod (c$, "getInfoAsString", 
function (i) {
return null;
}, "~N");
});
