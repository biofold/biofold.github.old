Clazz.declarePackage ("J.viewer");
Clazz.load (["java.util.Hashtable", "J.constant.EnumAxesMode", "$.EnumCallback", "J.util.Matrix3f", "$.P3"], "J.viewer.StateManager", ["java.lang.Boolean", "$.Float", "$.Runtime", "java.util.Arrays", "J.constant.EnumStructure", "J.script.SV", "J.util.BS", "$.BSUtil", "$.Escape", "$.Logger", "$.SB", "$.TextFormat", "J.viewer.JC", "$.Viewer"], function () {
c$ = Clazz.decorateAsClass (function () {
this.viewer = null;
this.saved = null;
this.lastOrientation = "";
this.lastConnections = "";
this.lastSelected = "";
this.lastState = "";
this.lastShape = "";
this.lastCoordinates = "";
if (!Clazz.isClassDefined ("J.viewer.StateManager.Orientation")) {
J.viewer.StateManager.$StateManager$Orientation$ ();
}
if (!Clazz.isClassDefined ("J.viewer.StateManager.Connections")) {
J.viewer.StateManager.$StateManager$Connections$ ();
}
if (!Clazz.isClassDefined ("J.viewer.StateManager.GlobalSettings")) {
J.viewer.StateManager.$StateManager$GlobalSettings$ ();
}
Clazz.instantialize (this, arguments);
}, J.viewer, "StateManager");
Clazz.prepareFields (c$, function () {
this.saved =  new java.util.Hashtable ();
});
c$.getVariableList = Clazz.defineMethod (c$, "getVariableList", 
function (htVariables, nMax, withSites, definedOnly) {
var sb =  new J.util.SB ();
var n = 0;
var list =  new Array (htVariables.size ());
for (var entry, $entry = htVariables.entrySet ().iterator (); $entry.hasNext () && ((entry = $entry.next ()) || true);) {
var key = entry.getKey ();
var $var = entry.getValue ();
if ((withSites || !key.startsWith ("site_")) && (!definedOnly || key.charAt (0) == '@')) list[n++] = key + (key.charAt (0) == '@' ? " " + $var.asString () : " = " + J.viewer.StateManager.varClip (key, $var.escape (), nMax));
}
java.util.Arrays.sort (list, 0, n);
for (var i = 0; i < n; i++) if (list[i] != null) sb.append ("  ").append (list[i]).append (";\n");

if (n == 0 && !definedOnly) sb.append ("# --no global user variables defined--;\n");
return sb.toString ();
}, "java.util.Map,~N,~B,~B");
c$.getObjectIdFromName = Clazz.defineMethod (c$, "getObjectIdFromName", 
function (name) {
if (name == null) return -1;
var objID = "background axis1      axis2      axis3      boundbox   unitcell   frank      ".indexOf (name.toLowerCase ());
return (objID < 0 ? objID : Clazz.doubleToInt (objID / 11));
}, "~S");
c$.getObjectNameFromId = Clazz.defineMethod (c$, "getObjectNameFromId", 
function (objId) {
if (objId < 0 || objId >= 8) return null;
return "background axis1      axis2      axis3      boundbox   unitcell   frank      ".substring (objId * 11, objId * 11 + 11).trim ();
}, "~N");
Clazz.makeConstructor (c$, 
function (viewer) {
this.viewer = viewer;
}, "J.viewer.Viewer");
Clazz.defineMethod (c$, "getGlobalSettings", 
function (gsOld, clearUserVariables) {
return Clazz.innerTypeInstance (J.viewer.StateManager.GlobalSettings, this, null, gsOld, clearUserVariables);
}, "J.viewer.StateManager.GlobalSettings,~B");
Clazz.defineMethod (c$, "clear", 
function (global) {
this.viewer.setShowAxes (false);
this.viewer.setShowBbcage (false);
this.viewer.setShowUnitCell (false);
global.clear ();
}, "J.viewer.StateManager.GlobalSettings");
Clazz.defineMethod (c$, "setCrystallographicDefaults", 
function () {
this.viewer.setAxesModeUnitCell (true);
this.viewer.setShowAxes (true);
this.viewer.setShowUnitCell (true);
this.viewer.setBooleanProperty ("perspectiveDepth", false);
});
Clazz.defineMethod (c$, "setCommonDefaults", 
($fz = function () {
this.viewer.setBooleanProperty ("perspectiveDepth", true);
this.viewer.setFloatProperty ("bondTolerance", 0.45);
this.viewer.setFloatProperty ("minBondDistance", 0.4);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setJmolDefaults", 
function () {
this.setCommonDefaults ();
this.viewer.setStringProperty ("defaultColorScheme", "Jmol");
this.viewer.setBooleanProperty ("axesOrientationRasmol", false);
this.viewer.setBooleanProperty ("zeroBasedXyzRasmol", false);
this.viewer.setIntProperty ("percentVdwAtom", 23);
this.viewer.setIntProperty ("bondRadiusMilliAngstroms", 150);
this.viewer.setDefaultVdw ("auto");
});
Clazz.defineMethod (c$, "setRasMolDefaults", 
function () {
this.setCommonDefaults ();
this.viewer.setStringProperty ("defaultColorScheme", "RasMol");
this.viewer.setBooleanProperty ("axesOrientationRasmol", true);
this.viewer.setBooleanProperty ("zeroBasedXyzRasmol", true);
this.viewer.setIntProperty ("percentVdwAtom", 0);
this.viewer.setIntProperty ("bondRadiusMilliAngstroms", 1);
this.viewer.setDefaultVdw ("Rasmol");
});
Clazz.defineMethod (c$, "listSavedStates", 
function () {
var names = "";
var e = this.saved.keySet ().iterator ();
while (e.hasNext ()) names += "\n" + e.next ();

return names;
});
Clazz.defineMethod (c$, "deleteSavedType", 
($fz = function (type) {
var e = this.saved.keySet ().iterator ();
while (e.hasNext ()) {
var name = e.next ();
if (name.startsWith (type)) {
e.remove ();
J.util.Logger.debug ("deleted " + name);
}}
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "deleteSaved", 
function (name) {
this.saved.remove (name);
}, "~S");
Clazz.defineMethod (c$, "saveSelection", 
function (saveName, bsSelected) {
if (saveName.equalsIgnoreCase ("DELETE")) {
this.deleteSavedType ("Selected_");
return;
}saveName = this.lastSelected = "Selected_" + saveName;
this.saved.put (saveName, J.util.BSUtil.copy (bsSelected));
}, "~S,J.util.BS");
Clazz.defineMethod (c$, "restoreSelection", 
function (saveName) {
var name = (saveName.length > 0 ? "Selected_" + saveName : this.lastSelected);
var bsSelected = this.saved.get (name);
if (bsSelected == null) {
this.viewer.select ( new J.util.BS (), false, null, false);
return false;
}this.viewer.select (bsSelected, false, null, false);
return true;
}, "~S");
Clazz.defineMethod (c$, "saveState", 
function (saveName) {
if (saveName.equalsIgnoreCase ("DELETE")) {
this.deleteSavedType ("State_");
return;
}saveName = this.lastState = "State_" + saveName;
this.saved.put (saveName, this.viewer.getStateInfo ());
}, "~S");
Clazz.defineMethod (c$, "getSavedState", 
function (saveName) {
var name = (saveName.length > 0 ? "State_" + saveName : this.lastState);
var script = this.saved.get (name);
return (script == null ? "" : script);
}, "~S");
Clazz.defineMethod (c$, "saveStructure", 
function (saveName) {
if (saveName.equalsIgnoreCase ("DELETE")) {
this.deleteSavedType ("Shape_");
return;
}saveName = this.lastShape = "Shape_" + saveName;
this.saved.put (saveName, this.viewer.getStructureState ());
}, "~S");
Clazz.defineMethod (c$, "getSavedStructure", 
function (saveName) {
var name = (saveName.length > 0 ? "Shape_" + saveName : this.lastShape);
var script = this.saved.get (name);
return (script == null ? "" : script);
}, "~S");
Clazz.defineMethod (c$, "saveCoordinates", 
function (saveName, bsSelected) {
if (saveName.equalsIgnoreCase ("DELETE")) {
this.deleteSavedType ("Coordinates_");
return;
}saveName = this.lastCoordinates = "Coordinates_" + saveName;
this.saved.put (saveName, this.viewer.getCoordinateState (bsSelected));
}, "~S,J.util.BS");
Clazz.defineMethod (c$, "getSavedCoordinates", 
function (saveName) {
var name = (saveName.length > 0 ? "Coordinates_" + saveName : this.lastCoordinates);
var script = this.saved.get (name);
return (script == null ? "" : script);
}, "~S");
Clazz.defineMethod (c$, "getOrientation", 
function () {
return Clazz.innerTypeInstance (J.viewer.StateManager.Orientation, this, null, false);
});
Clazz.defineMethod (c$, "getSavedOrientationText", 
function (saveName) {
var o;
if (saveName != null) {
o = this.getOrientation (saveName);
return (o == null ? "" : o.getMoveToText (true));
}var sb =  new J.util.SB ();
var e = this.saved.keySet ().iterator ();
while (e.hasNext ()) {
var name = e.next ();
if (!name.startsWith ("Orientation_")) {
continue;
}sb.append ((this.saved.get (name)).getMoveToText (true));
}
return sb.toString ();
}, "~S");
Clazz.defineMethod (c$, "saveOrientation", 
function (saveName) {
if (saveName.equalsIgnoreCase ("DELETE")) {
this.deleteSavedType ("Orientation_");
return;
}var o = Clazz.innerTypeInstance (J.viewer.StateManager.Orientation, this, null, saveName.equals ("default"));
o.saveName = this.lastOrientation = "Orientation_" + saveName;
this.saved.put (o.saveName, o);
}, "~S");
Clazz.defineMethod (c$, "restoreOrientation", 
function (saveName, timeSeconds, isAll) {
var o = this.getOrientation (saveName);
if (o == null) return false;
o.restore (timeSeconds, isAll);
return true;
}, "~S,~N,~B");
Clazz.defineMethod (c$, "getOrientation", 
($fz = function (saveName) {
var name = (saveName.length > 0 ? "Orientation_" + saveName : this.lastOrientation);
return this.saved.get (name);
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "saveBonds", 
function (saveName) {
if (saveName.equalsIgnoreCase ("DELETE")) {
this.deleteSavedType ("Bonds_");
return;
}var b = Clazz.innerTypeInstance (J.viewer.StateManager.Connections, this, null);
b.saveName = this.lastConnections = "Bonds_" + saveName;
this.saved.put (b.saveName, b);
}, "~S");
Clazz.defineMethod (c$, "restoreBonds", 
function (saveName) {
var name = (saveName.length > 0 ? "Bonds_" + saveName : this.lastConnections);
var c = this.saved.get (name);
if (c == null) return false;
c.restore ();
return true;
}, "~S");
c$.doReportProperty = Clazz.defineMethod (c$, "doReportProperty", 
function (name) {
return (name.charAt (0) != '_' && J.viewer.StateManager.unreportedProperties.indexOf (";" + name + ";") < 0);
}, "~S");
c$.getJmolVersionInt = Clazz.defineMethod (c$, "getJmolVersionInt", 
function () {
var s = J.viewer.JC.version;
var version = -1;
try {
var i = s.indexOf (".");
if (i < 0) {
version = 100000 * Integer.parseInt (s);
return version;
}version = 100000 * Integer.parseInt (s.substring (0, i));
s = s.substring (i + 1);
i = s.indexOf (".");
if (i < 0) {
version += 1000 * Integer.parseInt (s);
return version;
}version += 1000 * Integer.parseInt (s.substring (0, i));
s = s.substring (i + 1);
i = s.indexOf ("_");
if (i >= 0) s = s.substring (0, i);
i = s.indexOf (" ");
if (i >= 0) s = s.substring (0, i);
version += Integer.parseInt (s);
} catch (e) {
if (Clazz.exceptionOf (e, NumberFormatException)) {
} else {
throw e;
}
}
return version;
});
c$.varClip = Clazz.defineMethod (c$, "varClip", 
function (name, sv, nMax) {
if (nMax > 0 && sv.length > nMax) sv = sv.substring (0, nMax) + " #...more (" + sv.length + " bytes -- use SHOW " + name + " or MESSAGE @" + name + " to view)";
return sv;
}, "~S,~S,~N");
c$.$StateManager$Orientation$ = function () {
Clazz.pu$h ();
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.saveName = null;
this.rotationMatrix = null;
this.xTrans = 0;
this.yTrans = 0;
this.zoom = 0;
this.rotationRadius = 0;
this.center = null;
this.navCenter = null;
this.xNav = NaN;
this.yNav = NaN;
this.navDepth = NaN;
this.windowCenteredFlag = false;
this.navigationMode = false;
this.moveToText = null;
Clazz.instantialize (this, arguments);
}, J.viewer.StateManager, "Orientation");
Clazz.prepareFields (c$, function () {
this.rotationMatrix =  new J.util.Matrix3f ();
this.center =  new J.util.P3 ();
this.navCenter =  new J.util.P3 ();
});
Clazz.makeConstructor (c$, 
function (a) {
if (a) {
var b = this.b$["J.viewer.StateManager"].viewer.getModelSetAuxiliaryInfoValue ("defaultOrientationMatrix");
if (b == null) this.rotationMatrix.setIdentity ();
 else this.rotationMatrix.setM (b);
} else {
this.b$["J.viewer.StateManager"].viewer.getRotation (this.rotationMatrix);
}this.xTrans = this.b$["J.viewer.StateManager"].viewer.getTranslationXPercent ();
this.yTrans = this.b$["J.viewer.StateManager"].viewer.getTranslationYPercent ();
this.zoom = this.b$["J.viewer.StateManager"].viewer.getZoomSetting ();
this.center.setT (this.b$["J.viewer.StateManager"].viewer.getRotationCenter ());
this.windowCenteredFlag = this.b$["J.viewer.StateManager"].viewer.isWindowCentered ();
this.rotationRadius = this.b$["J.viewer.StateManager"].viewer.getRotationRadius ();
this.navigationMode = this.b$["J.viewer.StateManager"].viewer.getNavigationMode ();
this.moveToText = this.b$["J.viewer.StateManager"].viewer.getMoveToText (-1);
if (this.navigationMode) {
this.xNav = this.b$["J.viewer.StateManager"].viewer.getNavigationOffsetPercent ('X');
this.yNav = this.b$["J.viewer.StateManager"].viewer.getNavigationOffsetPercent ('Y');
this.navDepth = this.b$["J.viewer.StateManager"].viewer.getNavigationDepthPercent ();
this.navCenter = J.util.P3.newP (this.b$["J.viewer.StateManager"].viewer.getNavigationCenter ());
}}, "~B");
Clazz.defineMethod (c$, "getMoveToText", 
function (a) {
return (a ? "  " + this.moveToText + "\n  save orientation \"" + this.saveName.substring (12) + "\";\n" : this.moveToText);
}, "~B");
Clazz.defineMethod (c$, "restore", 
function (a, b) {
if (!b) {
this.b$["J.viewer.StateManager"].viewer.setRotationMatrix (this.rotationMatrix);
return;
}this.b$["J.viewer.StateManager"].viewer.setBooleanProperty ("windowCentered", this.windowCenteredFlag);
this.b$["J.viewer.StateManager"].viewer.setBooleanProperty ("navigationMode", this.navigationMode);
this.b$["J.viewer.StateManager"].viewer.moveTo (this.b$["J.viewer.StateManager"].viewer.eval, a, this.center, null, NaN, this.rotationMatrix, this.zoom, this.xTrans, this.yTrans, this.rotationRadius, this.navCenter, this.xNav, this.yNav, this.navDepth);
}, "~N,~B");
c$ = Clazz.p0p ();
};
c$.$StateManager$Connections$ = function () {
Clazz.pu$h ();
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.saveName = null;
this.bondCount = 0;
this.connections = null;
Clazz.instantialize (this, arguments);
}, J.viewer.StateManager, "Connections");
Clazz.makeConstructor (c$, 
function () {
var a = this.b$["J.viewer.StateManager"].viewer.getModelSet ();
if (a == null) return;
this.bondCount = a.bondCount;
this.connections =  new Array (this.bondCount + 1);
var b = a.bonds;
for (var c = this.bondCount; --c >= 0; ) {
var d = b[c];
this.connections[c] =  new J.viewer.StateManager.Connection (d.getAtomIndex1 (), d.getAtomIndex2 (), d.mad, d.colix, d.order, d.getEnergy (), d.getShapeVisibilityFlags ());
}
});
Clazz.defineMethod (c$, "restore", 
function () {
var a = this.b$["J.viewer.StateManager"].viewer.getModelSet ();
if (a == null) return;
a.deleteAllBonds ();
for (var b = this.bondCount; --b >= 0; ) {
var c = this.connections[b];
var d = a.getAtomCount ();
if (c.atomIndex1 >= d || c.atomIndex2 >= d) continue;
var e = a.bondAtoms (a.atoms[c.atomIndex1], a.atoms[c.atomIndex2], c.order, c.mad, null, c.energy, false, true);
e.setColix (c.colix);
e.setShapeVisibilityFlags (c.shapeVisibilityFlags);
}
for (var c = this.bondCount; --c >= 0; ) a.getBondAt (c).setIndex (c);

this.b$["J.viewer.StateManager"].viewer.setShapeProperty (1, "reportAll", null);
});
c$ = Clazz.p0p ();
};
c$.$StateManager$GlobalSettings$ = function () {
Clazz.pu$h ();
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.htNonbooleanParameterValues = null;
this.htBooleanParameterFlags = null;
this.htPropertyFlagsRemoved = null;
this.htUserVariables = null;
this.databases = null;
this.ambientPercent = 45;
this.diffusePercent = 84;
this.specular = true;
this.specularExponent = 6;
this.phongExponent = 64;
this.specularPercent = 22;
this.specularPower = 40;
this.zDepth = 0;
this.zShadePower = 3;
this.zSlab = 50;
this.slabByMolecule = false;
this.slabByAtom = false;
this.allowEmbeddedScripts = true;
this.appendNew = true;
this.appletProxy = "";
this.applySymmetryToBonds = false;
this.atomTypes = "";
this.autoBond = true;
this.axesOrientationRasmol = false;
this.bondRadiusMilliAngstroms = 150;
this.bondTolerance = 0.45;
this.defaultDirectory = "";
this.defaultStructureDSSP = true;
this.ptDefaultLattice = null;
this.defaultLoadScript = "";
this.defaultLoadFilter = "";
this.defaultDropScript = "zap; load SYNC %FILE;if (%ALLOWCARTOONS && _loadScript == '' && defaultLoadScript == '' && _filetype == 'Pdb') {if ({(protein or nucleic)&*/1.1} && {*/1.1}[1].groupindex != {*/1.1}[0].groupindex){select protein or nucleic;cartoons only;}if ({visible}){color structure}else{wireframe -0.1};if (!{visible}){spacefill 23%};select *}";
this.forceAutoBond = false;
this.fractionalRelative = false;
this.inlineNewlineChar = '|';
this.loadFormat = null;
this.loadLigandFormat = null;
this.nmrUrlFormat = null;
this.smilesUrlFormat = null;
this.nihResolverFormat = null;
this.pubChemFormat = null;
this.edsUrlFormat = "http://eds.bmc.uu.se/eds/dfs/%LC13/%LCFILE/%LCFILE.omap";
this.edsUrlCutoff = "load('http://eds.bmc.uu.se/eds/dfs/%LC13/%LCFILE/%LCFILE.sfdat').lines.find('MAP_SIGMA').split(' ')[2]";
this.edsUrlOptions = "within 2.0 {*}";
this.minBondDistance = 0.4;
this.minPixelSelRadius = 6;
this.pdbAddHydrogens = false;
this.pdbGetHeader = false;
this.pdbSequential = false;
this.percentVdwAtom = 23;
this.smallMoleculeMaxAtoms = 40000;
this.smartAromatic = true;
this.zeroBasedXyzRasmol = false;
this.legacyAutoBonding = false;
this.allowRotateSelected = false;
this.allowMoveAtoms = false;
this.perspectiveDepth = true;
this.visualRange = 5;
this.solventOn = false;
this.defaultAngleLabel = "%VALUE %UNITS";
this.defaultDistanceLabel = "%VALUE %UNITS";
this.defaultTorsionLabel = "%VALUE %UNITS";
this.justifyMeasurements = false;
this.measureAllModels = false;
this.minimizationSteps = 100;
this.minimizationRefresh = true;
this.minimizationSilent = false;
this.minimizationCriterion = 0.001;
this.antialiasDisplay = false;
this.antialiasImages = true;
this.imageState = true;
this.antialiasTranslucent = true;
this.displayCellParameters = true;
this.dotsSelectedOnly = false;
this.dotSurface = true;
this.dotDensity = 3;
this.dotScale = 1;
this.meshScale = 1;
this.dynamicMeasurements = false;
this.greyscaleRendering = false;
this.isosurfaceKey = false;
this.isosurfacePropertySmoothing = true;
this.isosurfacePropertySmoothingPower = 7;
this.repaintWaitMs = 1000;
this.showHiddenSelectionHalos = false;
this.showKeyStrokes = true;
this.showMeasurements = true;
this.showTiming = false;
this.zoomLarge = true;
this.backgroundImageFileName = null;
this.partialDots = false;
this.bondModeOr = false;
this.hbondsBackbone = false;
this.hbondsAngleMinimum = 90;
this.hbondsDistanceMaximum = 3.25;
this.hbondsRasmol = true;
this.hbondsSolid = false;
this.modeMultipleBond = 2;
this.showHydrogens = true;
this.showMultipleBonds = true;
this.ssbondsBackbone = false;
this.multipleBondSpacing = -1;
this.multipleBondRadiusFactor = 0;
this.cartoonBaseEdges = false;
this.cartoonRockets = false;
this.cartoonFancy = false;
this.chainCaseSensitive = false;
this.hermiteLevel = 0;
this.highResolutionFlag = false;
this.rangeSelected = false;
this.rasmolHydrogenSetting = true;
this.rasmolHeteroSetting = true;
this.ribbonAspectRatio = 16;
this.ribbonBorder = false;
this.rocketBarrels = false;
this.sheetSmoothing = 1;
this.traceAlpha = true;
this.twistedSheets = false;
this.allowGestures = false;
this.allowModelkit = true;
this.allowMultiTouch = true;
this.allowKeyStrokes = false;
this.animationFps = 10;
this.atomPicking = true;
this.autoFps = false;
this.axesMode = null;
this.axesScale = 2;
this.bondPicking = false;
this.cameraDepth = 3.0;
this.celShading = false;
this.dataSeparator = "~~~";
this.debugScript = false;
this.defaultDrawArrowScale = 0.5;
this.defaultLabelXYZ = "%a";
this.defaultLabelPDB = "%m%r";
this.defaultTranslucent = 0.5;
this.delayMaximumMs = 0;
this.dipoleScale = 1.0;
this.disablePopupMenu = false;
this.dragSelected = false;
this.drawHover = false;
this.drawPicking = false;
this.dsspCalcHydrogen = true;
this.energyUnits = "kJ";
this.helpPath = "http://chemapps.stolaf.edu/jmol/docs/index.htm";
this.fontScaling = false;
this.fontCaching = true;
this.forceField = "MMFF";
this.helixStep = 1;
this.hideNameInPopup = false;
this.hoverDelayMs = 500;
this.loadAtomDataTolerance = 0.01;
this.logCommands = false;
this.logGestures = false;
this.measureDistanceUnits = "nanometers";
this.measurementLabels = true;
this.messageStyleChime = false;
this.monitorEnergy = false;
this.multiProcessor = true;
this.pickingSpinRate = 10;
this.pickLabel = "";
this.pointGroupDistanceTolerance = 0.2;
this.pointGroupLinearTolerance = 8.0;
this.preserveState = true;
this.propertyColorScheme = "roygb";
this.quaternionFrame = "p";
this.saveProteinStructureState = true;
this.solventProbeRadius = 1.2;
this.scriptDelay = 0;
this.selectAllModels = true;
this.statusReporting = true;
this.strandCountForStrands = 5;
this.strandCountForMeshRibbon = 7;
this.strutSpacing = 6;
this.strutLengthMaximum = 7.0;
this.strutDefaultRadius = 0.3;
this.strutsMultiple = false;
this.useArcBall = false;
this.useMinimizationThread = true;
this.useNumberLocalization = true;
this.useScriptQueue = true;
this.waitForMoveTo = true;
this.vectorScale = 1;
this.vectorSymmetry = false;
this.vibrationPeriod = 1;
this.vibrationScale = 1;
this.wireframeRotation = false;
this.hideNavigationPoint = false;
this.navigationMode = false;
this.navigationPeriodic = false;
this.navigationSpeed = 5;
this.showNavigationPointAlways = false;
this.stereoState = null;
this.modelKitMode = false;
this.objColors = null;
this.objStateOn = null;
this.objMad = null;
this.ellipsoidAxes = false;
this.ellipsoidDots = false;
this.ellipsoidArcs = false;
this.ellipsoidFill = false;
this.ellipsoidBall = true;
this.ellipsoidDotCount = 200;
this.ellipsoidAxisDiameter = 0.02;
this.testFlag1 = false;
this.testFlag2 = false;
this.testFlag3 = false;
this.testFlag4 = false;
this.structureList = null;
this.haveSetStructureList = false;
this.userDatabases = null;
Clazz.instantialize (this, arguments);
}, J.viewer.StateManager, "GlobalSettings");
Clazz.prepareFields (c$, function () {
this.htUserVariables =  new java.util.Hashtable ();
this.ptDefaultLattice =  new J.util.P3 ();
this.axesMode = J.constant.EnumAxesMode.BOUNDBOX;
this.objColors =  Clazz.newIntArray (8, 0);
this.objStateOn =  Clazz.newBooleanArray (8, false);
this.objMad =  Clazz.newIntArray (8, 0);
this.structureList =  new java.util.Hashtable ();
{
this.structureList.put (J.constant.EnumStructure.TURN, [30, 90, -15, 95]);
this.structureList.put (J.constant.EnumStructure.SHEET, [-180, -10, 70, 180, -180, -45, -180, -130, 140, 180, 90, 180]);
this.structureList.put (J.constant.EnumStructure.HELIX, [-160, 0, -100, 45]);
}});
Clazz.makeConstructor (c$, 
function (a, b) {
this.registerAllValues (a, b);
}, "J.viewer.StateManager.GlobalSettings,~B");
Clazz.defineMethod (c$, "clear", 
function () {
var a = this.htUserVariables.keySet ().iterator ();
while (a.hasNext ()) {
var b = a.next ();
if (b.charAt (0) == '@' || b.startsWith ("site_")) a.remove ();
}
this.setPicked (-1);
this.setI ("_atomhovered", -1);
this.setS ("_pickinfo", "");
this.setB ("selectionhalos", false);
this.setB ("hidenotselected", false);
this.setB ("measurementlabels", this.measurementLabels = true);
this.setB ("drawHover", this.drawHover = false);
});
Clazz.defineMethod (c$, "registerAllValues", 
function (a, b) {
this.htNonbooleanParameterValues =  new java.util.Hashtable ();
this.htBooleanParameterFlags =  new java.util.Hashtable ();
this.htPropertyFlagsRemoved =  new java.util.Hashtable ();
if (a != null) {
if (!b) this.htUserVariables = a.htUserVariables;
this.debugScript = a.debugScript;
this.disablePopupMenu = a.disablePopupMenu;
this.messageStyleChime = a.messageStyleChime;
this.defaultDirectory = a.defaultDirectory;
this.allowGestures = a.allowGestures;
this.allowModelkit = a.allowModelkit;
this.allowMultiTouch = a.allowMultiTouch;
this.allowKeyStrokes = a.allowKeyStrokes;
this.legacyAutoBonding = a.legacyAutoBonding;
this.useScriptQueue = a.useScriptQueue;
this.useArcBall = a.useArcBall;
this.databases = a.databases;
}if (this.databases == null) {
this.databases =  new java.util.Hashtable ();
this.getDataBaseList (J.viewer.JC.databases);
this.getDataBaseList (this.userDatabases);
}this.loadFormat = this.databases.get ("pdb");
this.loadLigandFormat = this.databases.get ("ligand");
this.nmrUrlFormat = this.databases.get ("nmr");
this.smilesUrlFormat = this.databases.get ("nci") + "/file?format=sdf&get3d=True";
this.nihResolverFormat = this.databases.get ("nci");
this.pubChemFormat = this.databases.get ("pubchem");
for (var item, $item = 0, $$item = J.constant.EnumCallback.values (); $item < $$item.length && ((item = $$item[$item]) || true); $item++) this.resetValue (item.name () + "Callback", a);

this.setI ("historyLevel", 0);
this.setI ("depth", 0);
this.setF ("gestureSwipeFactor", 1.0);
this.setB ("hideNotSelected", false);
this.setS ("hoverLabel", "");
this.setB ("isKiosk", this.b$["J.viewer.StateManager"].viewer.isKiosk ());
this.setS ("logFile", this.b$["J.viewer.StateManager"].viewer.getLogFile ());
this.setI ("logLevel", J.util.Logger.getLogLevel ());
this.setF ("mouseWheelFactor", 1.15);
this.setF ("mouseDragFactor", 1.0);
this.setI ("navFps", 10);
this.setI ("navigationDepth", 0);
this.setI ("navigationSlab", 0);
this.setI ("navX", 0);
this.setI ("navY", 0);
this.setI ("navZ", 0);
this.setS ("pathForAllFiles", "");
this.setI ("perspectiveModel", 11);
this.setS ("picking", "identify");
this.setS ("pickingStyle", "toggle");
this.setB ("refreshing", true);
this.setI ("rotationRadius", 0);
this.setI ("scaleAngstromsPerInch", 0);
this.setI ("scriptReportingLevel", 0);
this.setB ("selectionHalos", false);
this.setB ("showaxes", false);
this.setB ("showboundbox", false);
this.setB ("showfrank", false);
this.setB ("showUnitcell", false);
this.setI ("slab", 100);
this.setB ("slabEnabled", false);
this.setF ("slabrange", 0);
this.setI ("spinX", 0);
this.setI ("spinY", 30);
this.setI ("spinZ", 0);
this.setI ("spinFps", 30);
this.setI ("stereoDegrees", -5);
this.setI ("stateversion", 0);
this.setB ("syncScript", this.b$["J.viewer.StateManager"].viewer.getStatusManager ().syncingScripts);
this.setB ("syncMouse", this.b$["J.viewer.StateManager"].viewer.getStatusManager ().syncingMouse);
this.setB ("syncStereo", this.b$["J.viewer.StateManager"].viewer.getStatusManager ().stereoSync);
this.setB ("windowCentered", true);
this.setB ("zoomEnabled", true);
this.setI ("zDepth", 0);
this.setB ("zShade", false);
this.setI ("zSlab", 50);
this.setI ("_version", J.viewer.StateManager.getJmolVersionInt ());
this.setB ("axesWindow", true);
this.setB ("axesMolecular", false);
this.setB ("axesPosition", false);
this.setB ("axesUnitcell", false);
this.setI ("backgroundModel", 0);
this.setB ("colorRasmol", false);
this.setS ("currentLocalPath", "");
this.setS ("defaultLattice", "{0 0 0}");
this.setS ("defaultColorScheme", "Jmol");
this.setS ("defaultDirectoryLocal", "");
this.setS ("defaults", "Jmol");
this.setS ("defaultVDW", "Jmol");
this.setS ("exportDrivers", "Idtf;Maya;Povray;Vrml;X3d;Tachyon;Obj");
this.setI ("propertyAtomNumberColumnCount", 0);
this.setI ("propertyAtomNumberField", 0);
this.setI ("propertyDataColumnCount", 0);
this.setI ("propertyDataField", 0);
this.setB ("undo", true);
this.setB ("allowEmbeddedScripts", this.allowEmbeddedScripts);
this.setB ("allowGestures", this.allowGestures);
this.setB ("allowKeyStrokes", this.allowKeyStrokes);
this.setB ("allowModelkit", this.allowModelkit);
this.setB ("allowMultiTouch", this.allowMultiTouch);
this.setB ("allowRotateSelected", this.allowRotateSelected);
this.setB ("allowMoveAtoms", this.allowMoveAtoms);
this.setI ("ambientPercent", this.ambientPercent);
this.setI ("animationFps", this.animationFps);
this.setB ("antialiasImages", this.antialiasImages);
this.setB ("antialiasDisplay", this.antialiasDisplay);
this.setB ("antialiasTranslucent", this.antialiasTranslucent);
this.setB ("appendNew", this.appendNew);
this.setS ("appletProxy", this.appletProxy);
this.setB ("applySymmetryToBonds", this.applySymmetryToBonds);
this.setB ("atomPicking", this.atomPicking);
this.setS ("atomTypes", this.atomTypes);
this.setB ("autoBond", this.autoBond);
this.setB ("autoFps", this.autoFps);
this.setI ("axesMode", this.axesMode.getCode ());
this.setF ("axesScale", this.axesScale);
this.setB ("axesOrientationRasmol", this.axesOrientationRasmol);
this.setB ("bondModeOr", this.bondModeOr);
this.setB ("bondPicking", this.bondPicking);
this.setI ("bondRadiusMilliAngstroms", this.bondRadiusMilliAngstroms);
this.setF ("bondTolerance", this.bondTolerance);
this.setF ("cameraDepth", this.cameraDepth);
this.setB ("cartoonBaseEdges", this.cartoonBaseEdges);
this.setB ("cartoonFancy", this.cartoonFancy);
this.setB ("cartoonRockets", this.cartoonRockets);
this.setB ("chainCaseSensitive", this.chainCaseSensitive);
this.setB ("celShading", this.celShading);
this.setS ("dataSeparator", this.dataSeparator);
this.setB ("debugScript", this.debugScript);
this.setS ("defaultAngleLabel", this.defaultAngleLabel);
this.setF ("defaultDrawArrowScale", this.defaultDrawArrowScale);
this.setS ("defaultDirectory", this.defaultDirectory);
this.setS ("defaultDistanceLabel", this.defaultDistanceLabel);
this.setS ("defaultDropScript", this.defaultDropScript);
this.setS ("defaultLabelPDB", this.defaultLabelPDB);
this.setS ("defaultLabelXYZ", this.defaultLabelXYZ);
this.setS ("defaultLoadFilter", this.defaultLoadFilter);
this.setS ("defaultLoadScript", this.defaultLoadScript);
this.setB ("defaultStructureDSSP", this.defaultStructureDSSP);
this.setS ("defaultTorsionLabel", this.defaultTorsionLabel);
this.setF ("defaultTranslucent", this.defaultTranslucent);
this.setI ("delayMaximumMs", this.delayMaximumMs);
this.setI ("diffusePercent", this.diffusePercent);
this.setF ("dipoleScale", this.dipoleScale);
this.setB ("disablePopupMenu", this.disablePopupMenu);
this.setB ("displayCellParameters", this.displayCellParameters);
this.setI ("dotDensity", this.dotDensity);
this.setI ("dotScale", this.dotScale);
this.setB ("dotsSelectedOnly", this.dotsSelectedOnly);
this.setB ("dotSurface", this.dotSurface);
this.setB ("dragSelected", this.dragSelected);
this.setB ("drawHover", this.drawHover);
this.setB ("drawPicking", this.drawPicking);
this.setB ("dsspCalculateHydrogenAlways", this.dsspCalcHydrogen);
this.setB ("dynamicMeasurements", this.dynamicMeasurements);
this.setS ("edsUrlFormat", this.edsUrlFormat);
this.setS ("edsUrlCutoff", this.edsUrlCutoff);
this.setB ("ellipsoidArcs", this.ellipsoidArcs);
this.setB ("ellipsoidAxes", this.ellipsoidAxes);
this.setF ("ellipsoidAxisDiameter", this.ellipsoidAxisDiameter);
this.setB ("ellipsoidBall", this.ellipsoidBall);
this.setI ("ellipsoidDotCount", this.ellipsoidDotCount);
this.setB ("ellipsoidDots", this.ellipsoidDots);
this.setB ("ellipsoidFill", this.ellipsoidFill);
this.setS ("energyUnits", this.energyUnits);
this.setB ("fontScaling", this.fontScaling);
this.setB ("fontCaching", this.fontCaching);
this.setB ("forceAutoBond", this.forceAutoBond);
this.setS ("forceField", this.forceField);
this.setB ("fractionalRelative", this.fractionalRelative);
this.setB ("greyscaleRendering", this.greyscaleRendering);
this.setF ("hbondsAngleMinimum", this.hbondsAngleMinimum);
this.setF ("hbondsDistanceMaximum", this.hbondsDistanceMaximum);
this.setB ("hbondsBackbone", this.hbondsBackbone);
this.setB ("hbondsRasmol", this.hbondsRasmol);
this.setB ("hbondsSolid", this.hbondsSolid);
this.setI ("helixStep", this.helixStep);
this.setS ("helpPath", this.helpPath);
this.setI ("hermiteLevel", this.hermiteLevel);
this.setB ("hideNameInPopup", this.hideNameInPopup);
this.setB ("hideNavigationPoint", this.hideNavigationPoint);
this.setB ("highResolution", this.highResolutionFlag);
this.setF ("hoverDelay", this.hoverDelayMs / 1000);
this.setB ("imageState", this.imageState);
this.setB ("isosurfaceKey", this.isosurfaceKey);
this.setB ("isosurfacePropertySmoothing", this.isosurfacePropertySmoothing);
this.setI ("isosurfacePropertySmoothingPower", this.isosurfacePropertySmoothingPower);
this.setB ("justifyMeasurements", this.justifyMeasurements);
this.setB ("legacyAutoBonding", this.legacyAutoBonding);
this.setF ("loadAtomDataTolerance", this.loadAtomDataTolerance);
this.setS ("loadFormat", this.loadFormat);
this.setS ("loadLigandFormat", this.loadLigandFormat);
this.setB ("logCommands", this.logCommands);
this.setB ("logGestures", this.logGestures);
this.setB ("measureAllModels", this.measureAllModels);
this.setB ("measurementLabels", this.measurementLabels);
this.setS ("measurementUnits", this.measureDistanceUnits);
this.setI ("meshScale", this.meshScale);
this.setB ("messageStyleChime", this.messageStyleChime);
this.setF ("minBondDistance", this.minBondDistance);
this.setI ("minPixelSelRadius", this.minPixelSelRadius);
this.setI ("minimizationSteps", this.minimizationSteps);
this.setB ("minimizationRefresh", this.minimizationRefresh);
this.setB ("minimizationSilent", this.minimizationSilent);
this.setF ("minimizationCriterion", this.minimizationCriterion);
this.setB ("modelKitMode", this.modelKitMode);
this.setB ("monitorEnergy", this.monitorEnergy);
this.setF ("multipleBondRadiusFactor", this.multipleBondRadiusFactor);
this.setF ("multipleBondSpacing", this.multipleBondSpacing);
this.setB ("multiProcessor", this.multiProcessor && (J.viewer.Viewer.nProcessors > 1));
this.setB ("navigationMode", this.navigationMode);
this.setB ("navigationPeriodic", this.navigationPeriodic);
this.setF ("navigationSpeed", this.navigationSpeed);
this.setS ("nmrUrlFormat", this.nmrUrlFormat);
this.setB ("partialDots", this.partialDots);
this.setB ("pdbAddHydrogens", this.pdbAddHydrogens);
this.setB ("pdbGetHeader", this.pdbGetHeader);
this.setB ("pdbSequential", this.pdbSequential);
this.setB ("perspectiveDepth", this.perspectiveDepth);
this.setI ("percentVdwAtom", this.percentVdwAtom);
this.setI ("phongExponent", this.phongExponent);
this.setI ("pickingSpinRate", this.pickingSpinRate);
this.setS ("pickLabel", this.pickLabel);
this.setF ("pointGroupLinearTolerance", this.pointGroupLinearTolerance);
this.setF ("pointGroupDistanceTolerance", this.pointGroupDistanceTolerance);
this.setB ("preserveState", this.preserveState);
this.setS ("propertyColorScheme", this.propertyColorScheme);
this.setS ("quaternionFrame", this.quaternionFrame);
this.setB ("rangeSelected", this.rangeSelected);
this.setI ("repaintWaitMs", this.repaintWaitMs);
this.setI ("ribbonAspectRatio", this.ribbonAspectRatio);
this.setB ("ribbonBorder", this.ribbonBorder);
this.setB ("rocketBarrels", this.rocketBarrels);
this.setB ("saveProteinStructureState", this.saveProteinStructureState);
this.setB ("scriptqueue", this.useScriptQueue);
this.setB ("selectAllModels", this.selectAllModels);
this.setB ("selectHetero", this.rasmolHeteroSetting);
this.setB ("selectHydrogen", this.rasmolHydrogenSetting);
this.setF ("sheetSmoothing", this.sheetSmoothing);
this.setB ("showHiddenSelectionHalos", this.showHiddenSelectionHalos);
this.setB ("showHydrogens", this.showHydrogens);
this.setB ("showKeyStrokes", this.showKeyStrokes);
this.setB ("showMeasurements", this.showMeasurements);
this.setB ("showMultipleBonds", this.showMultipleBonds);
this.setB ("showNavigationPointAlways", this.showNavigationPointAlways);
this.setI ("showScript", this.scriptDelay);
this.setB ("showtiming", this.showTiming);
this.setB ("slabByMolecule", this.slabByMolecule);
this.setB ("slabByAtom", this.slabByAtom);
this.setB ("smartAromatic", this.smartAromatic);
this.setI ("smallMoleculeMaxAtoms", this.smallMoleculeMaxAtoms);
this.setS ("smilesUrlFormat", this.smilesUrlFormat);
this.setS ("nihResolverFormat", this.nihResolverFormat);
this.setS ("pubChemFormat", this.pubChemFormat);
this.setB ("solventProbe", this.solventOn);
this.setF ("solventProbeRadius", this.solventProbeRadius);
this.setB ("specular", this.specular);
this.setI ("specularExponent", this.specularExponent);
this.setI ("specularPercent", this.specularPercent);
this.setI ("specularPower", this.specularPower);
this.setB ("ssbondsBackbone", this.ssbondsBackbone);
this.setB ("statusReporting", this.statusReporting);
this.setI ("strandCount", this.strandCountForStrands);
this.setI ("strandCountForStrands", this.strandCountForStrands);
this.setI ("strandCountForMeshRibbon", this.strandCountForMeshRibbon);
this.setF ("strutDefaultRadius", this.strutDefaultRadius);
this.setF ("strutLengthMaximum", this.strutLengthMaximum);
this.setI ("strutSpacing", this.strutSpacing);
this.setB ("strutsMultiple", this.strutsMultiple);
this.setB ("testFlag1", this.testFlag1);
this.setB ("testFlag2", this.testFlag2);
this.setB ("testFlag3", this.testFlag3);
this.setB ("testFlag4", this.testFlag4);
this.setB ("traceAlpha", this.traceAlpha);
this.setB ("twistedSheets", this.twistedSheets);
this.setB ("useArcBall", this.useArcBall);
this.setB ("useMinimizationThread", this.useMinimizationThread);
this.setB ("useNumberLocalization", this.useNumberLocalization);
this.setF ("vectorScale", this.vectorScale);
this.setB ("vectorSymmetry", this.vectorSymmetry);
this.setF ("vibrationPeriod", this.vibrationPeriod);
this.setF ("vibrationScale", this.vibrationScale);
this.setF ("visualRange", this.visualRange);
this.setB ("waitForMoveTo", this.waitForMoveTo);
this.setB ("wireframeRotation", this.wireframeRotation);
this.setI ("zDepth", this.zDepth);
this.setB ("zeroBasedXyzRasmol", this.zeroBasedXyzRasmol);
this.setB ("zoomLarge", this.zoomLarge);
this.setI ("zShadePower", this.zShadePower);
this.setI ("zSlab", this.zSlab);
}, "J.viewer.StateManager.GlobalSettings,~B");
Clazz.defineMethod (c$, "setDefaultLattice", 
function (a) {
this.ptDefaultLattice.setT (a);
}, "J.util.P3");
Clazz.defineMethod (c$, "getDefaultLattice", 
function () {
return this.ptDefaultLattice;
});
Clazz.defineMethod (c$, "setUnits", 
function (a) {
var b = this.measureDistanceUnits;
var c = this.energyUnits;
if (a.equalsIgnoreCase ("angstroms")) this.measureDistanceUnits = "angstroms";
 else if (a.equalsIgnoreCase ("nanometers") || a.equalsIgnoreCase ("nm")) this.measureDistanceUnits = "nanometers";
 else if (a.equalsIgnoreCase ("picometers") || a.equalsIgnoreCase ("pm")) this.measureDistanceUnits = "picometers";
 else if (a.equalsIgnoreCase ("bohr") || a.equalsIgnoreCase ("au")) this.measureDistanceUnits = "au";
 else if (a.equalsIgnoreCase ("vanderwaals") || a.equalsIgnoreCase ("vdw")) this.measureDistanceUnits = "vdw";
 else if (a.equalsIgnoreCase ("kj")) this.energyUnits = "kJ";
 else if (a.equalsIgnoreCase ("kcal")) this.energyUnits = "kcal";
if (!b.equalsIgnoreCase (this.measureDistanceUnits)) this.setS ("measurementUnits", this.measureDistanceUnits);
 else if (!c.equalsIgnoreCase (this.energyUnits)) this.setS ("energyUnits", this.energyUnits);
}, "~S");
Clazz.defineMethod (c$, "isJmolVariable", 
function (a) {
return a.charAt (0) == '_' || this.htNonbooleanParameterValues.containsKey (a = a.toLowerCase ()) || this.htBooleanParameterFlags.containsKey (a) || J.viewer.StateManager.unreportedProperties.indexOf (";" + a + ";") >= 0;
}, "~S");
Clazz.defineMethod (c$, "resetValue", 
($fz = function (a, b) {
this.setS (a, b == null ? "" : b.getParameter (a));
}, $fz.isPrivate = true, $fz), "~S,J.viewer.StateManager.GlobalSettings");
Clazz.defineMethod (c$, "setB", 
function (a, b) {
a = a.toLowerCase ();
if (this.htNonbooleanParameterValues.containsKey (a)) return;
this.htBooleanParameterFlags.put (a, b ? Boolean.TRUE : Boolean.FALSE);
}, "~S,~B");
Clazz.defineMethod (c$, "setI", 
function (a, b) {
a = a.toLowerCase ();
if (this.htBooleanParameterFlags.containsKey (a)) return;
this.htNonbooleanParameterValues.put (a, Integer.$valueOf (b));
}, "~S,~N");
Clazz.defineMethod (c$, "setF", 
function (a, b) {
if (Float.isNaN (b)) return;
a = a.toLowerCase ();
if (this.htBooleanParameterFlags.containsKey (a)) return;
this.htNonbooleanParameterValues.put (a,  new Float (b));
}, "~S,~N");
Clazz.defineMethod (c$, "setS", 
function (a, b) {
a = a.toLowerCase ();
if (b == null || this.htBooleanParameterFlags.containsKey (a)) return;
this.htNonbooleanParameterValues.put (a, b);
}, "~S,~S");
Clazz.defineMethod (c$, "removeParam", 
function (a) {
a = a.toLowerCase ();
if (this.htBooleanParameterFlags.containsKey (a)) {
this.htBooleanParameterFlags.remove (a);
if (!this.htPropertyFlagsRemoved.containsKey (a)) this.htPropertyFlagsRemoved.put (a, Boolean.FALSE);
return;
}if (this.htNonbooleanParameterValues.containsKey (a)) this.htNonbooleanParameterValues.remove (a);
}, "~S");
Clazz.defineMethod (c$, "setUserVariable", 
function (a, b) {
if (b == null) return null;
a = a.toLowerCase ();
this.htUserVariables.put (a, b.setName (a).setGlobal ());
return b;
}, "~S,J.script.SV");
Clazz.defineMethod (c$, "unsetUserVariable", 
function (a) {
if (a.equals ("all") || a.equals ("variables")) {
this.htUserVariables.clear ();
J.util.Logger.info ("all user-defined variables deleted");
} else if (this.htUserVariables.containsKey (a)) {
J.util.Logger.info ("variable " + a + " deleted");
this.htUserVariables.remove (a);
}}, "~S");
Clazz.defineMethod (c$, "removeUserVariable", 
function (a) {
this.htUserVariables.remove (a);
}, "~S");
Clazz.defineMethod (c$, "getUserVariable", 
function (a) {
if (a == null) return null;
a = a.toLowerCase ();
return this.htUserVariables.get (a);
}, "~S");
Clazz.defineMethod (c$, "getParameterEscaped", 
function (a, b) {
a = a.toLowerCase ();
if (this.htNonbooleanParameterValues.containsKey (a)) {
var c = this.htNonbooleanParameterValues.get (a);
return J.viewer.StateManager.varClip (a, J.util.Escape.e (c), b);
}if (this.htBooleanParameterFlags.containsKey (a)) return this.htBooleanParameterFlags.get (a).toString ();
if (this.htUserVariables.containsKey (a)) return this.htUserVariables.get (a).escape ();
if (this.htPropertyFlagsRemoved.containsKey (a)) return "false";
return "<not defined>";
}, "~S,~N");
Clazz.defineMethod (c$, "getParameter", 
function (a) {
var b = this.getParam (a, false);
return (b == null ? "" : b);
}, "~S");
Clazz.defineMethod (c$, "getOrSetNewVariable", 
function (a, b) {
if (a == null || a.length == 0) a = "x";
var c = this.getParam (a, true);
return (c == null && b && a.charAt (0) != '_' ? this.setUserVariable (a, J.script.SV.newVariable (4, "")) : J.script.SV.getVariable (c));
}, "~S,~B");
Clazz.defineMethod (c$, "getParam", 
function (a, b) {
a = a.toLowerCase ();
if (a.equals ("_memory")) {
var c = 0;
var d = 0;
try {
var e = Runtime.getRuntime ();
c = e.totalMemory () / 1000000;
d = e.freeMemory () / 1000000;
} catch (e) {
}
var e = J.util.TextFormat.formatDecimal (c - d, 1) + "/" + J.util.TextFormat.formatDecimal (c, 1);
this.htNonbooleanParameterValues.put ("_memory", e);
}if (this.htNonbooleanParameterValues.containsKey (a)) return this.htNonbooleanParameterValues.get (a);
if (this.htBooleanParameterFlags.containsKey (a)) return this.htBooleanParameterFlags.get (a);
if (this.htPropertyFlagsRemoved.containsKey (a)) return Boolean.FALSE;
if (this.htUserVariables.containsKey (a)) {
var c = this.htUserVariables.get (a);
return (b ? c : J.script.SV.oValue (c));
}return null;
}, "~S,~B");
Clazz.defineMethod (c$, "getVariableList", 
function () {
return J.viewer.StateManager.getVariableList (this.htUserVariables, 0, true, false);
});
Clazz.defineMethod (c$, "setStructureList", 
function (a, b) {
this.haveSetStructureList = true;
this.structureList.put (b, a);
}, "~A,J.constant.EnumStructure");
Clazz.defineMethod (c$, "getStructureList", 
function () {
return this.structureList;
});
Clazz.defineMethod (c$, "setPicked", 
function (a) {
var b = null;
if (a >= 0) {
this.setI ("_atompicked", a);
b = this.getParam ("picked", true);
}if (b == null || b.tok != 10) {
b = J.script.SV.newVariable (10,  new J.util.BS ());
this.setUserVariable ("picked", b);
}if (a >= 0) J.script.SV.getBitSet (b, false).set (a);
}, "~N");
Clazz.defineMethod (c$, "resolveDataBase", 
function (a, b) {
var c = this.databases.get (a.toLowerCase ());
if (c == null) return null;
if (b.indexOf ("/") < 0) {
if (a.equals ("pubchem")) b = "name/" + b;
 else if (a.equals ("nci")) b += "/file?format=sdf&get3d=True";
}return (c.indexOf ("%FILE") < 0 ? c + b : J.util.TextFormat.formatStringS (c, "FILE", b));
}, "~S,~S");
Clazz.defineMethod (c$, "getDataBaseList", 
($fz = function (a) {
if (a == null) return;
for (var b = 0; b < a.length; b += 2) this.databases.put (a[b].toLowerCase (), a[b + 1]);

}, $fz.isPrivate = true, $fz), "~A");
c$ = Clazz.p0p ();
};
Clazz.pu$h ();
c$ = Clazz.decorateAsClass (function () {
this.atomIndex1 = 0;
this.atomIndex2 = 0;
this.mad = 0;
this.colix = 0;
this.order = 0;
this.energy = 0;
this.shapeVisibilityFlags = 0;
Clazz.instantialize (this, arguments);
}, J.viewer.StateManager, "Connection");
Clazz.makeConstructor (c$, 
function (a, b, c, d, e, f, g) {
this.atomIndex1 = a;
this.atomIndex2 = b;
this.mad = c;
this.colix = d;
this.order = e;
this.energy = f;
this.shapeVisibilityFlags = g;
}, "~N,~N,~N,~N,~N,~N,~N");
c$ = Clazz.p0p ();
Clazz.defineStatics (c$,
"OBJ_BACKGROUND", 0,
"OBJ_AXIS1", 1,
"OBJ_AXIS2", 2,
"OBJ_AXIS3", 3,
"OBJ_BOUNDBOX", 4,
"OBJ_UNITCELL", 5,
"OBJ_FRANK", 6,
"OBJ_MAX", 8,
"objectNameList", "background axis1      axis2      axis3      boundbox   unitcell   frank      ");
c$.unreportedProperties = c$.prototype.unreportedProperties = (";ambientpercent;animationfps;antialiasdisplay;antialiasimages;antialiastranslucent;appendnew;axescolor;axesposition;axesmolecular;axesorientationrasmol;axesunitcell;axeswindow;axis1color;axis2color;axis3color;backgroundcolor;backgroundmodel;bondsymmetryatoms;boundboxcolor;cameradepth;debug;debugscript;defaultlatttice;defaults;defaultdropscript;diffusepercent;exportdrivers;_filecaching;_filecache;fontcaching;fontscaling;forcefield;language;legacyautobonding;loglevel;logfile;loggestures;logcommands;measurestylechime;loadformat;loadligandformat;smilesurlformat;pubchemformat;nihresolverformat;edsurlformat;edsurlcutoff;multiprocessor;navigationmode;;pathforallfiles;perspectivedepth;phongexponent;perspectivemodel;preservestate;refreshing;repaintwaitms;rotationradius;showaxes;showaxis1;showaxis2;showaxis3;showboundbox;showfrank;showtiming;showunitcell;slabenabled;slab;slabrange;depth;zshade;zshadepower;specular;specularexponent;specularpercent;celshading;specularpower;stateversion;statusreporting;stereo;stereostate;vibrationperiod;unitcellcolor;visualrange;windowcentered;zerobasedxyzrasmol;zoomenabled;mousedragfactor;mousewheelfactor;scriptqueue;scriptreportinglevel;syncscript;syncmouse;syncstereo;;defaultdirectory;currentlocalpath;defaultdirectorylocal;ambient;bonds;colorrasmol;diffuse;frank;hetero;hidenotselected;hoverlabel;hydrogen;languagetranslation;measurementunits;navigationdepth;navigationslab;picking;pickingstyle;propertycolorschemeoverload;radius;rgbblue;rgbgreen;rgbred;scaleangstromsperinch;selectionhalos;showscript;showselections;solvent;strandcount;spinx;spiny;spinz;spinfps;navx;navy;navz;navfps;" + J.constant.EnumCallback.getNameList () + ";undo;bondpicking;modelkitmode;allowgestures;allowkeystrokes;allowmultitouch;allowmodelkit" + ";").toLowerCase ();
});
