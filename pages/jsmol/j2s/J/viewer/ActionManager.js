Clazz.declarePackage ("J.viewer");
Clazz.load (["J.util.Rectangle", "J.viewer.MouseState"], "J.viewer.ActionManager", ["java.lang.Character", "$.Float", "java.util.ArrayList", "$.Hashtable", "J.i18n.GT", "J.modelset.MeasurementPending", "J.thread.HoverWatcherThread", "J.util.BSUtil", "$.Escape", "$.Logger", "$.P3", "$.Point3fi", "$.TextFormat", "J.viewer.binding.Binding", "$.JmolBinding"], function () {
c$ = Clazz.decorateAsClass (function () {
this.viewer = null;
this.binding = null;
this.jmolBinding = null;
this.pfaatBinding = null;
this.dragBinding = null;
this.rasmolBinding = null;
this.predragBinding = null;
this.hoverWatcherThread = null;
this.haveMultiTouchInput = false;
this.xyRange = 0;
this.gestureSwipeFactor = 1.0;
this.mouseDragFactor = 1.0;
this.mouseWheelFactor = 1.15;
this.current = null;
this.moved = null;
this.clicked = null;
this.pressed = null;
this.dragged = null;
this.pressedCount = 0;
this.pressedAtomIndex = 0;
this.clickedCount = 0;
this.drawMode = false;
this.labelMode = false;
this.dragSelectedMode = false;
this.measuresEnabled = true;
this.hoverActive = false;
this.measurementPending = null;
this.dragAtomIndex = -1;
this.rubberbandSelectionMode = false;
this.rectRubber = null;
this.isAltKeyReleased = true;
this.keyProcessing = false;
this.isMultiTouchClient = false;
this.isMultiTouchServer = false;
this.haveSelection = false;
this.measurementQueued = null;
this.pickingStyle = 0;
this.atomPickingMode = 1;
this.pickingStyleSelect = 0;
this.pickingStyleMeasure = 5;
this.rootPickingStyle = 0;
this.pickAtomAssignType = "C";
this.pickBondAssignType = 'p';
this.bondPickingMode = 0;
this.isPickAtomAssignCharge = false;
if (!Clazz.isClassDefined ("J.viewer.ActionManager.MotionPoint")) {
J.viewer.ActionManager.$ActionManager$MotionPoint$ ();
}
this.dragGesture = null;
if (!Clazz.isClassDefined ("J.viewer.ActionManager.Gesture")) {
J.viewer.ActionManager.$ActionManager$Gesture$ ();
}
this.selectionWorking = false;
Clazz.instantialize (this, arguments);
}, J.viewer, "ActionManager");
Clazz.prepareFields (c$, function () {
this.current =  new J.viewer.MouseState ();
this.moved =  new J.viewer.MouseState ();
this.clicked =  new J.viewer.MouseState ();
this.pressed =  new J.viewer.MouseState ();
this.dragged =  new J.viewer.MouseState ();
this.rectRubber =  new J.util.Rectangle ();
this.dragGesture = Clazz.innerTypeInstance (J.viewer.ActionManager.Gesture, this, null, 20);
});
c$.newAction = Clazz.defineMethod (c$, "newAction", 
function (i, name, info) {
J.viewer.ActionManager.actionInfo[i] = info;
J.viewer.ActionManager.actionNames[i] = name;
}, "~N,~S,~S");
c$.getActionName = Clazz.defineMethod (c$, "getActionName", 
function (i) {
return (i < J.viewer.ActionManager.actionNames.length ? J.viewer.ActionManager.actionNames[i] : null);
}, "~N");
c$.getActionFromName = Clazz.defineMethod (c$, "getActionFromName", 
function (name) {
for (var i = 0; i < J.viewer.ActionManager.actionNames.length; i++) if (J.viewer.ActionManager.actionNames[i].equalsIgnoreCase (name)) return i;

return -1;
}, "~S");
Clazz.defineMethod (c$, "getBindingInfo", 
function (qualifiers) {
return this.binding.getBindingInfo (J.viewer.ActionManager.actionInfo, qualifiers);
}, "~S");
c$.getPickingModeName = Clazz.defineMethod (c$, "getPickingModeName", 
function (pickingMode) {
return (pickingMode < 0 || pickingMode >= J.viewer.ActionManager.pickingModeNames.length ? "off" : J.viewer.ActionManager.pickingModeNames[pickingMode]);
}, "~N");
c$.getPickingMode = Clazz.defineMethod (c$, "getPickingMode", 
function (str) {
for (var i = J.viewer.ActionManager.pickingModeNames.length; --i >= 0; ) if (str.equalsIgnoreCase (J.viewer.ActionManager.pickingModeNames[i])) return i;

return -1;
}, "~S");
c$.getPickingStyleName = Clazz.defineMethod (c$, "getPickingStyleName", 
function (pickingStyle) {
return (pickingStyle < 0 || pickingStyle >= J.viewer.ActionManager.pickingStyleNames.length ? "toggle" : J.viewer.ActionManager.pickingStyleNames[pickingStyle]);
}, "~N");
c$.getPickingStyle = Clazz.defineMethod (c$, "getPickingStyle", 
function (str) {
for (var i = J.viewer.ActionManager.pickingStyleNames.length; --i >= 0; ) if (str.equalsIgnoreCase (J.viewer.ActionManager.pickingStyleNames[i])) return i;

return -1;
}, "~S");
Clazz.defineMethod (c$, "getMouseInfo", 
function () {
var info =  new java.util.Hashtable ();
var vb =  new java.util.ArrayList ();
var e = this.binding.getBindings ().values ().iterator ();
while (e.hasNext ()) {
var obj = e.next ();
if (Clazz.instanceOf (obj, Boolean)) continue;
if (J.util.Escape.isAI (obj)) {
var binding = obj;
obj = [J.viewer.binding.Binding.getMouseActionName (binding[0], false), J.viewer.ActionManager.getActionName (binding[1])];
}vb.add (obj);
}
info.put ("bindings", vb);
info.put ("bindingName", this.binding.getName ());
info.put ("actionNames", J.viewer.ActionManager.actionNames);
info.put ("actionInfo", J.viewer.ActionManager.actionInfo);
info.put ("bindingInfo", J.util.TextFormat.split (this.getBindingInfo (null), '\n'));
return info;
});
Clazz.defineMethod (c$, "setViewer", 
function (viewer, commandOptions) {
this.viewer = viewer;
this.setBinding (this.jmolBinding =  new J.viewer.binding.JmolBinding ());
}, "J.viewer.Viewer,~S");
Clazz.defineMethod (c$, "processEvent", 
function (groupID, eventType, touchID, iData, pt, time) {
}, "~N,~N,~N,~N,J.util.P3,~N");
Clazz.defineMethod (c$, "isBound", 
function (gesture, action) {
return this.binding.isBound (gesture, action);
}, "~N,~N");
Clazz.defineMethod (c$, "bindAction", 
function (desc, name, range1, range2) {
var jmolAction = J.viewer.ActionManager.getActionFromName (name);
var mouseAction = J.viewer.binding.Binding.getMouseAction (desc);
if (mouseAction == 0) return;
if (jmolAction >= 0) {
this.binding.bind (mouseAction, jmolAction);
} else {
this.binding.bind (mouseAction, name);
}}, "~S,~S,J.util.P3,J.util.P3");
Clazz.defineMethod (c$, "clearBindings", 
function () {
this.setBinding (this.jmolBinding =  new J.viewer.binding.JmolBinding ());
this.pfaatBinding = null;
this.dragBinding = null;
this.rasmolBinding = null;
});
Clazz.defineMethod (c$, "unbindAction", 
function (desc, name) {
if (desc == null && name == null) {
this.clearBindings ();
return;
}var jmolAction = J.viewer.ActionManager.getActionFromName (name);
var mouseAction = J.viewer.binding.Binding.getMouseAction (desc);
if (jmolAction >= 0) this.binding.unbind (mouseAction, jmolAction);
 else if (mouseAction != 0) this.binding.unbind (mouseAction, name);
if (name == null) this.binding.unbindUserAction (desc);
}, "~S,~S");
Clazz.defineMethod (c$, "setGestureSwipeFactor", 
function (factor) {
this.gestureSwipeFactor = factor;
}, "~N");
Clazz.defineMethod (c$, "setMouseDragFactor", 
function (factor) {
this.mouseDragFactor = factor;
}, "~N");
Clazz.defineMethod (c$, "setMouseWheelFactor", 
function (factor) {
this.mouseWheelFactor = factor;
}, "~N");
Clazz.defineMethod (c$, "setCurrent", 
function (time, x, y, mods) {
this.hoverOff ();
this.current.set (time, x, y, mods);
}, "~N,~N,~N,~N");
Clazz.defineMethod (c$, "getCurrentX", 
function () {
return this.current.x;
});
Clazz.defineMethod (c$, "getCurrentY", 
function () {
return this.current.y;
});
Clazz.defineMethod (c$, "setMouseMode", 
function () {
this.drawMode = this.labelMode = false;
this.dragSelectedMode = this.viewer.getDragSelected ();
this.measuresEnabled = !this.dragSelectedMode;
if (!this.dragSelectedMode) switch (this.atomPickingMode) {
default:
return;
case 32:
this.measuresEnabled = !this.isPickAtomAssignCharge;
return;
case 4:
this.drawMode = true;
this.measuresEnabled = false;
break;
case 2:
this.labelMode = true;
this.measuresEnabled = false;
break;
case 9:
this.measuresEnabled = false;
break;
case 19:
case 22:
case 20:
case 21:
this.measuresEnabled = false;
return;
}
this.exitMeasurementMode ();
});
Clazz.defineMethod (c$, "clearMouseInfo", 
function () {
this.pressedCount = this.clickedCount = 0;
this.dragGesture.setAction (0, 0);
this.exitMeasurementMode ();
});
Clazz.defineMethod (c$, "isMTClient", 
function () {
return this.isMultiTouchClient;
});
Clazz.defineMethod (c$, "isMTServer", 
function () {
return this.isMultiTouchServer;
});
Clazz.defineMethod (c$, "dispose", 
function () {
this.clear ();
});
Clazz.defineMethod (c$, "clear", 
function () {
this.startHoverWatcher (false);
if (this.predragBinding != null) this.binding = this.predragBinding;
this.viewer.setPickingMode (null, 1);
this.viewer.setPickingStyle (null, this.rootPickingStyle);
this.isAltKeyReleased = true;
});
Clazz.defineMethod (c$, "startHoverWatcher", 
function (isStart) {
if (this.viewer.isPreviewOnly ()) return;
try {
if (isStart) {
if (this.hoverWatcherThread != null) return;
this.current.time = -1;
this.hoverWatcherThread =  new J.thread.HoverWatcherThread (this, this.current, this.moved, this.viewer);
} else {
if (this.hoverWatcherThread == null) return;
this.current.time = -1;
this.hoverWatcherThread.interrupt ();
this.hoverWatcherThread = null;
}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
}, "~B");
Clazz.defineMethod (c$, "setModeMouse", 
function (modeMouse) {
if (modeMouse == -1) {
this.startHoverWatcher (false);
}}, "~N");
Clazz.defineMethod (c$, "keyPressed", 
function (key, modifiers) {
if (this.keyProcessing) return;
this.hoverOff ();
this.keyProcessing = true;
switch (key) {
case 18:
if (this.dragSelectedMode && this.isAltKeyReleased) this.viewer.moveSelected (-2147483648, 0, -2147483648, -2147483648, -2147483648, null, false, false);
this.isAltKeyReleased = false;
this.moved.modifiers |= 8;
break;
case 16:
this.dragged.modifiers |= 1;
this.moved.modifiers |= 1;
break;
case 17:
this.moved.modifiers |= 2;
}
var action = 16 + 256 + this.moved.modifiers;
if (!this.labelMode && !this.binding.isUserAction (action) && !this.isSelectAction (action)) this.checkMotionRotateZoom (action, this.current.x, 0, 0, false);
if (this.viewer.getNavigationMode ()) {
switch (key) {
case 38:
case 40:
case 37:
case 39:
case 32:
case 46:
this.viewer.navigate (key, modifiers);
break;
}
}this.keyProcessing = false;
}, "~N,~N");
Clazz.defineMethod (c$, "keyReleased", 
function (key) {
switch (key) {
case 18:
if (this.dragSelectedMode) this.viewer.moveSelected (2147483647, 0, -2147483648, -2147483648, -2147483648, null, false, false);
this.isAltKeyReleased = true;
this.moved.modifiers &= -9;
break;
case 16:
this.moved.modifiers &= -2;
break;
case 17:
this.moved.modifiers &= -3;
}
if (this.moved.modifiers == 0) this.viewer.setCursor (0);
if (!this.viewer.getNavigationMode ()) return;
switch (key) {
case 38:
case 40:
case 37:
case 39:
this.viewer.navigate (0, 0);
break;
}
}, "~N");
Clazz.defineMethod (c$, "mouseEntered", 
function (time, x, y) {
this.setCurrent (time, x, y, 0);
}, "~N,~N,~N");
Clazz.defineMethod (c$, "mouseExited", 
function (time, x, y) {
this.setCurrent (time, x, y, 0);
if (this.measurementPending != null) {
this.exitMeasurementMode ();
this.viewer.refresh (3, "mouseExit");
}}, "~N,~N,~N");
Clazz.defineMethod (c$, "minimize", 
($fz = function (dragDone) {
this.viewer.stopMinimization ();
var iAtom = this.dragAtomIndex;
if (dragDone) this.dragAtomIndex = -1;
var bs = (this.viewer.getMotionFixedAtoms ().cardinality () == 0 ? this.viewer.getAtomBits ((this.viewer.isAtomPDB (iAtom) ? 1087373318 : 1095761934), J.util.BSUtil.newAndSetBit (iAtom)) : J.util.BSUtil.setAll (this.viewer.getAtomCount ()));
this.viewer.minimize (2147483647, 0, bs, null, 0, false, false, false);
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "getExitRate", 
function () {
var dt = this.dragGesture.getTimeDifference (2);
return (dt > 5 ? 0 : this.dragGesture.getSpeedPixelsPerMillisecond (4, 2));
});
Clazz.defineMethod (c$, "isRubberBandSelect", 
($fz = function (action) {
return this.rubberbandSelectionMode && (this.isBound (action, 18) || this.isBound (action, 20) || this.isBound (action, 19));
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "getRubberBand", 
function () {
if (!this.rubberbandSelectionMode || this.rectRubber.x == 2147483647) return null;
return this.rectRubber;
});
Clazz.defineMethod (c$, "calcRectRubberBand", 
($fz = function () {
var factor = (this.viewer.isAntialiased () ? 2 : 1);
if (this.current.x < this.pressed.x) {
this.rectRubber.x = this.current.x * factor;
this.rectRubber.width = (this.pressed.x - this.current.x) * factor;
} else {
this.rectRubber.x = this.pressed.x * factor;
this.rectRubber.width = (this.current.x - this.pressed.x) * factor;
}if (this.current.y < this.pressed.y) {
this.rectRubber.y = this.current.y * factor;
this.rectRubber.height = (this.pressed.y - this.current.y) * factor;
} else {
this.rectRubber.y = this.pressed.y * factor;
this.rectRubber.height = (this.current.y - this.pressed.y) * factor;
}}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "checkAction", 
($fz = function (action, x, y, deltaX, deltaY, time, mode) {
var mods = J.viewer.binding.Binding.getModifiers (action);
if (mods != 0) {
var newAction = this.viewer.notifyMouseClicked (x, y, J.viewer.binding.Binding.getMouseAction (-this.pressedCount, mods), mode);
if (newAction == 0) return;
if (newAction > 0) action = newAction;
}if (this.isRubberBandSelect (action)) {
this.calcRectRubberBand ();
this.viewer.refresh (3, "rubberBand selection");
return;
}if (this.checkUserAction (action, x, y, deltaX, deltaY, time, mode)) return;
if (this.viewer.getRotateBondIndex () >= 0) {
if (this.isBound (action, 26)) {
this.viewer.moveSelected (deltaX, deltaY, -2147483648, x, y, null, false, false);
return;
}if (!this.isBound (action, 2)) this.viewer.setRotateBondIndex (-1);
}var bs;
if (this.dragAtomIndex >= 0) {
switch (this.atomPickingMode) {
case 26:
this.checkMotion (3);
if (this.isBound (action, 25) && this.viewer.allowRotateSelected ()) {
this.viewer.rotateSelected (this.getDegrees (deltaX, 0), this.getDegrees (deltaY, 1), null);
} else {
this.viewer.moveSelected (deltaX, deltaY, (this.isBound (action, 24) ? -deltaY : -2147483648), -2147483648, -2147483648, null, true, false);
}return;
case 27:
case 28:
case 29:
case 30:
if (this.dragGesture.getPointCount () == 1) this.viewer.undoMoveActionClear (this.dragAtomIndex, 2, true);
this.checkMotion (3);
if (this.isBound (action, 25)) {
bs = this.viewer.getAtomBits (1095761934, J.util.BSUtil.newAndSetBit (this.dragAtomIndex));
this.viewer.rotateSelected (this.getDegrees (deltaX, 0), this.getDegrees (deltaY, 1), bs);
} else {
bs = null;
switch (this.atomPickingMode) {
case 27:
case 30:
bs = this.viewer.getAtomBits (1095761934, J.util.BSUtil.newAndSetBit (this.dragAtomIndex));
this.viewer.select (bs, false, null, true);
break;
}
this.viewer.moveAtomWithHydrogens (this.dragAtomIndex, deltaX, deltaY, (this.isBound (action, 24) ? -deltaY : -2147483648), bs);
}return;
}
}if (this.dragAtomIndex >= 0 && this.isBound (action, 43) && this.atomPickingMode == 32) {
var nearestAtomIndex = this.viewer.findNearestAtomIndexMovable (x, y, false);
if (nearestAtomIndex >= 0) {
if (this.measurementPending != null) {
this.measurementPending.setCount (1);
} else if (this.measuresEnabled) {
this.enterMeasurementMode (nearestAtomIndex);
}this.addToMeasurement (nearestAtomIndex, null, true);
this.measurementPending.colix = 20;
} else if (this.measurementPending != null) {
this.measurementPending.setCount (1);
this.measurementPending.colix = 23;
}if (this.measurementPending == null) return;
this.measurementPending.traceX = x;
this.measurementPending.traceY = y;
this.viewer.refresh (3, "assignNew");
return;
}if (!this.drawMode && !this.labelMode) {
if (this.isBound (action, 1)) {
this.viewer.translateXYBy (deltaX, deltaY);
return;
}if (this.isBound (action, 0)) {
if (this.pressedAtomIndex == 2147483647) this.pressedAtomIndex = this.viewer.findNearestAtomIndex (this.pressed.x, this.pressed.y);
var pt = (this.pressedAtomIndex < 0 ? null : this.viewer.getAtomPoint3f (this.pressedAtomIndex));
if (pt == null) this.viewer.translateXYBy (deltaX, deltaY);
 else this.viewer.centerAt (x, y, pt);
return;
}}if (this.dragSelectedMode && this.haveSelection && (this.isBound (action, 22) || this.isBound (action, 25))) {
var iatom = this.viewer.getSelectionSet (false).nextSetBit (0);
if (iatom < 0) return;
if (this.dragGesture.getPointCount () == 1) this.viewer.undoMoveActionClear (iatom, 2, true);
 else this.viewer.moveSelected (2147483647, 0, -2147483648, -2147483648, -2147483648, null, false, false);
this.checkMotion (3);
if (this.isBound (action, 25) && this.viewer.allowRotateSelected ()) this.viewer.rotateSelected (this.getDegrees (deltaX, 0), this.getDegrees (deltaY, 1), null);
 else this.viewer.moveSelected (deltaX, deltaY, -2147483648, -2147483648, -2147483648, null, true, false);
return;
}if (this.drawMode && (this.isBound (action, 32) || this.isBound (action, 31)) || this.labelMode && this.isBound (action, 30)) {
this.checkMotion (3);
this.viewer.checkObjectDragged (this.dragged.x, this.dragged.y, x, y, action);
return;
}if (this.checkMotionRotateZoom (action, x, deltaX, deltaY, true)) {
if (this.viewer.getSlabEnabled () && this.checkSlideZoom (action)) this.viewer.slabDepthByPixels (deltaY);
 else this.viewer.zoomBy (deltaY);
return;
}if (this.isBound (action, 2)) {
var degX = this.getDegrees (deltaX, 0);
var degY = this.getDegrees (deltaY, 1);
if (this.viewer.useArcBall ()) this.viewer.rotateArcBall (x, y, this.mouseDragFactor);
 else this.viewer.rotateXYBy (degX, degY);
return;
}if (this.isBound (action, 4)) {
if (Math.abs (deltaY) > 5 * Math.abs (deltaX)) {
this.checkMotion (5);
this.viewer.zoomBy (deltaY);
} else if (Math.abs (deltaX) > 5 * Math.abs (deltaY)) {
this.checkMotion (3);
this.viewer.rotateZBy (-deltaX, 2147483647, 2147483647);
}return;
} else if (this.isBound (action, 5)) {
this.zoomByFactor (deltaY, 2147483647, 2147483647);
return;
} else if (this.isBound (action, 3)) {
this.checkMotion (3);
this.viewer.rotateZBy (-deltaX, 2147483647, 2147483647);
return;
}if (this.viewer.getSlabEnabled ()) {
if (this.isBound (action, 12)) {
this.viewer.depthByPixels (deltaY);
return;
}if (this.isBound (action, 11)) {
this.viewer.slabByPixels (deltaY);
return;
}if (this.isBound (action, 13)) {
this.viewer.slabDepthByPixels (deltaY);
return;
}}}, $fz.isPrivate = true, $fz), "~N,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "getDegrees", 
function (delta, i) {
var dim = (i == 0 ? this.viewer.getScreenWidth () : this.viewer.getScreenHeight ());
if (dim > 500) dim = 500;
return (delta) / dim * 180 * this.mouseDragFactor;
}, "~N,~N");
Clazz.defineMethod (c$, "zoomByFactor", 
function (dz, x, y) {
if (dz == 0) return;
this.checkMotion (5);
this.viewer.zoomByFactor (Math.pow (this.mouseWheelFactor, dz), x, y);
this.viewer.setInMotion (false);
}, "~N,~N,~N");
Clazz.defineMethod (c$, "checkUserAction", 
($fz = function (action, x, y, deltaX, deltaY, time, mode) {
if (!this.binding.isUserAction (action)) return false;
var ht = this.binding.getBindings ();
var e = ht.keySet ().iterator ();
var ret = false;
var obj;
while (e.hasNext ()) {
var key = e.next ();
if (key.indexOf (action + "\t") != 0 || !J.util.Escape.isAS (obj = ht.get (key))) continue;
var script = (obj)[1];
var nearestPoint = null;
if (script.indexOf ("_ATOM") >= 0) {
var iatom = this.findNearestAtom (x, y, null, true);
script = J.util.TextFormat.simpleReplace (script, "_ATOM", "({" + (iatom >= 0 ? "" + iatom : "") + "})");
if (iatom >= 0) script = J.util.TextFormat.simpleReplace (script, "_POINT", J.util.Escape.eP (this.viewer.getModelSet ().atoms[iatom]));
}if (!this.drawMode && (script.indexOf ("_POINT") >= 0 || script.indexOf ("_OBJECT") >= 0 || script.indexOf ("_BOND") >= 0)) {
var t = this.viewer.checkObjectClicked (x, y, action);
if (t != null && (nearestPoint = t.get ("pt")) != null) {
var isBond = t.get ("type").equals ("bond");
if (isBond) script = J.util.TextFormat.simpleReplace (script, "_BOND", "[{" + t.get ("index") + "}]");
script = J.util.TextFormat.simpleReplace (script, "_POINT", J.util.Escape.eP (nearestPoint));
script = J.util.TextFormat.simpleReplace (script, "_OBJECT", J.util.Escape.escapeMap (t));
}script = J.util.TextFormat.simpleReplace (script, "_BOND", "[{}]");
script = J.util.TextFormat.simpleReplace (script, "_OBJECT", "{}");
}script = J.util.TextFormat.simpleReplace (script, "_POINT", "{}");
script = J.util.TextFormat.simpleReplace (script, "_ACTION", "" + action);
script = J.util.TextFormat.simpleReplace (script, "_X", "" + x);
script = J.util.TextFormat.simpleReplace (script, "_Y", "" + (this.viewer.getScreenHeight () - y));
script = J.util.TextFormat.simpleReplace (script, "_DELTAX", "" + deltaX);
script = J.util.TextFormat.simpleReplace (script, "_DELTAY", "" + deltaY);
script = J.util.TextFormat.simpleReplace (script, "_TIME", "" + time);
script = J.util.TextFormat.simpleReplace (script, "_MODE", "" + mode);
this.viewer.evalStringQuiet (script);
ret = true;
}
return ret;
}, $fz.isPrivate = true, $fz), "~N,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "checkMotionRotateZoom", 
($fz = function (action, x, deltaX, deltaY, inMotion) {
var isSlideZoom = this.checkSlideZoom (action);
var isRotateXY = this.isBound (action, 2);
var isRotateZorZoom = this.isBound (action, 4);
if (!isSlideZoom && !isRotateXY && !isRotateZorZoom) return false;
var isZoom = (isRotateZorZoom && (deltaX == 0 || Math.abs (deltaY) > 5 * Math.abs (deltaX)));
var cursor = (isZoom || this.isZoomArea (this.moved.x) || this.isBound (action, 5) ? 5 : isRotateXY || isRotateZorZoom ? 3 : 0);
if (this.viewer.getCursor () != 4) this.viewer.setCursor (cursor);
if (inMotion) this.viewer.setInMotion (true);
return (isZoom || isSlideZoom);
}, $fz.isPrivate = true, $fz), "~N,~N,~N,~N,~B");
Clazz.defineMethod (c$, "checkSlideZoom", 
($fz = function (action) {
return this.isBound (action, 6) && this.isZoomArea (this.pressed.x);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "isZoomArea", 
($fz = function (x) {
return x > this.viewer.getScreenWidth () * (this.viewer.isStereoDouble () ? 2 : 1) * 98 / 100;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "getPoint", 
($fz = function (t) {
var pt =  new J.util.Point3fi ();
pt.setT (t.get ("pt"));
pt.modelIndex = (t.get ("modelIndex")).intValue ();
return pt;
}, $fz.isPrivate = true, $fz), "java.util.Map");
Clazz.defineMethod (c$, "findNearestAtom", 
($fz = function (x, y, nearestPoint, isClicked) {
var index = (this.drawMode || nearestPoint != null ? -1 : this.viewer.findNearestAtomIndexMovable (x, y, false));
return (index >= 0 && (isClicked || this.measurementPending == null) && !this.viewer.isInSelectionSubset (index) ? -1 : index);
}, $fz.isPrivate = true, $fz), "~N,~N,J.util.Point3fi,~B");
Clazz.defineMethod (c$, "isSelectAction", 
($fz = function (action) {
return (this.isBound (action, 33) || this.isBound (action, 34) || this.isBound (action, 18) || this.isBound (action, 19) || this.isBound (action, 20) || this.isBound (action, 21) || this.isBound (action, 16));
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "checkMotion", 
function (cursor) {
if (this.viewer.getCursor () != 4) this.viewer.setCursor (cursor);
this.viewer.setInMotion (true);
}, "~N");
Clazz.defineMethod (c$, "addToMeasurement", 
($fz = function (atomIndex, nearestPoint, dblClick) {
if (atomIndex == -1 && nearestPoint == null || this.measurementPending == null) {
this.exitMeasurementMode ();
return 0;
}var measurementCount = this.measurementPending.getCount ();
if (this.measurementPending.traceX != -2147483648 && measurementCount == 2) this.measurementPending.setCount (measurementCount = 1);
return (measurementCount == 4 && !dblClick ? measurementCount : this.measurementPending.addPoint (atomIndex, nearestPoint, true));
}, $fz.isPrivate = true, $fz), "~N,J.util.Point3fi,~B");
Clazz.defineMethod (c$, "enterMeasurementMode", 
($fz = function (iAtom) {
this.viewer.setPicked (-1);
this.viewer.setPicked (iAtom);
this.viewer.setCursor (2);
this.viewer.setPendingMeasurement (this.measurementPending =  new J.modelset.MeasurementPending (this.viewer.getModelSet ()));
this.measurementQueued = this.measurementPending;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "exitMeasurementMode", 
($fz = function () {
if (this.measurementPending == null) return;
this.viewer.setPendingMeasurement (this.measurementPending = null);
this.viewer.setCursor (0);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "checkHover", 
function () {
if (!this.viewer.getInMotion () && !this.viewer.getSpinOn () && !this.viewer.getNavOn () && !this.viewer.checkObjectHovered (this.current.x, this.current.y)) {
var atomIndex = this.viewer.findNearestAtomIndex (this.current.x, this.current.y);
if (atomIndex >= 0) this.viewer.hoverOn (atomIndex, J.viewer.binding.Binding.getMouseAction (this.clickedCount, this.moved.modifiers));
}});
Clazz.defineMethod (c$, "hoverOff", 
function () {
try {
this.viewer.hoverOff ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
});
Clazz.defineMethod (c$, "resetMeasurement", 
($fz = function () {
this.exitMeasurementMode ();
this.measurementQueued =  new J.modelset.MeasurementPending (this.viewer.getModelSet ());
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getPickingState", 
function () {
var script = ";set modelkitMode " + this.viewer.getModelkitMode () + ";set picking " + J.viewer.ActionManager.getPickingModeName (this.atomPickingMode);
if (this.atomPickingMode == 32) script += "_" + this.pickAtomAssignType;
script += ";";
if (this.bondPickingMode != 0) script += "set picking " + J.viewer.ActionManager.getPickingModeName (this.bondPickingMode);
if (this.bondPickingMode == 33) script += "_" + this.pickBondAssignType;
script += ";";
return script;
});
Clazz.defineMethod (c$, "getAtomPickingMode", 
function () {
return this.atomPickingMode;
});
Clazz.defineMethod (c$, "setPickingMode", 
function (pickingMode) {
var isNew = false;
switch (pickingMode) {
case -1:
isNew = true;
this.bondPickingMode = 35;
pickingMode = 1;
break;
case 35:
case 34:
case 33:
this.viewer.setBooleanProperty ("bondPicking", true);
this.bondPickingMode = pickingMode;
return;
case 8:
this.bondPickingMode = pickingMode;
if (this.viewer.getBondPicking ()) return;
isNew = true;
break;
}
isNew = new Boolean (isNew | (this.atomPickingMode != pickingMode)).valueOf ();
this.atomPickingMode = pickingMode;
if (isNew) this.resetMeasurement ();
}, "~N");
Clazz.defineMethod (c$, "setAtomPickingOption", 
function (option) {
switch (this.atomPickingMode) {
case 32:
this.pickAtomAssignType = option;
this.isPickAtomAssignCharge = (this.pickAtomAssignType.equals ("Pl") || this.pickAtomAssignType.equals ("Mi"));
break;
}
}, "~S");
Clazz.defineMethod (c$, "setBondPickingOption", 
function (option) {
switch (this.bondPickingMode) {
case 33:
this.pickBondAssignType = Character.toLowerCase (option.charAt (0));
break;
}
}, "~S");
Clazz.defineMethod (c$, "getPickingStyle", 
function () {
return this.pickingStyle;
});
Clazz.defineMethod (c$, "setPickingStyle", 
function (pickingStyle) {
this.pickingStyle = pickingStyle;
if (pickingStyle >= 4) {
this.pickingStyleMeasure = pickingStyle;
this.resetMeasurement ();
} else {
if (pickingStyle < 3) this.rootPickingStyle = pickingStyle;
this.pickingStyleSelect = pickingStyle;
}this.rubberbandSelectionMode = false;
switch (this.pickingStyleSelect) {
case 2:
if (this.binding.getName () !== "extendedSelect") this.setBinding (this.pfaatBinding = (this.pfaatBinding == null ? J.viewer.binding.Binding.newBinding ("Pfaat") : this.pfaatBinding));
break;
case 3:
if (this.binding.getName () !== "drag") this.setBinding (this.dragBinding = (this.dragBinding == null ? J.viewer.binding.Binding.newBinding ("Drag") : this.dragBinding));
this.rubberbandSelectionMode = true;
break;
case 1:
if (this.binding.getName () !== "selectOrToggle") this.setBinding (this.rasmolBinding = (this.rasmolBinding == null ? J.viewer.binding.Binding.newBinding ("Rasmol") : this.rasmolBinding));
break;
default:
if (this.binding !== this.jmolBinding) this.setBinding (this.jmolBinding);
}
if (this.binding.getName () !== "drag") this.predragBinding = this.binding;
}, "~N");
Clazz.defineMethod (c$, "setBinding", 
function (newBinding) {
this.binding = newBinding;
}, "J.viewer.binding.Binding");
Clazz.defineMethod (c$, "getSequence", 
($fz = function () {
var a1 = this.measurementQueued.getAtomIndex (1);
var a2 = this.measurementQueued.getAtomIndex (2);
if (a1 < 0 || a2 < 0) return;
var sequence = this.viewer.getSmiles (a1, a2, null, true, false, false, false);
this.viewer.setStatusMeasuring ("measureSequence", -2, sequence, 0);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "queueAtom", 
($fz = function (atomIndex, ptClicked) {
var n = this.measurementQueued.addPoint (atomIndex, ptClicked, true);
if (atomIndex >= 0) this.viewer.setStatusAtomPicked (atomIndex, "Atom #" + n + ":" + this.viewer.getAtomInfo (atomIndex));
return n;
}, $fz.isPrivate = true, $fz), "~N,J.util.Point3fi");
Clazz.defineMethod (c$, "mouseAction", 
function (action, time, x, y, count, modifiers) {
if (!this.viewer.getMouseEnabled ()) return;
switch (action) {
case 0:
this.setCurrent (time, x, y, modifiers);
this.moved.setCurrent (this.current, 0);
if (this.measurementPending != null || this.hoverActive) this.checkPointOrAtomClicked (x, y, 0, 0, time, false, 0);
 else if (this.isZoomArea (x)) this.checkMotionRotateZoom (J.viewer.binding.Binding.getMouseAction (1, 16), 0, 0, 0, false);
 else if (this.viewer.getCursor () == 5) this.viewer.setCursor (0);
return;
case 3:
if (this.viewer.isApplet () && !this.viewer.hasFocus ()) return;
this.setCurrent (time, this.current.x, this.current.y, modifiers);
this.checkAction (J.viewer.binding.Binding.getMouseAction (0, modifiers), this.current.x, this.current.y, 0, y, time, 3);
return;
case 2:
this.setMouseMode ();
this.clickedCount = (count > 1 ? count : this.clicked.check (0, 0, 0, modifiers, time, 700) ? this.clickedCount + 1 : 1);
if (this.clickedCount == 1) this.setCurrent (time, x, y, modifiers);
this.clicked.setCurrent (this.current, 2);
this.viewer.setFocus ();
if (this.atomPickingMode != 9 && this.isBound (J.viewer.binding.Binding.getMouseAction (-2147483648, modifiers), 23)) return;
this.checkPointOrAtomClicked (x, y, modifiers, this.clickedCount, time, false, 2);
return;
case 6:
return;
case 1:
this.setMouseMode ();
var deltaX = x - this.dragged.x;
var deltaY = y - this.dragged.y;
this.setCurrent (time, x, y, modifiers);
this.dragged.setCurrent (this.current, 1);
if (this.atomPickingMode != 32) this.exitMeasurementMode ();
action = J.viewer.binding.Binding.getMouseAction (this.pressedCount, modifiers);
this.dragGesture.add (action, x, y, time);
this.checkAction (action, x, y, deltaX, deltaY, time, 1);
return;
case 4:
this.setMouseMode ();
this.pressedCount = (this.pressed.check (0, 0, 0, modifiers, time, 700) ? this.pressedCount + 1 : 1);
if (this.pressedCount == 1) this.setCurrent (time, x, y, modifiers);
this.pressed.setCurrent (this.current, 4);
this.dragged.setCurrent (this.current, 4);
this.viewer.setFocus ();
var isSelectAndDrag = this.isBound (J.viewer.binding.Binding.getMouseAction (-2147483648, modifiers), 23);
action = J.viewer.binding.Binding.getMouseAction (this.pressedCount, modifiers);
this.dragGesture.setAction (action, time);
if (J.viewer.binding.Binding.getModifiers (action) != 0) {
action = this.viewer.notifyMouseClicked (x, y, action, 4);
if (action == 0) return;
}this.pressedAtomIndex = 2147483647;
if (this.drawMode && (this.isBound (action, 32) || this.isBound (action, 31)) || this.labelMode && this.isBound (action, 30)) {
this.viewer.checkObjectDragged (-2147483648, 0, x, y, action);
return;
}this.checkUserAction (action, x, y, 0, 0, time, 4);
var isBound = false;
switch (this.atomPickingMode) {
case 32:
isBound = this.isBound (action, 43);
break;
case 28:
isBound = this.isBound (action, 27) || this.isBound (action, 24);
break;
case 26:
case 27:
isBound = this.isBound (action, 27) || this.isBound (action, 25) || this.isBound (action, 24);
break;
case 29:
isBound = this.isBound (action, 28) || this.isBound (action, 24);
break;
case 30:
isBound = this.isBound (action, 29) || this.isBound (action, 25) || this.isBound (action, 24);
break;
}
if (isBound) {
this.dragAtomIndex = this.viewer.findNearestAtomIndexMovable (x, y, true);
if (this.dragAtomIndex >= 0 && (this.atomPickingMode == 32 || this.atomPickingMode == 31) && this.viewer.isAtomAssignable (this.dragAtomIndex)) {
this.enterMeasurementMode (this.dragAtomIndex);
this.measurementPending.addPoint (this.dragAtomIndex, null, false);
}return;
}if (this.isBound (action, 14)) {
var type = 'j';
if (this.viewer.getModelkitMode ()) {
var t = this.viewer.checkObjectClicked (x, y, J.viewer.binding.Binding.getMouseAction (1, 16));
type = (t != null && "bond".equals (t.get ("type")) ? 'b' : this.viewer.findNearestAtomIndex (x, y) >= 0 ? 'a' : 'm');
}this.viewer.popupMenu (x, y, type);
return;
}if (this.dragSelectedMode) {
this.haveSelection = true;
if (isSelectAndDrag) {
this.haveSelection = (this.viewer.findNearestAtomIndexMovable (x, y, true) >= 0);
}if (!this.haveSelection) return;
if (this.isBound (action, 22) || this.isBound (action, 24)) this.viewer.moveSelected (-2147483648, 0, -2147483648, -2147483648, -2147483648, null, false, false);
return;
}if (this.viewer.useArcBall ()) this.viewer.rotateArcBall (x, y, 0);
this.checkMotionRotateZoom (action, x, 0, 0, true);
return;
case 5:
this.setCurrent (time, x, y, modifiers);
this.viewer.spinXYBy (0, 0, 0);
var dragRelease = !this.pressed.check (this.xyRange, x, y, modifiers, time, 9223372036854775807);
this.viewer.setInMotion (false);
this.viewer.setCursor (0);
action = J.viewer.binding.Binding.getMouseAction (this.pressedCount, modifiers);
this.dragGesture.add (action, x, y, time);
if (dragRelease) this.viewer.setRotateBondIndex (-2147483648);
if (this.dragAtomIndex >= 0) {
if (this.atomPickingMode == 29 || this.atomPickingMode == 30) this.minimize (true);
}if (this.atomPickingMode == 32 && this.isBound (action, 43)) {
if (this.measurementPending == null || this.dragAtomIndex < 0) return;
this.assignNew (x, y);
return;
}this.dragAtomIndex = -1;
var isRbAction = this.isRubberBandSelect (action);
if (isRbAction) this.selectRb (action);
this.rubberbandSelectionMode = (this.binding.getName () === "drag");
this.rectRubber.x = 2147483647;
if (dragRelease) {
this.viewer.notifyMouseClicked (x, y, J.viewer.binding.Binding.getMouseAction (this.pressedCount, 0), 5);
}if (this.drawMode && (this.isBound (action, 32) || this.isBound (action, 31)) || this.labelMode && this.isBound (action, 30)) {
this.viewer.checkObjectDragged (2147483647, 0, x, y, action);
return;
}if (this.dragSelectedMode && this.isBound (action, 22) && this.haveSelection) this.viewer.moveSelected (2147483647, 0, -2147483648, -2147483648, -2147483648, null, false, false);
if (dragRelease && this.checkUserAction (action, x, y, 0, 0, time, 5)) return;
if (this.viewer.getAllowGestures ()) {
if (this.isBound (action, 8)) {
var speed = this.getExitRate ();
if (speed > 0) this.viewer.spinXYBy (this.dragGesture.getDX (4, 2), this.dragGesture.getDY (4, 2), speed * 30 * this.gestureSwipeFactor);
if (this.viewer.getLogGestures ()) this.viewer.log ("$NOW$ swipe " + this.dragGesture + " " + speed);
return;
}}return;
}
}, "~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "runScript", 
($fz = function (script) {
this.viewer.script (script);
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "getSelectionSet", 
($fz = function (script) {
try {
return this.viewer.getAtomBitSetEval (null, script);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
return null;
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "selectRb", 
($fz = function (action) {
var bs = this.viewer.findAtomsInRectangle (this.rectRubber);
if (bs.length () > 0) {
var s = J.util.Escape.e (bs);
if (this.isBound (action, 20)) this.runScript ("selectionHalos on;select selected or " + s);
 else if (this.isBound (action, 19)) this.runScript ("selectionHalos on;select selected and not " + s);
 else this.runScript ("selectionHalos on;select selected tog " + s);
}this.viewer.refresh (3, "mouseReleased");
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "assignNew", 
($fz = function (x, y) {
if (this.measurementPending.getCount () == 2) {
this.viewer.undoMoveActionClear (-1, 4146, true);
this.runScript ("assign connect " + this.measurementPending.getMeasurementScript (" ", false));
} else if (this.pickAtomAssignType.equals ("Xx")) {
this.exitMeasurementMode ();
this.viewer.refresh (3, "bond dropped");
} else {
if (this.pressed.inRange (this.xyRange, this.dragged.x, this.dragged.y)) {
var s = "assign atom ({" + this.dragAtomIndex + "}) \"" + this.pickAtomAssignType + "\"";
if (this.isPickAtomAssignCharge) {
s += ";{atomindex=" + this.dragAtomIndex + "}.label='%C'; ";
this.viewer.undoMoveActionClear (this.dragAtomIndex, 4, true);
} else {
this.viewer.undoMoveActionClear (-1, 4146, true);
}this.runScript (s);
} else if (!this.isPickAtomAssignCharge) {
this.viewer.undoMoveActionClear (-1, 4146, true);
var a = this.viewer.getModelSet ().atoms[this.dragAtomIndex];
if (a.getElementNumber () == 1) {
this.runScript ("assign atom ({" + this.dragAtomIndex + "}) \"X\"");
} else {
var ptNew = J.util.P3.new3 (x, y, a.screenZ);
this.viewer.unTransformPoint (ptNew, ptNew);
this.runScript ("assign atom ({" + this.dragAtomIndex + "}) \"" + this.pickAtomAssignType + "\" " + J.util.Escape.eP (ptNew));
}}}this.exitMeasurementMode ();
}, $fz.isPrivate = true, $fz), "~N,~N");
Clazz.defineMethod (c$, "checkPointOrAtomClicked", 
($fz = function (x, y, mods, clickedCount, time, atomOnly, mode) {
if (!this.viewer.haveModelSet ()) return false;
var action = J.viewer.binding.Binding.getMouseAction (clickedCount, mods);
if (action != 0) {
this.checkUserAction (action, x, y, 0, 0, time, mode);
action = this.viewer.notifyMouseClicked (x, y, action, mode);
if (action == 0) return false;
}if (this.isBound (action, 15) && this.viewer.frankClicked (x, y)) {
this.viewer.popupMenu (-x, y, 'j');
return false;
}if (this.isBound (action, 15) && this.viewer.frankClickedModelKit (x, y)) {
this.viewer.popupMenu (0, 0, 'm');
return false;
}var nearestPoint = null;
var isBond = false;
var isIsosurface = false;
var t = null;
if (!this.drawMode && !atomOnly) {
t = this.viewer.checkObjectClicked (x, y, action);
if (t != null) {
isBond = "bond".equals (t.get ("type"));
isIsosurface = "isosurface".equals (t.get ("type"));
nearestPoint = this.getPoint (t);
}}if (isBond) clickedCount = 1;
if (nearestPoint != null && Float.isNaN (nearestPoint.x)) return false;
var nearestAtomIndex = this.findNearestAtom (x, y, nearestPoint, clickedCount > 0);
if (clickedCount == 0 && this.atomPickingMode != 32) {
if (this.measurementPending == null) return (nearestAtomIndex >= 0);
if (nearestPoint != null || this.measurementPending.getIndexOf (nearestAtomIndex) == 0) this.measurementPending.addPoint (nearestAtomIndex, nearestPoint, false);
if (this.measurementPending.haveModified ()) this.viewer.setPendingMeasurement (this.measurementPending);
this.viewer.refresh (3, "measurementPending");
return (nearestAtomIndex >= 0);
}this.setMouseMode ();
if (this.isBound (action, 45)) {
this.viewer.stopMotion ();
}if (this.viewer.getNavigationMode () && this.atomPickingMode == 23 && this.isBound (action, 39)) {
this.viewer.navTranslatePercent (x * 100 / this.viewer.getScreenWidth () - 50, y * 100 / this.viewer.getScreenHeight () - 50);
return false;
}if (isBond) {
if (this.isBound (action, this.bondPickingMode == 34 || this.bondPickingMode == 33 ? 43 : 41)) {
if (this.bondPickingMode == 33) this.viewer.undoMoveActionClear (-1, 4146, true);
var index = (t.get ("index")).intValue ();
switch (this.bondPickingMode) {
case 33:
this.runScript ("assign bond [{" + index + "}] \"" + this.pickBondAssignType + "\"");
break;
case 34:
this.viewer.setRotateBondIndex (index);
break;
case 8:
this.viewer.deleteBonds (J.util.BSUtil.newAndSetBit (index));
}
return false;
}} else if (isIsosurface) {
return false;
} else {
if (this.atomPickingMode != 32 && this.measurementPending != null && this.isBound (action, 36)) {
this.atomOrPointPicked (nearestAtomIndex, nearestPoint, action);
if (this.addToMeasurement (nearestAtomIndex, nearestPoint, false) == 4) this.toggleMeasurement ();
return false;
}if (this.isBound (action, 37)) {
if (this.measurementPending != null) {
this.addToMeasurement (nearestAtomIndex, nearestPoint, true);
this.toggleMeasurement ();
} else if (!this.drawMode && !this.labelMode && !this.dragSelectedMode && this.measuresEnabled) {
this.enterMeasurementMode (nearestAtomIndex);
this.addToMeasurement (nearestAtomIndex, nearestPoint, true);
}this.atomOrPointPicked (nearestAtomIndex, nearestPoint, action);
return false;
}}var isDragSelected = (this.dragSelectedMode && (this.isBound (action, 25) || this.isBound (action, 22)));
if (isDragSelected || this.isSelectAction (action)) {
if (!isIsosurface) this.atomOrPointPicked (nearestAtomIndex, nearestPoint, isDragSelected ? 0 : action);
return (nearestAtomIndex >= 0);
}if (this.isBound (action, 44)) {
if (nearestAtomIndex < 0) this.runScript ("!reset");
return false;
}return (nearestAtomIndex >= 0);
}, $fz.isPrivate = true, $fz), "~N,~N,~N,~N,~N,~B,~N");
Clazz.defineMethod (c$, "toggleMeasurement", 
($fz = function () {
if (this.measurementPending == null) return;
var measurementCount = this.measurementPending.getCount ();
if (measurementCount >= 2 && measurementCount <= 4) this.runScript ("!measure " + this.measurementPending.getMeasurementScript (" ", true));
this.exitMeasurementMode ();
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "atomOrPointPicked", 
($fz = function (atomIndex, ptClicked, action) {
if (atomIndex < 0) {
this.resetMeasurement ();
if (this.isBound (action, 17)) {
this.runScript ("select none");
return;
}if (this.atomPickingMode != 5 && this.atomPickingMode != 6) return;
}var n = 2;
switch (this.atomPickingMode) {
case 28:
case 29:
return;
case 0:
return;
case 25:
case 24:
case 8:
var isDelete = (this.atomPickingMode == 8);
var isStruts = (this.atomPickingMode == 25);
if (!this.isBound (action, (isDelete ? 41 : 42))) return;
if (this.measurementQueued == null || this.measurementQueued.getCount () == 0 || this.measurementQueued.getCount () > 2) {
this.resetMeasurement ();
this.enterMeasurementMode (atomIndex);
}this.addToMeasurement (atomIndex, ptClicked, true);
if (this.queueAtom (atomIndex, ptClicked) != 2) return;
var cAction = (isDelete || this.measurementQueued.isConnected (this.viewer.getModelSet ().atoms, 2) ? " DELETE" : isStruts ? "STRUTS" : "");
this.runScript ("connect " + this.measurementQueued.getMeasurementScript (" ", true) + cAction);
this.resetMeasurement ();
return;
case 21:
n++;
case 20:
n++;
case 18:
case 19:
case 22:
if (!this.isBound (action, 36)) return;
if (this.measurementQueued == null || this.measurementQueued.getCount () == 0 || this.measurementQueued.getCount () > n) {
this.resetMeasurement ();
this.enterMeasurementMode (atomIndex);
}this.addToMeasurement (atomIndex, ptClicked, true);
this.queueAtom (atomIndex, ptClicked);
var i = this.measurementQueued.getCount ();
if (i == 1) {
this.viewer.setPicked (-1);
this.viewer.setPicked (atomIndex);
}if (i < n) return;
if (this.atomPickingMode == 22) {
this.getSequence ();
} else {
this.viewer.setStatusMeasuring ("measurePicked", n, this.measurementQueued.getStringDetail (), this.measurementQueued.getValue ());
if (this.atomPickingMode == 18 || this.pickingStyleMeasure == 4) {
this.runScript ("measure " + this.measurementQueued.getMeasurementScript (" ", true));
}}this.resetMeasurement ();
return;
}
var mode = (this.measurementPending != null && this.atomPickingMode != 1 ? 1 : this.atomPickingMode);
switch (mode) {
case 3:
if (!this.isBound (action, 33)) return;
if (ptClicked == null) {
this.runScript ("zoomTo (atomindex=" + atomIndex + ")");
this.viewer.setStatusAtomPicked (atomIndex, null);
} else {
this.runScript ("zoomTo " + J.util.Escape.eP (ptClicked));
}return;
case 5:
case 6:
this.checkTwoAtomAction (action, ptClicked, atomIndex);
}
if (ptClicked != null) return;
var bs;
switch (mode) {
case 1:
if (this.isBound (action, 33)) this.viewer.setStatusAtomPicked (atomIndex, null);
return;
case 2:
if (this.isBound (action, 35)) {
this.runScript ("set labeltoggle {atomindex=" + atomIndex + "}");
this.viewer.setStatusAtomPicked (atomIndex, null);
}return;
case 31:
if (this.isBound (action, 43)) {
bs = this.viewer.getAtomBitSet ("connected(atomIndex=" + atomIndex + ") and !within(SMARTS,'[r50,R]')");
var nb = bs.cardinality ();
switch (nb) {
case 0:
case 1:
return;
case 2:
break;
case 3:
case 4:
var lengths =  Clazz.newIntArray (nb, 0);
var points =  Clazz.newIntArray (nb, 0);
var ni = 0;
for (var i = bs.nextSetBit (0); i >= 0; i = bs.nextSetBit (i + 1), ni++) {
lengths[ni] = this.viewer.getBranchBitSet (i, atomIndex).cardinality ();
points[ni] = i;
}
for (var j = 0; j < nb - 2; j++) {
var max = -2147483648;
var imax = 0;
for (var i = 0; i < nb; i++) if (lengths[i] >= max && bs.get (points[i])) {
imax = points[i];
max = lengths[i];
}
bs.clear (imax);
}
}
this.viewer.undoMoveActionClear (atomIndex, 2, true);
this.viewer.invertSelected (null, null, atomIndex, bs);
this.viewer.setStatusAtomPicked (atomIndex, "inverted: " + J.util.Escape.e (bs));
}return;
case 7:
if (this.isBound (action, 40)) {
bs = J.util.BSUtil.newAndSetBit (atomIndex);
this.viewer.deleteAtoms (bs, false);
this.viewer.setStatusAtomPicked (atomIndex, "deleted: " + J.util.Escape.e (bs));
}return;
}
var spec = "atomindex=" + atomIndex;
switch (this.atomPickingMode) {
default:
return;
case 9:
this.applySelectStyle (spec, action);
break;
case 10:
this.applySelectStyle ("within(group, " + spec + ")", action);
break;
case 11:
this.applySelectStyle ("within(chain, " + spec + ")", action);
break;
case 13:
this.applySelectStyle ("within(polymer, " + spec + ")", action);
break;
case 14:
this.applySelectStyle ("within(structure, " + spec + ")", action);
break;
case 12:
this.applySelectStyle ("within(molecule, " + spec + ")", action);
break;
case 16:
this.applySelectStyle ("within(model, " + spec + ")", action);
break;
case 17:
this.applySelectStyle ("visible and within(element, " + spec + ")", action);
break;
case 15:
this.applySelectStyle ("visible and within(site, " + spec + ")", action);
break;
}
this.viewer.clearClickCount ();
this.viewer.setStatusAtomPicked (atomIndex, null);
}, $fz.isPrivate = true, $fz), "~N,J.util.Point3fi,~N");
Clazz.defineMethod (c$, "checkTwoAtomAction", 
($fz = function (action, ptClicked, atomIndex) {
if (!this.isBound (action, 33)) return;
var isSpin = (this.atomPickingMode == 5);
if (this.viewer.getSpinOn () || this.viewer.getNavOn () || this.viewer.getPendingMeasurement () != null) {
this.resetMeasurement ();
if (this.viewer.getSpinOn ()) this.runScript ("spin off");
return;
}if (this.measurementQueued.getCount () >= 2) this.resetMeasurement ();
var queuedAtomCount = this.measurementQueued.getCount ();
if (queuedAtomCount == 1) {
if (ptClicked == null) {
if (this.measurementQueued.getAtomIndex (1) == atomIndex) return;
} else {
if (this.measurementQueued.getAtom (1).distance (ptClicked) == 0) return;
}}if (atomIndex >= 0 || ptClicked != null) queuedAtomCount = this.queueAtom (atomIndex, ptClicked);
if (queuedAtomCount < 2) {
if (isSpin) this.viewer.scriptStatus (queuedAtomCount == 1 ? J.i18n.GT._ ("pick one more atom in order to spin the model around an axis") : J.i18n.GT._ ("pick two atoms in order to spin the model around an axis"));
 else this.viewer.scriptStatus (queuedAtomCount == 1 ? J.i18n.GT._ ("pick one more atom in order to display the symmetry relationship") : J.i18n.GT._ ("pick two atoms in order to display the symmetry relationship between them"));
return;
}var s = this.measurementQueued.getMeasurementScript (" ", false);
if (isSpin) this.runScript ("spin" + s + " " + this.viewer.getPickingSpinRate ());
 else this.runScript ("draw symop" + s + ";show symop" + s);
}, $fz.isPrivate = true, $fz), "~N,J.util.Point3fi,~N");
Clazz.defineMethod (c$, "applySelectStyle", 
($fz = function (item, action) {
if (this.measurementPending != null || this.selectionWorking) return;
this.selectionWorking = true;
var s = (this.rubberbandSelectionMode || this.isBound (action, 18) ? "selected and not (" + item + ") or (not selected) and " : this.isBound (action, 19) ? "selected and not " : this.isBound (action, 20) ? "selected or " : action == 0 || this.isBound (action, 21) ? "selected tog " : this.isBound (action, 16) ? "" : null);
if (s != null) {
s += "(" + item + ")";
if (J.util.Logger.debugging) J.util.Logger.debug (s);
var bs = this.getSelectionSet (s);
if (bs != null) {
this.viewer.select (bs, false, null, false);
this.viewer.refresh (3, "selections set");
}}this.selectionWorking = false;
}, $fz.isPrivate = true, $fz), "~S,~N");
c$.$ActionManager$MotionPoint$ = function () {
Clazz.pu$h ();
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.index = 0;
this.x = 0;
this.y = 0;
this.time = 0;
Clazz.instantialize (this, arguments);
}, J.viewer.ActionManager, "MotionPoint");
Clazz.defineMethod (c$, "set", 
function (a, b, c, d) {
this.index = a;
this.x = b;
this.y = c;
this.time = d;
}, "~N,~N,~N,~N");
Clazz.overrideMethod (c$, "toString", 
function () {
return "[x = " + this.x + " y = " + this.y + " time = " + this.time + " ]";
});
c$ = Clazz.p0p ();
};
c$.$ActionManager$Gesture$ = function () {
Clazz.pu$h ();
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.action = 0;
this.nodes = null;
this.ptNext = 0;
this.time0 = 0;
Clazz.instantialize (this, arguments);
}, J.viewer.ActionManager, "Gesture");
Clazz.makeConstructor (c$, 
function (a) {
this.nodes =  new Array (a);
for (var b = 0; b < a; b++) this.nodes[b] = Clazz.innerTypeInstance (J.viewer.ActionManager.MotionPoint, this, null);

}, "~N");
Clazz.defineMethod (c$, "setAction", 
function (a, b) {
this.action = a;
this.ptNext = 0;
this.time0 = b;
for (var c = 0; c < this.nodes.length; c++) this.nodes[c].index = -1;

}, "~N,~N");
Clazz.defineMethod (c$, "getAction", 
function () {
return this.action;
});
Clazz.defineMethod (c$, "add", 
function (a, b, c, d) {
this.action = a;
this.getNode (this.ptNext).set (this.ptNext, b, c, d - this.time0);
this.ptNext++;
return this.ptNext;
}, "~N,~N,~N,~N");
Clazz.defineMethod (c$, "getTimeDifference", 
function (a) {
a = this.getPointCount (a, 0);
if (a < 2) return 0;
var b = this.getNode (this.ptNext - 1);
var c = this.getNode (this.ptNext - a);
return b.time - c.time;
}, "~N");
Clazz.defineMethod (c$, "getSpeedPixelsPerMillisecond", 
function (a, b) {
a = this.getPointCount (a, b);
if (a < 2) return 0;
var c = this.getNode (this.ptNext - 1 - b);
var d = this.getNode (this.ptNext - a - b);
var e = ((c.x - d.x)) / this.b$["J.viewer.ActionManager"].viewer.getScreenWidth () * 360;
var f = ((c.y - d.y)) / this.b$["J.viewer.ActionManager"].viewer.getScreenHeight () * 360;
return Math.sqrt (e * e + f * f) / (c.time - d.time);
}, "~N,~N");
Clazz.defineMethod (c$, "getDX", 
function (a, b) {
a = this.getPointCount (a, b);
if (a < 2) return 0;
var c = this.getNode (this.ptNext - 1 - b);
var d = this.getNode (this.ptNext - a - b);
return c.x - d.x;
}, "~N,~N");
Clazz.defineMethod (c$, "getDY", 
function (a, b) {
a = this.getPointCount (a, b);
if (a < 2) return 0;
var c = this.getNode (this.ptNext - 1 - b);
var d = this.getNode (this.ptNext - a - b);
return c.y - d.y;
}, "~N,~N");
Clazz.defineMethod (c$, "getPointCount", 
function () {
return this.ptNext;
});
Clazz.defineMethod (c$, "getPointCount", 
function (a, b) {
if (a > this.nodes.length - b) a = this.nodes.length - b;
var c = a + 1;
for (; --c >= 0; ) if (this.getNode (this.ptNext - c - b).index >= 0) break;

return c;
}, "~N,~N");
Clazz.defineMethod (c$, "getNode", 
function (a) {
return this.nodes[(a + this.nodes.length + this.nodes.length) % this.nodes.length];
}, "~N");
Clazz.overrideMethod (c$, "toString", 
function () {
if (this.nodes.length == 0) return "" + this;
return J.viewer.binding.Binding.getMouseActionName (this.action, false) + " nPoints = " + this.ptNext + " " + this.nodes[0];
});
c$ = Clazz.p0p ();
};
Clazz.defineStatics (c$,
"ACTION_center", 0,
"ACTION_translate", 1,
"ACTION_rotate", 2,
"ACTION_rotateZ", 3,
"ACTION_rotateZorZoom", 4,
"ACTION_wheelZoom", 5,
"ACTION_slideZoom", 6,
"ACTION_navTranslate", 7,
"ACTION_swipe", 8,
"ACTION_spinDrawObjectCW", 9,
"ACTION_spinDrawObjectCCW", 10,
"ACTION_slab", 11,
"ACTION_depth", 12,
"ACTION_slabAndDepth", 13,
"ACTION_popupMenu", 14,
"ACTION_clickFrank", 15,
"ACTION_select", 16,
"ACTION_selectNone", 17,
"ACTION_selectToggle", 18,
"ACTION_selectAndNot", 19,
"ACTION_selectOr", 20,
"ACTION_selectToggleExtended", 21,
"ACTION_dragSelected", 22,
"ACTION_selectAndDrag", 23,
"ACTION_dragZ", 24,
"ACTION_rotateSelected", 25,
"ACTION_rotateBranch", 26,
"ACTION_dragAtom", 27,
"ACTION_dragMinimize", 28,
"ACTION_dragMinimizeMolecule", 29,
"ACTION_dragLabel", 30,
"ACTION_dragDrawPoint", 31,
"ACTION_dragDrawObject", 32,
"ACTION_pickAtom", 33,
"ACTION_pickPoint", 34,
"ACTION_pickLabel", 35,
"ACTION_pickMeasure", 36,
"ACTION_setMeasure", 37,
"ACTION_pickIsosurface", 38,
"ACTION_pickNavigate", 39,
"ACTION_deleteAtom", 40,
"ACTION_deleteBond", 41,
"ACTION_connectAtoms", 42,
"ACTION_assignNew", 43,
"ACTION_reset", 44,
"ACTION_stopMotion", 45,
"ACTION_multiTouchSimulation", 46,
"ACTION_count", 47);
c$.actionInfo = c$.prototype.actionInfo =  new Array (47);
c$.actionNames = c$.prototype.actionNames =  new Array (47);
{
J.viewer.ActionManager.newAction (0, "_center", J.i18n.GT._ ("center"));
J.viewer.ActionManager.newAction (1, "_translate", J.i18n.GT._ ("translate"));
J.viewer.ActionManager.newAction (2, "_rotate", J.i18n.GT._ ("rotate"));
J.viewer.ActionManager.newAction (3, "_rotateZ", J.i18n.GT._ ("rotate Z"));
J.viewer.ActionManager.newAction (4, "_rotateZorZoom", J.i18n.GT._ ("rotate Z (horizontal motion of mouse) or zoom (vertical motion of mouse)"));
J.viewer.ActionManager.newAction (5, "_wheelZoom", J.i18n.GT._ ("zoom"));
J.viewer.ActionManager.newAction (6, "_slideZoom", J.i18n.GT._ ("zoom (along right edge of window)"));
J.viewer.ActionManager.newAction (7, "_navTranslate", J.i18n.GT._ ("translate navigation point (requires {0} and {1})", ["set NAVIGATIONMODE", "set picking NAVIGATE"]));
J.viewer.ActionManager.newAction (8, "_swipe", J.i18n.GT._ ("spin model (swipe and release button and stop motion simultaneously)"));
J.viewer.ActionManager.newAction (9, "_spinDrawObjectCW", J.i18n.GT._ ("click on two points to spin around axis clockwise (requires {0})", "set picking SPIN"));
J.viewer.ActionManager.newAction (10, "_spinDrawObjectCCW", J.i18n.GT._ ("click on two points to spin around axis counterclockwise (requires {0})", "set picking SPIN"));
J.viewer.ActionManager.newAction (11, "_slab", J.i18n.GT._ ("adjust slab (front plane; requires {0})", "SLAB ON"));
J.viewer.ActionManager.newAction (12, "_depth", J.i18n.GT._ ("adjust depth (back plane; requires {0})", "SLAB ON"));
J.viewer.ActionManager.newAction (13, "_slabAndDepth", J.i18n.GT._ ("move slab/depth window (both planes; requires {0})", "SLAB ON"));
J.viewer.ActionManager.newAction (14, "_popupMenu", J.i18n.GT._ ("pop up the full context menu"));
J.viewer.ActionManager.newAction (15, "_clickFrank", J.i18n.GT._ ("pop up recent context menu (click on Jmol frank)"));
J.viewer.ActionManager.newAction (16, "_select", J.i18n.GT._ ("select an atom (requires {0})", "set pickingStyle EXTENDEDSELECT"));
J.viewer.ActionManager.newAction (17, "_selectNone", J.i18n.GT._ ("select NONE (requires {0})", "set pickingStyle EXTENDEDSELECT"));
J.viewer.ActionManager.newAction (18, "_selectToggle", J.i18n.GT._ ("toggle selection (requires {0})", "set pickingStyle DRAG/EXTENDEDSELECT/RASMOL"));
J.viewer.ActionManager.newAction (19, "_selectAndNot", J.i18n.GT._ ("unselect this group of atoms (requires {0})", "set pickingStyle DRAG/EXTENDEDSELECT"));
J.viewer.ActionManager.newAction (20, "_selectOr", J.i18n.GT._ ("add this group of atoms to the set of selected atoms (requires {0})", "set pickingStyle DRAG/EXTENDEDSELECT"));
J.viewer.ActionManager.newAction (21, "_selectToggleOr", J.i18n.GT._ ("if all are selected, unselect all, otherwise add this group of atoms to the set of selected atoms (requires {0})", "set pickingStyle DRAG"));
J.viewer.ActionManager.newAction (22, "_dragSelected", J.i18n.GT._ ("move selected atoms (requires {0})", "set DRAGSELECTED"));
J.viewer.ActionManager.newAction (23, "_selectAndDrag", J.i18n.GT._ ("select and drag atoms (requires {0})", "set DRAGSELECTED"));
J.viewer.ActionManager.newAction (24, "_dragZ", J.i18n.GT._ ("drag atoms in Z direction (requires {0})", "set DRAGSELECTED"));
J.viewer.ActionManager.newAction (25, "_rotateSelected", J.i18n.GT._ ("rotate selected atoms (requires {0})", "set DRAGSELECTED"));
J.viewer.ActionManager.newAction (26, "_rotateBranch", J.i18n.GT._ ("rotate branch around bond (requires {0})", "set picking ROTATEBOND"));
J.viewer.ActionManager.newAction (27, "_dragAtom", J.i18n.GT._ ("move atom (requires {0})", "set picking DRAGATOM"));
J.viewer.ActionManager.newAction (28, "_dragMinimize", J.i18n.GT._ ("move atom and minimize molecule (requires {0})", "set picking DRAGMINIMIZE"));
J.viewer.ActionManager.newAction (29, "_dragMinimizeMolecule", J.i18n.GT._ ("move and minimize molecule (requires {0})", "set picking DRAGMINIMIZEMOLECULE"));
J.viewer.ActionManager.newAction (30, "_dragLabel", J.i18n.GT._ ("move label (requires {0})", "set picking LABEL"));
J.viewer.ActionManager.newAction (31, "_dragDrawPoint", J.i18n.GT._ ("move specific DRAW point (requires {0})", "set picking DRAW"));
J.viewer.ActionManager.newAction (32, "_dragDrawObject", J.i18n.GT._ ("move whole DRAW object (requires {0})", "set picking DRAW"));
J.viewer.ActionManager.newAction (33, "_pickAtom", J.i18n.GT._ ("pick an atom"));
J.viewer.ActionManager.newAction (34, "_pickPoint", J.i18n.GT._ ("pick a DRAW point (for measurements) (requires {0}", "set DRAWPICKING"));
J.viewer.ActionManager.newAction (35, "_pickLabel", J.i18n.GT._ ("pick a label to toggle it hidden/displayed (requires {0})", "set picking LABEL"));
J.viewer.ActionManager.newAction (36, "_pickMeasure", J.i18n.GT._ ("pick an atom to include it in a measurement (after starting a measurement or after {0})", "set picking DISTANCE/ANGLE/TORSION"));
J.viewer.ActionManager.newAction (37, "_setMeasure", J.i18n.GT._ ("pick an atom to initiate or conclude a measurement"));
J.viewer.ActionManager.newAction (38, "_pickIsosurface", J.i18n.GT._ ("pick an ISOSURFACE point (requires {0}", "set DRAWPICKING"));
J.viewer.ActionManager.newAction (39, "_pickNavigate", J.i18n.GT._ ("pick a point or atom to navigate to (requires {0})", "set NAVIGATIONMODE"));
J.viewer.ActionManager.newAction (40, "_deleteAtom", J.i18n.GT._ ("delete atom (requires {0})", "set picking DELETE ATOM"));
J.viewer.ActionManager.newAction (41, "_deleteBond", J.i18n.GT._ ("delete bond (requires {0})", "set picking DELETE BOND"));
J.viewer.ActionManager.newAction (42, "_pickConnect", J.i18n.GT._ ("connect atoms (requires {0})", "set picking CONNECT"));
J.viewer.ActionManager.newAction (43, "_assignNew", J.i18n.GT._ ("assign/new atom or bond (requires {0})", "set picking assignAtom_??/assignBond_?"));
J.viewer.ActionManager.newAction (44, "_reset", J.i18n.GT._ ("reset (when clicked off the model)"));
J.viewer.ActionManager.newAction (45, "_stopMotion", J.i18n.GT._ ("stop motion (requires {0})", "set waitForMoveTo FALSE"));
J.viewer.ActionManager.newAction (46, "_multiTouchSimulation", J.i18n.GT._ ("simulate multi-touch using the mouse)"));
}Clazz.defineStatics (c$,
"PICKING_OFF", 0,
"PICKING_IDENTIFY", 1,
"PICKING_LABEL", 2,
"PICKING_CENTER", 3,
"PICKING_DRAW", 4,
"PICKING_SPIN", 5,
"PICKING_SYMMETRY", 6,
"PICKING_DELETE_ATOM", 7,
"PICKING_DELETE_BOND", 8,
"PICKING_SELECT_ATOM", 9,
"PICKING_SELECT_GROUP", 10,
"PICKING_SELECT_CHAIN", 11,
"PICKING_SELECT_MOLECULE", 12,
"PICKING_SELECT_POLYMER", 13,
"PICKING_SELECT_STRUCTURE", 14,
"PICKING_SELECT_SITE", 15,
"PICKING_SELECT_MODEL", 16,
"PICKING_SELECT_ELEMENT", 17,
"PICKING_MEASURE", 18,
"PICKING_MEASURE_DISTANCE", 19,
"PICKING_MEASURE_ANGLE", 20,
"PICKING_MEASURE_TORSION", 21,
"PICKING_MEASURE_SEQUENCE", 22,
"PICKING_NAVIGATE", 23,
"PICKING_CONNECT", 24,
"PICKING_STRUTS", 25,
"PICKING_DRAG_SELECTED", 26,
"PICKING_DRAG_MOLECULE", 27,
"PICKING_DRAG_ATOM", 28,
"PICKING_DRAG_MINIMIZE", 29,
"PICKING_DRAG_MINIMIZE_MOLECULE", 30,
"PICKING_INVERT_STEREO", 31,
"PICKING_ASSIGN_ATOM", 32,
"PICKING_ASSIGN_BOND", 33,
"PICKING_ROTATE_BOND", 34,
"PICKING_IDENTIFY_BOND", 35,
"pickingModeNames", ["off", "identify", "label", "center", "draw", "spin", "symmetry", "deleteatom", "deletebond", "atom", "group", "chain", "molecule", "polymer", "structure", "site", "model", "element", "measure", "distance", "angle", "torsion", "sequence", "navigate", "connect", "struts", "dragselected", "dragmolecule", "dragatom", "dragminimize", "dragminimizemolecule", "invertstereo", "assignatom", "assignbond", "rotatebond", "identifybond"],
"PICKINGSTYLE_SELECT_JMOL", 0,
"PICKINGSTYLE_SELECT_CHIME", 0,
"PICKINGSTYLE_SELECT_RASMOL", 1,
"PICKINGSTYLE_SELECT_PFAAT", 2,
"PICKINGSTYLE_SELECT_DRAG", 3,
"PICKINGSTYLE_MEASURE_ON", 4,
"PICKINGSTYLE_MEASURE_OFF", 5,
"pickingStyleNames", ["toggle", "selectOrToggle", "extendedSelect", "drag", "measure", "measureoff"],
"MAX_DOUBLE_CLICK_MILLIS", 700,
"MININUM_GESTURE_DELAY_MILLISECONDS", 5,
"SLIDE_ZOOM_X_PERCENT", 98,
"DEFAULT_MOUSE_DRAG_FACTOR", 1,
"DEFAULT_MOUSE_WHEEL_FACTOR", 1.15,
"DEFAULT_GESTURE_SWIPE_FACTOR", 1);
});
