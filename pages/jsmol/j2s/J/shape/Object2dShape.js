Clazz.declarePackage ("J.shape");
Clazz.load (["J.shape.Shape", "java.util.Hashtable"], "J.shape.Object2dShape", ["J.util.Logger", "$.P3", "$.TextFormat"], function () {
c$ = Clazz.decorateAsClass (function () {
this.objects = null;
this.currentObject = null;
this.currentFont = null;
this.currentColor = null;
this.currentBgColor = null;
this.currentTranslucentLevel = 0;
this.currentBgTranslucentLevel = 0;
this.thisID = null;
this.isHover = false;
this.isAll = false;
Clazz.instantialize (this, arguments);
}, J.shape, "Object2dShape", J.shape.Shape);
Clazz.prepareFields (c$, function () {
this.objects =  new java.util.Hashtable ();
});
Clazz.defineMethod (c$, "setProperty", 
function (propertyName, value, bsSelected) {
if ("allOff" === propertyName) {
this.currentObject = null;
this.isAll = true;
this.objects =  new java.util.Hashtable ();
return;
}if ("delete" === propertyName) {
if (this.currentObject == null) {
if (this.isAll || this.thisID != null) {
var e = this.objects.values ().iterator ();
while (e.hasNext ()) {
var text = e.next ();
if (this.isAll || J.util.TextFormat.isMatch (text.target.toUpperCase (), this.thisID, true, true)) {
e.remove ();
}}
}return;
}this.objects.remove (this.currentObject.target);
this.currentObject = null;
return;
}if ("off" === propertyName) {
if (this.isAll) {
this.objects =  new java.util.Hashtable ();
this.isAll = false;
this.currentObject = null;
}if (this.currentObject == null) {
return;
}this.objects.remove (this.currentObject.target);
this.currentObject = null;
return;
}if ("model" === propertyName) {
var modelIndex = (value).intValue ();
if (this.currentObject == null) {
if (this.isAll) {
var e = this.objects.values ().iterator ();
while (e.hasNext ()) {
e.next ().setModel (modelIndex);
}
}return;
}this.currentObject.setModel (modelIndex);
return;
}if ("align" === propertyName) {
var align = value;
if (this.currentObject == null) {
if (this.isAll) {
var e = this.objects.values ().iterator ();
while (e.hasNext ()) {
e.next ().setAlignmentLCR (align);
}
}return;
}if (!this.currentObject.setAlignmentLCR (align)) J.util.Logger.error ("unrecognized align:" + align);
return;
}if ("bgcolor" === propertyName) {
this.currentBgColor = value;
if (this.currentObject == null) {
if (this.isAll) {
var e = this.objects.values ().iterator ();
while (e.hasNext ()) {
e.next ().setBgColixO (value);
}
}return;
}this.currentObject.setBgColixO (value);
return;
}if ("color" === propertyName) {
this.currentColor = value;
if (this.currentObject == null) {
if (this.isAll || this.thisID != null) {
var e = this.objects.values ().iterator ();
while (e.hasNext ()) {
var text = e.next ();
if (this.isAll || J.util.TextFormat.isMatch (text.target.toUpperCase (), this.thisID, true, true)) {
text.setColixO (value);
}}
}return;
}this.currentObject.setColixO (value);
return;
}if ("target" === propertyName) {
var target = value;
this.isAll = target.equals ("all");
if (this.isAll || target.equals ("none")) {
this.currentObject = null;
}return;
}var isBackground;
if ((isBackground = ("bgtranslucency" === propertyName)) || "translucency" === propertyName) {
var isTranslucent = ("translucent" === value);
if (isBackground) this.currentBgTranslucentLevel = (isTranslucent ? this.translucentLevel : 0);
 else this.currentTranslucentLevel = (isTranslucent ? this.translucentLevel : 0);
if (this.currentObject == null) {
if (this.isAll) {
var e = this.objects.values ().iterator ();
while (e.hasNext ()) {
e.next ().setTranslucent (this.translucentLevel, isBackground);
}
}return;
}this.currentObject.setTranslucent (this.translucentLevel, isBackground);
return;
}if (propertyName === "deleteModelAtoms") {
var modelIndex = ((value)[2])[0];
var e = this.objects.values ().iterator ();
while (e.hasNext ()) {
var text = e.next ();
if (text.modelIndex == modelIndex) {
e.remove ();
} else if (text.modelIndex > modelIndex) {
text.modelIndex--;
}}
return;
}Clazz.superCall (this, J.shape.Object2dShape, "setProperty", [propertyName, value, bsSelected]);
}, "~S,~O,J.util.BS");
Clazz.overrideMethod (c$, "initModelSet", 
function () {
this.currentObject = null;
this.isAll = false;
});
Clazz.overrideMethod (c$, "setVisibilityFlags", 
function (bs) {
if (this.isHover) {
return;
}var e = this.objects.values ().iterator ();
while (e.hasNext ()) {
var t = e.next ();
t.setVisibility (t.modelIndex < 0 || bs.get (t.modelIndex));
}
}, "J.util.BS");
Clazz.overrideMethod (c$, "checkObjectClicked", 
function (x, y, modifiers, bsVisible) {
if (this.isHover || modifiers == 0) return null;
var e = this.objects.values ().iterator ();
while (e.hasNext ()) {
var obj = e.next ();
if (obj.checkObjectClicked (x, y, bsVisible)) {
var s = obj.getScript ();
if (s != null) {
this.viewer.evalStringQuiet (s);
}var map =  new java.util.Hashtable ();
map.put ("pt", (obj.xyz == null ?  new J.util.P3 () : obj.xyz));
var modelIndex = obj.modelIndex;
if (modelIndex < 0) modelIndex = 0;
map.put ("modelIndex", Integer.$valueOf (modelIndex));
map.put ("model", this.viewer.getModelNumberDotted (modelIndex));
map.put ("id", obj.target);
map.put ("type", "echo");
return map;
}}
return null;
}, "~N,~N,~N,J.util.BS");
Clazz.overrideMethod (c$, "checkObjectHovered", 
function (x, y, bsVisible) {
if (this.isHover) return false;
var e = this.objects.values ().iterator ();
var haveScripts = false;
while (e.hasNext ()) {
var obj = e.next ();
var s = obj.getScript ();
if (s != null) {
haveScripts = true;
if (obj.checkObjectClicked (x, y, bsVisible)) {
this.viewer.setCursor (1);
return true;
}}}
if (haveScripts) this.viewer.setCursor (0);
return false;
}, "~N,~N,J.util.BS");
});
