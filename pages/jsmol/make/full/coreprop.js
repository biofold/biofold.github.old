// 
//// J\api\JmolPropertyManager.js 
// 
Clazz.declarePackage ("J.api");
Clazz.declareInterface (J.api, "JmolPropertyManager");
// 
//// J\viewer\PropertyManager.js 
// 
Clazz.declarePackage ("J.viewer");
Clazz.load (["J.api.JmolPropertyManager", "java.util.Hashtable"], "J.viewer.PropertyManager", ["java.lang.Boolean", "$.Float", "java.util.ArrayList", "$.Arrays", "J.modelset.Atom", "$.LabelToken", "J.script.SV", "$.ScriptVariableInt", "$.T", "J.util.BS", "$.BSUtil", "$.Elements", "$.Escape", "$.JmolEdge", "$.JmolMolecule", "$.Logger", "$.P3", "$.Parser", "$.SB", "$.TextFormat", "$.V3", "J.viewer.Viewer"], function () {
c$ = Clazz.decorateAsClass (function () {
this.viewer = null;
this.map = null;
Clazz.instantialize (this, arguments);
}, J.viewer, "PropertyManager", null, J.api.JmolPropertyManager);
Clazz.prepareFields (c$, function () {
this.map =  new java.util.Hashtable ();
});
Clazz.makeConstructor (c$, 
function () {
});
Clazz.overrideMethod (c$, "setViewer", 
function (viewer) {
this.viewer = viewer;
for (var i = 0, p = 0; i < J.viewer.PropertyManager.propertyTypes.length; i += 3) this.map.put (J.viewer.PropertyManager.propertyTypes[i].toLowerCase (), Integer.$valueOf (p++));

}, "J.viewer.Viewer");
Clazz.overrideMethod (c$, "getPropertyNumber", 
function (infoType) {
var n = this.map.get (infoType == null ? "" : infoType.toLowerCase ());
return (n == null ? -1 : n.intValue ());
}, "~S");
Clazz.overrideMethod (c$, "getDefaultPropertyParam", 
function (propID) {
return (propID < 0 ? "" : J.viewer.PropertyManager.propertyTypes[propID * 3 + 2]);
}, "~N");
Clazz.overrideMethod (c$, "checkPropertyParameter", 
function (name) {
var propID = this.getPropertyNumber (name);
var type = J.viewer.PropertyManager.getParamType (propID);
return (type.length > 0 && type !== "<atom selection>");
}, "~S");
Clazz.overrideMethod (c$, "getProperty", 
function (returnType, infoType, paramInfo) {
if (J.viewer.PropertyManager.propertyTypes.length != 117) J.util.Logger.warn ("propertyTypes is not the right length: " + J.viewer.PropertyManager.propertyTypes.length + " != " + 117);
var info;
if (infoType.indexOf (".") >= 0 || infoType.indexOf ("[") >= 0) {
info = this.getModelProperty (infoType, paramInfo);
} else {
info = this.getPropertyAsObject (infoType, paramInfo, returnType);
}if (returnType == null) return info;
var requestedReadable = returnType.equalsIgnoreCase ("readable");
if (requestedReadable) returnType = (J.viewer.PropertyManager.isReadableAsString (infoType) ? "String" : "JSON");
if (returnType.equalsIgnoreCase ("String")) return (info == null ? "" : info.toString ());
if (requestedReadable) return J.util.Escape.toReadable (infoType, info);
 else if (returnType.equalsIgnoreCase ("JSON")) return "{" + J.util.Escape.toJSON (infoType, info) + "}";
return info;
}, "~S,~S,~O");
Clazz.defineMethod (c$, "getModelProperty", 
($fz = function (propertyName, propertyValue) {
propertyName = propertyName.$replace (']', ' ').$replace ('[', ' ').$replace ('.', ' ');
propertyName = J.util.TextFormat.simpleReplace (propertyName, "  ", " ");
var names = J.util.TextFormat.splitChars (J.util.TextFormat.trim (propertyName, " "), " ");
var args =  new Array (names.length);
propertyName = names[0];
var n;
for (var i = 1; i < names.length; i++) {
if ((n = J.util.Parser.parseInt (names[i])) != -2147483648) args[i] =  new J.script.ScriptVariableInt (n);
 else args[i] = J.script.SV.newVariable (4, names[i]);
}
return this.extractProperty (this.getProperty (null, propertyName, propertyValue), args, 1);
}, $fz.isPrivate = true, $fz), "~S,~O");
Clazz.overrideMethod (c$, "extractProperty", 
function (property, args, ptr) {
if (ptr >= args.length) return property;
var pt;
var arg = args[ptr++];
switch (arg.tok) {
case 2:
pt = arg.asInt () - 1;
if (Clazz.instanceOf (property, java.util.List)) {
var v = property;
if (pt < 0) pt += v.size ();
if (pt >= 0 && pt < v.size ()) return this.extractProperty (v.get (pt), args, ptr);
return "";
}if (Clazz.instanceOf (property, J.util.Matrix3f)) {
var m = property;
var f = [[m.m00, m.m01, m.m02], [m.m10, m.m11, m.m12], [m.m20, m.m21, m.m22]];
if (pt < 0) pt += 3;
if (pt >= 0 && pt < 3) return this.extractProperty (f, args, --ptr);
return "";
}if (J.util.Escape.isAI (property)) {
var ilist = property;
if (pt < 0) pt += ilist.length;
if (pt >= 0 && pt < ilist.length) return Integer.$valueOf (ilist[pt]);
return "";
}if (J.util.Escape.isAF (property)) {
var flist = property;
if (pt < 0) pt += flist.length;
if (pt >= 0 && pt < flist.length) return  new Float (flist[pt]);
return "";
}if (J.util.Escape.isAII (property)) {
var iilist = property;
if (pt < 0) pt += iilist.length;
if (pt >= 0 && pt < iilist.length) return this.extractProperty (iilist[pt], args, ptr);
return "";
}if (J.util.Escape.isAFF (property)) {
var fflist = property;
if (pt < 0) pt += fflist.length;
if (pt >= 0 && pt < fflist.length) return this.extractProperty (fflist[pt], args, ptr);
return "";
}if (J.util.Escape.isAS (property)) {
var slist = property;
if (pt < 0) pt += slist.length;
if (pt >= 0 && pt < slist.length) return slist[pt];
return "";
}if (Clazz.instanceOf (property, Array)) {
var olist = property;
if (pt < 0) pt += olist.length;
if (pt >= 0 && pt < olist.length) return olist[pt];
return "";
}break;
case 4:
var key = arg.asString ();
if (Clazz.instanceOf (property, java.util.Map)) {
var h = property;
if (key.equalsIgnoreCase ("keys")) {
var keys =  new java.util.ArrayList ();
var e = h.keySet ().iterator ();
while (e.hasNext ()) keys.add (e.next ());

return this.extractProperty (keys, args, ptr);
}if (!h.containsKey (key)) {
var e = h.keySet ().iterator ();
var newKey = "";
while (e.hasNext ()) if ((newKey = e.next ()).equalsIgnoreCase (key)) {
key = newKey;
break;
}
}if (h.containsKey (key)) return this.extractProperty (h.get (key), args, ptr);
return "";
}if (Clazz.instanceOf (property, java.util.List)) {
var v = property;
var v2 =  new java.util.ArrayList ();
ptr--;
for (pt = 0; pt < v.size (); pt++) {
var o = v.get (pt);
if (Clazz.instanceOf (o, java.util.Map)) v2.add (this.extractProperty (o, args, ptr));
}
return v2;
}break;
}
return property;
}, "~O,~A,~N");
c$.getPropertyName = Clazz.defineMethod (c$, "getPropertyName", 
($fz = function (propID) {
return (propID < 0 ? "" : J.viewer.PropertyManager.propertyTypes[propID * 3]);
}, $fz.isPrivate = true, $fz), "~N");
c$.getParamType = Clazz.defineMethod (c$, "getParamType", 
($fz = function (propID) {
return (propID < 0 ? "" : J.viewer.PropertyManager.propertyTypes[propID * 3 + 1]);
}, $fz.isPrivate = true, $fz), "~N");
c$.isReadableAsString = Clazz.defineMethod (c$, "isReadableAsString", 
($fz = function (infoType) {
for (var i = J.viewer.PropertyManager.readableTypes.length; --i >= 0; ) if (infoType.equalsIgnoreCase (J.viewer.PropertyManager.readableTypes[i])) return true;

return false;
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "getPropertyAsObject", 
($fz = function (infoType, paramInfo, returnType) {
if (infoType.equals ("tokenList")) {
return J.script.T.getTokensLike (paramInfo);
}var id = this.getPropertyNumber (infoType);
var iHaveParameter = (paramInfo != null && paramInfo.toString ().length > 0);
var myParam = (iHaveParameter ? paramInfo : this.getDefaultPropertyParam (id));
switch (id) {
case 0:
return this.viewer.getAppletInfo ();
case 5:
return this.viewer.getAnimationInfo ();
case 13:
return this.viewer.getAtomBitSetVector (myParam);
case 14:
return this.viewer.getAllAtomInfo (myParam);
case 24:
return this.viewer.getAuxiliaryInfo (myParam);
case 15:
return this.viewer.getAllBondInfo (myParam);
case 25:
return this.viewer.getBoundBoxInfo ();
case 10:
return this.viewer.getRotationCenter ();
case 16:
return this.viewer.getAllChainInfo (myParam);
case 37:
return this.viewer.getProperty ("DATA_API", "consoleText", null);
case 38:
return this.viewer.getJspecViewProperties (myParam);
case 26:
return this.viewer.getData (myParam.toString ());
case 33:
return this.viewer.getErrorMessageUn ();
case 28:
return this.viewer.evaluateExpression (myParam.toString ());
case 20:
return this.viewer.getModelExtract (myParam, true, false, "MOL");
case 32:
return J.viewer.PropertyManager.getFileInfo (this.viewer.getFileData (), myParam.toString ());
case 1:
return this.viewer.getFullPathName ();
case 2:
return this.viewer.getFileHeader ();
case 4:
case 3:
if (iHaveParameter) return this.viewer.getFileAsString (myParam.toString ());
return this.viewer.getCurrentFileAsString ();
case 27:
var params = myParam.toString ();
var height = -1;
var width = -1;
var pt;
if ((pt = params.indexOf ("height=")) >= 0) height = J.util.Parser.parseInt (params.substring (pt + 7));
if ((pt = params.indexOf ("width=")) >= 0) width = J.util.Parser.parseInt (params.substring (pt + 6));
if (width < 0 && height < 0) height = width = -1;
 else if (width < 0) width = height;
 else height = width;
return this.viewer.getImageAs (returnType == null ? "JPEG" : "JPG64", -1, width, height, null, null);
case 35:
return this.viewer.getShapeProperty (23, "getInfo");
case 36:
return this.viewer.getShapeProperty (23, "getData");
case 21:
return this.viewer.getStatusChanged (myParam.toString ());
case 22:
return this.viewer;
case 7:
return this.viewer.getLigandInfo (myParam);
case 9:
return this.viewer.getMeasurementInfo ();
case 29:
return this.viewer.getMenu (myParam.toString ());
case 23:
return this.viewer.getMessageQueue ();
case 30:
return this.viewer.getMinimizationInfo ();
case 6:
return this.viewer.getModelInfo (myParam);
case 18:
return this.viewer.getMoleculeInfo (myParam);
case 34:
return this.viewer.getMouseInfo ();
case 11:
return this.viewer.getOrientationInfo ();
case 31:
return this.viewer.getPointGroupInfo (myParam);
case 17:
return this.viewer.getAllPolymerInfo (myParam);
case 8:
return this.viewer.getShapeInfo ();
case 19:
return this.viewer.getStateInfo3 (myParam.toString (), 0, 0);
case 12:
return this.viewer.getMatrixRotate ();
}
var data =  new Array (39);
for (var i = 0; i < 39; i++) {
var paramType = J.viewer.PropertyManager.getParamType (i);
var paramDefault = this.getDefaultPropertyParam (i);
var name = J.viewer.PropertyManager.getPropertyName (i);
data[i] = (name.charAt (0) == 'X' ? "" : name + (paramType !== "" ? " " + J.viewer.PropertyManager.getParamType (i) + (paramDefault !== "" ? " #default: " + this.getDefaultPropertyParam (i) : "") : ""));
}
java.util.Arrays.sort (data);
var info =  new J.util.SB ();
info.append ("getProperty ERROR\n").append (infoType).append ("?\nOptions include:\n");
for (var i = 0; i < 39; i++) if (data[i].length > 0) info.append ("\n getProperty ").append (data[i]);

return info.toString ();
}, $fz.isPrivate = true, $fz), "~S,~O,~S");
c$.getFileInfo = Clazz.defineMethod (c$, "getFileInfo", 
function (objHeader, type) {
var ht =  new java.util.Hashtable ();
if (objHeader == null) return ht;
var haveType = (type != null && type.length > 0);
if (Clazz.instanceOf (objHeader, java.util.Map)) {
return (haveType ? (objHeader).get (type) : objHeader);
}var lines = J.util.TextFormat.split (objHeader, '\n');
var keyLast = "";
var sb =  new J.util.SB ();
if (haveType) type = type.toUpperCase ();
var key = "";
for (var i = 0; i < lines.length; i++) {
var line = lines[i];
if (line.length < 12) continue;
key = line.substring (0, 6).trim ();
var cont = line.substring (7, 10).trim ();
if (key.equals ("REMARK")) {
key += cont;
}if (!key.equals (keyLast)) {
if (haveType && keyLast.equals (type)) return sb.toString ();
if (!haveType) {
ht.put (keyLast, sb.toString ());
sb =  new J.util.SB ();
}keyLast = key;
}if (!haveType || key.equals (type)) sb.append (line.substring (10).trim ()).appendC ('\n');
}
if (!haveType) {
ht.put (keyLast, sb.toString ());
}if (haveType) return (key.equals (type) ? sb.toString () : "");
return ht;
}, "~O,~S");
Clazz.overrideMethod (c$, "getMoleculeInfo", 
function (modelSet, atomExpression) {
var bsAtoms = this.viewer.getAtomBitSet (atomExpression);
if (modelSet.moleculeCount == 0) {
modelSet.getMolecules ();
}var V =  new java.util.ArrayList ();
var bsTemp =  new J.util.BS ();
for (var i = 0; i < modelSet.moleculeCount; i++) {
bsTemp = J.util.BSUtil.copy (bsAtoms);
var m = modelSet.molecules[i];
bsTemp.and (m.atomList);
if (bsTemp.length () > 0) {
var info =  new java.util.Hashtable ();
info.put ("mf", m.getMolecularFormula (false));
info.put ("number", Integer.$valueOf (m.moleculeIndex + 1));
info.put ("modelNumber", modelSet.getModelNumberDotted (m.modelIndex));
info.put ("numberInModel", Integer.$valueOf (m.indexInModel + 1));
info.put ("nAtoms", Integer.$valueOf (m.atomCount));
info.put ("nElements", Integer.$valueOf (m.nElements));
V.add (info);
}}
return V;
}, "J.modelset.ModelSet,~O");
Clazz.overrideMethod (c$, "getModelInfo", 
function (atomExpression) {
var bsModels = this.viewer.getModelBitSet (this.viewer.getAtomBitSet (atomExpression), false);
var m = this.viewer.getModelSet ();
var info =  new java.util.Hashtable ();
info.put ("modelSetName", m.modelSetName);
info.put ("modelCount", Integer.$valueOf (m.modelCount));
info.put ("isTainted", Boolean.$valueOf (m.tainted != null));
info.put ("canSkipLoad", Boolean.$valueOf (m.canSkipLoad));
info.put ("modelSetHasVibrationVectors", Boolean.$valueOf (m.modelSetHasVibrationVectors ()));
if (m.modelSetProperties != null) {
info.put ("modelSetProperties", m.modelSetProperties);
}info.put ("modelCountSelected", Integer.$valueOf (J.util.BSUtil.cardinalityOf (bsModels)));
info.put ("modelsSelected", bsModels);
var vModels =  new java.util.ArrayList ();
m.getMolecules ();
for (var i = bsModels.nextSetBit (0); i >= 0; i = bsModels.nextSetBit (i + 1)) {
var model =  new java.util.Hashtable ();
model.put ("_ipt", Integer.$valueOf (i));
model.put ("num", Integer.$valueOf (m.getModelNumber (i)));
model.put ("file_model", m.getModelNumberDotted (i));
model.put ("name", m.getModelName (i));
var s = m.getModelTitle (i);
if (s != null) model.put ("title", s);
s = m.getModelFileName (i);
if (s != null) model.put ("file", s);
s = m.getModelAuxiliaryInfoValue (i, "modelID");
if (s != null) model.put ("id", s);
model.put ("vibrationVectors", Boolean.$valueOf (m.modelHasVibrationVectors (i)));
var mi = m.models[i];
model.put ("atomCount", Integer.$valueOf (mi.atomCount));
model.put ("bondCount", Integer.$valueOf (mi.getBondCount ()));
model.put ("groupCount", Integer.$valueOf (mi.getGroupCount ()));
model.put ("moleculeCount", Integer.$valueOf (mi.moleculeCount));
model.put ("polymerCount", Integer.$valueOf (mi.getBioPolymerCount ()));
model.put ("chainCount", Integer.$valueOf (m.getChainCountInModel (i, true)));
if (mi.properties != null) {
model.put ("modelProperties", mi.properties);
}var energy = m.getModelAuxiliaryInfoValue (i, "Energy");
if (energy != null) {
model.put ("energy", energy);
}model.put ("atomCount", Integer.$valueOf (mi.atomCount));
vModels.add (model);
}
info.put ("models", vModels);
return info;
}, "~O");
Clazz.overrideMethod (c$, "getLigandInfo", 
function (atomExpression) {
var bsAtoms = this.viewer.getAtomBitSet (atomExpression);
var bsSolvent = this.viewer.getAtomBitSet ("solvent");
var info =  new java.util.Hashtable ();
var ligands =  new java.util.ArrayList ();
info.put ("ligands", ligands);
var ms = this.viewer.modelSet;
var bsExclude = J.util.BSUtil.copyInvert (bsAtoms, ms.atomCount);
bsExclude.or (bsSolvent);
var atoms = ms.atoms;
for (var i = bsAtoms.nextSetBit (0); i >= 0; i = bsAtoms.nextSetBit (i + 1)) if (atoms[i].isProtein () || atoms[i].isNucleic ()) bsExclude.set (i);

var bsModelAtoms =  new Array (ms.modelCount);
for (var i = ms.modelCount; --i >= 0; ) {
bsModelAtoms[i] = this.viewer.getModelUndeletedAtomsBitSet (i);
bsModelAtoms[i].andNot (bsExclude);
}
var molList = J.util.JmolMolecule.getMolecules (atoms, bsModelAtoms, null, bsExclude);
for (var i = 0; i < molList.length; i++) {
var bs = molList[i].atomList;
var ligand =  new java.util.Hashtable ();
ligands.add (ligand);
ligand.put ("atoms", J.util.Escape.e (bs));
var names = "";
var sep = "";
var lastGroup = null;
var chainlast = '\u0000';
var reslist = "";
var model = "";
var resnolast = 2147483647;
var resnofirst = 2147483647;
for (var j = bs.nextSetBit (0); j >= 0; j = bs.nextSetBit (j + 1)) {
var atom = atoms[j];
if (lastGroup === atom.group) continue;
lastGroup = atom.group;
var resno = atom.getResno ();
var chain = atom.getChainID ();
if (resnolast != resno - 1) {
if (reslist.length != 0 && resnolast != resnofirst) reslist += "-" + resnolast;
chain = '\1';
resnofirst = resno;
}model = "/" + ms.getModelNumberDotted (atom.modelIndex);
if (chainlast != '\0' && chain != chainlast) reslist += ":" + chainlast + model;
if (chain == '\1') reslist += " " + resno;
resnolast = resno;
chainlast = atom.getChainID ();
names += sep + atom.getGroup3 (false);
sep = "-";
}
reslist += (resnofirst == resnolast ? "" : "-" + resnolast) + (chainlast == '\0' ? "" : ":" + chainlast) + model;
ligand.put ("groupNames", names);
ligand.put ("residueList", reslist.substring (1));
}
return info;
}, "~O");
Clazz.overrideMethod (c$, "getSymmetryInfo", 
function (bsAtoms, xyz, op, pt, pt2, id, type) {
var iModel = -1;
if (bsAtoms == null) {
iModel = this.viewer.getCurrentModelIndex ();
if (iModel < 0) return "";
bsAtoms = this.viewer.getModelUndeletedAtomsBitSet (iModel);
}var iAtom = bsAtoms.nextSetBit (0);
if (iAtom < 0) return "";
iModel = this.viewer.modelSet.atoms[iAtom].modelIndex;
var uc = this.viewer.modelSet.getUnitCell (iModel);
if (uc == null) return "";
return uc.getSymmetryInfo (this.viewer.modelSet, iModel, iAtom, uc, xyz, op, pt, pt2, id, type);
}, "J.util.BS,~S,~N,J.util.P3,J.util.P3,~S,~N");
Clazz.overrideMethod (c$, "getModelExtract", 
function (bs, doTransform, isModelKit, type) {
var asV3000 = type.equalsIgnoreCase ("V3000");
var asSDF = type.equalsIgnoreCase ("SDF");
var asXYZVIB = type.equalsIgnoreCase ("XYZVIB");
var asChemDoodle = type.equalsIgnoreCase ("CD");
var mol =  new J.util.SB ();
var ms = this.viewer.modelSet;
if (!asXYZVIB && !asChemDoodle) {
mol.append (isModelKit ? "Jmol Model Kit" : this.viewer.getFullPathName ().$replace ('\\', '/'));
var version = J.viewer.Viewer.getJmolVersion ();
mol.append ("\n__Jmol-").append (version.substring (0, 2));
var cMM;
var cDD;
var cYYYY;
var cHH;
var cmm;
{
var c = new Date();
cMM = c.getMonth();
cDD = c.getDate();
cYYYY = c.getFullYear();
cHH = c.getHours();
cmm = c.getMinutes();
}J.util.TextFormat.rFill (mol, "_00", "" + (1 + cMM));
J.util.TextFormat.rFill (mol, "00", "" + cDD);
mol.append (("" + cYYYY).substring (2, 4));
J.util.TextFormat.rFill (mol, "00", "" + cHH);
J.util.TextFormat.rFill (mol, "00", "" + cmm);
mol.append ("3D 1   1.00000     0.00000     0");
mol.append ("\nJmol version ").append (J.viewer.Viewer.getJmolVersion ()).append (" EXTRACT: ").append (J.util.Escape.e (bs)).append ("\n");
}var bsAtoms = J.util.BSUtil.copy (bs);
var atoms = ms.atoms;
for (var i = bs.nextSetBit (0); i >= 0; i = bs.nextSetBit (i + 1)) if (doTransform && atoms[i].isDeleted ()) bsAtoms.clear (i);

var bsBonds = J.viewer.PropertyManager.getCovalentBondsForAtoms (ms.bonds, ms.bondCount, bsAtoms);
if (!asXYZVIB && bsAtoms.cardinality () == 0) return "";
var isOK = true;
var q = (doTransform ? this.viewer.getRotationQuaternion () : null);
if (asSDF) {
var header = mol.toString ();
mol =  new J.util.SB ();
var bsModels = this.viewer.getModelBitSet (bsAtoms, true);
for (var i = bsModels.nextSetBit (0); i >= 0; i = bsModels.nextSetBit (i + 1)) {
mol.append (header);
var bsTemp = J.util.BSUtil.copy (bsAtoms);
bsTemp.and (ms.getModelAtomBitSetIncludingDeleted (i, false));
bsBonds = J.viewer.PropertyManager.getCovalentBondsForAtoms (ms.bonds, ms.bondCount, bsTemp);
if (!(isOK = this.addMolFile (mol, bsTemp, bsBonds, false, false, q))) break;
mol.append ("$$$$\n");
}
} else if (asXYZVIB) {
var tokens1 = J.modelset.LabelToken.compile (this.viewer, "%-2e %10.5x %10.5y %10.5z %10.5vx %10.5vy %10.5vz\n", '\0', null);
var tokens2 = J.modelset.LabelToken.compile (this.viewer, "%-2e %10.5x %10.5y %10.5z\n", '\0', null);
var bsModels = this.viewer.getModelBitSet (bsAtoms, true);
for (var i = bsModels.nextSetBit (0); i >= 0; i = bsModels.nextSetBit (i + 1)) {
var bsTemp = J.util.BSUtil.copy (bsAtoms);
bsTemp.and (ms.getModelAtomBitSetIncludingDeleted (i, false));
if (bsTemp.cardinality () == 0) continue;
mol.appendI (bsTemp.cardinality ()).appendC ('\n');
var props = ms.models[i].properties;
mol.append ("Model[" + (i + 1) + "]: ");
if (ms.frameTitles[i] != null && ms.frameTitles[i].length > 0) {
mol.append (ms.frameTitles[i].$replace ('\n', ' '));
} else if (props == null) {
mol.append ("Jmol " + J.viewer.Viewer.getJmolVersion ());
} else {
var sb =  new J.util.SB ();
var e = props.propertyNames ();
var path = null;
while (e.hasMoreElements ()) {
var propertyName = e.nextElement ();
if (propertyName.equals (".PATH")) path = props.getProperty (propertyName);
 else sb.append (";").append (propertyName).append ("=").append (props.getProperty (propertyName));
}
if (path != null) sb.append (";PATH=").append (path);
path = sb.substring (sb.length () > 0 ? 1 : 0);
mol.append (path.$replace ('\n', ' '));
}mol.appendC ('\n');
for (var j = bsTemp.nextSetBit (0); j >= 0; j = bsTemp.nextSetBit (j + 1)) mol.append (J.modelset.LabelToken.formatLabelAtomArray (this.viewer, atoms[j], (ms.getVibrationVector (j, false) == null ? tokens2 : tokens1), '\0', null));

}
} else {
isOK = this.addMolFile (mol, bsAtoms, bsBonds, asV3000, asChemDoodle, q);
}return (isOK ? mol.toString () : "ERROR: Too many atoms or bonds -- use V3000 format.");
}, "J.util.BS,~B,~B,~S");
Clazz.defineMethod (c$, "addMolFile", 
($fz = function (mol, bsAtoms, bsBonds, asV3000, asChemDoodle, q) {
var nAtoms = bsAtoms.cardinality ();
var nBonds = bsBonds.cardinality ();
if (!asV3000 && !asChemDoodle && (nAtoms > 999 || nBonds > 999)) return false;
var ms = this.viewer.modelSet;
var atomMap =  Clazz.newIntArray (ms.atomCount, 0);
var pTemp =  new J.util.P3 ();
if (asV3000) {
mol.append ("  0  0  0  0  0  0            999 V3000");
} else if (asChemDoodle) {
mol.append ("{\"mol\":{\"scaling\":[20,-20,20],\"a\":[");
} else {
J.util.TextFormat.rFill (mol, "   ", "" + nAtoms);
J.util.TextFormat.rFill (mol, "   ", "" + nBonds);
mol.append ("  0  0  0  0              1 V2000");
}if (!asChemDoodle) mol.append ("\n");
if (asV3000) {
mol.append ("M  V30 BEGIN CTAB\nM  V30 COUNTS ").appendI (nAtoms).append (" ").appendI (nBonds).append (" 0 0 0\n").append ("M  V30 BEGIN ATOM\n");
}var ptTemp =  new J.util.P3 ();
for (var i = bsAtoms.nextSetBit (0), n = 0; i >= 0; i = bsAtoms.nextSetBit (i + 1)) this.getAtomRecordMOL (ms, mol, atomMap[i] = ++n, ms.atoms[i], q, pTemp, ptTemp, asV3000, asChemDoodle);

if (asV3000) {
mol.append ("M  V30 END ATOM\nM  V30 BEGIN BOND\n");
} else if (asChemDoodle) {
mol.append ("],\"b\":[");
}for (var i = bsBonds.nextSetBit (0), n = 0; i >= 0; i = bsBonds.nextSetBit (i + 1)) this.getBondRecordMOL (mol, ++n, ms.bonds[i], atomMap, asV3000, asChemDoodle);

if (asV3000) {
mol.append ("M  V30 END BOND\nM  V30 END CTAB\n");
}if (asChemDoodle) mol.append ("]}}");
 else {
mol.append ("M  END\n");
}if (!asChemDoodle && !asV3000) {
var pc = ms.getPartialCharges ();
if (pc != null) {
mol.append ("> <JMOL_PARTIAL_CHARGES>\n").appendI (nAtoms).appendC ('\n');
for (var i = bsAtoms.nextSetBit (0), n = 0; i >= 0; i = bsAtoms.nextSetBit (i + 1)) mol.appendI (++n).append (" ").appendF (pc[i]).appendC ('\n');

}}return true;
}, $fz.isPrivate = true, $fz), "J.util.SB,J.util.BS,J.util.BS,~B,~B,J.util.Quaternion");
c$.getCovalentBondsForAtoms = Clazz.defineMethod (c$, "getCovalentBondsForAtoms", 
($fz = function (bonds, bondCount, bsAtoms) {
var bsBonds =  new J.util.BS ();
for (var i = 0; i < bondCount; i++) {
var bond = bonds[i];
if (bsAtoms.get (bond.atom1.index) && bsAtoms.get (bond.atom2.index) && bond.isCovalent ()) bsBonds.set (i);
}
return bsBonds;
}, $fz.isPrivate = true, $fz), "~A,~N,J.util.BS");
Clazz.defineMethod (c$, "getAtomRecordMOL", 
($fz = function (ms, mol, n, a, q, pTemp, ptTemp, asV3000, asChemDoodle) {
if (ms.models[a.modelIndex].isTrajectory) a.setFractionalCoordPt (ptTemp, ms.trajectorySteps.get (a.modelIndex)[a.index - ms.models[a.modelIndex].firstAtomIndex], true);
 else pTemp.setT (a);
if (q != null) q.transformP2 (pTemp, pTemp);
var elemNo = a.getElementNumber ();
var sym = (a.isDeleted () ? "Xx" : J.util.Elements.elementSymbolFromNumber (elemNo));
var iso = a.getIsotopeNumber ();
var charge = a.getFormalCharge ();
if (asV3000) {
mol.append ("M  V30 ").appendI (n).append (" ").append (sym).append (" ").appendF (pTemp.x).append (" ").appendF (pTemp.y).append (" ").appendF (pTemp.z).append (" 0");
if (charge != 0) mol.append (" CHG=").appendI (charge);
if (iso != 0) mol.append (" MASS=").appendI (iso);
mol.append ("\n");
} else if (asChemDoodle) {
if (n != 1) mol.append (",");
mol.append ("{");
if (a.getElementNumber () != 6) mol.append ("\"l\":\"").append (a.getElementSymbol ()).append ("\",");
if (charge != 0) mol.append ("\"c\":").appendI (charge).append (",");
if (iso != 0 && iso != J.util.Elements.getNaturalIsotope (elemNo)) mol.append ("\"m\":").appendI (iso).append (",");
mol.append ("\"x\":").appendF (a.x * 20).append (",\"y\":").appendF (-a.y * 20).append (",\"z\":").appendF (a.z * 20).append ("}");
} else {
mol.append (J.util.TextFormat.sprintf ("%10.5p%10.5p%10.5p", "p", [pTemp]));
mol.append (" ").append (sym);
if (sym.length == 1) mol.append (" ");
if (iso > 0) iso -= J.util.Elements.getNaturalIsotope (a.getElementNumber ());
mol.append (" ");
J.util.TextFormat.rFill (mol, "  ", "" + iso);
J.util.TextFormat.rFill (mol, "   ", "" + (charge == 0 ? 0 : 4 - charge));
mol.append ("  0  0  0  0\n");
}}, $fz.isPrivate = true, $fz), "J.modelset.ModelSet,J.util.SB,~N,J.modelset.Atom,J.util.Quaternion,J.util.P3,J.util.P3,~B,~B");
Clazz.defineMethod (c$, "getBondRecordMOL", 
($fz = function (mol, n, b, atomMap, asV3000, asChemDoodle) {
var a1 = atomMap[b.atom1.index];
var a2 = atomMap[b.atom2.index];
var order = b.getValence ();
if (order > 3) order = 1;
switch (b.order & -131073) {
case 515:
order = (asChemDoodle ? 2 : 4);
break;
case 66:
order = (asChemDoodle ? 1 : 5);
break;
case 513:
order = (asChemDoodle ? 1 : 6);
break;
case 514:
order = (asChemDoodle ? 2 : 7);
break;
case 33:
order = (asChemDoodle ? 1 : 8);
break;
}
if (asV3000) {
mol.append ("M  V30 ").appendI (n).append (" ").appendI (order).append (" ").appendI (a1).append (" ").appendI (a2).appendC ('\n');
} else if (asChemDoodle) {
if (n != 1) mol.append (",");
mol.append ("{\"b\":").appendI (a1 - 1).append (",\"e\":").appendI (a2 - 1);
if (order != 1) mol.append (",\"o\":").appendI (order);
mol.append ("}");
} else {
J.util.TextFormat.rFill (mol, "   ", "" + a1);
J.util.TextFormat.rFill (mol, "   ", "" + a2);
mol.append ("  ").appendI (order).append ("  0  0  0\n");
}}, $fz.isPrivate = true, $fz), "J.util.SB,~N,J.modelset.Bond,~A,~B,~B");
Clazz.overrideMethod (c$, "getChimeInfo", 
function (tok, bs) {
switch (tok) {
case 1073741982:
break;
case 1073741864:
return this.getBasePairInfo (bs);
default:
return this.getChimeInfoA (this.viewer.modelSet.atoms, tok, bs);
}
var sb =  new J.util.SB ();
this.viewer.modelSet.models[0].getChimeInfo (sb, 0);
return sb.appendC ('\n').toString ().substring (1);
}, "~N,J.util.BS");
Clazz.defineMethod (c$, "getChimeInfoA", 
($fz = function (atoms, tok, bs) {
var info =  new J.util.SB ();
info.append ("\n");
var id;
var s = "";
var clast = null;
var glast = null;
var modelLast = -1;
var n = 0;
if (bs != null) for (var i = bs.nextSetBit (0); i >= 0; i = bs.nextSetBit (i + 1)) {
id = atoms[i].getChainID ();
s = (id == '\0' ? " " : "" + id);
switch (tok) {
case 1087373316:
break;
case 1114638350:
s = atoms[i].getInfo ();
break;
case 1141899265:
s = "" + atoms[i].getAtomNumber ();
break;
case 1087373318:
s = atoms[i].getGroup3 (false);
break;
case 1073742120:
s = "[" + atoms[i].getGroup3 (false) + "]" + atoms[i].getSeqcodeString () + ":" + s;
break;
case 1087373320:
if (atoms[i].getModelIndex () != modelLast) {
info.appendC ('\n');
n = 0;
modelLast = atoms[i].getModelIndex ();
info.append ("Model " + atoms[i].getModelNumber ());
glast = null;
clast = null;
}if (atoms[i].getChain () !== clast) {
info.appendC ('\n');
n = 0;
clast = atoms[i].getChain ();
info.append ("Chain " + s + ":\n");
glast = null;
}var g = atoms[i].getGroup ();
if (g !== glast) {
if ((n++) % 5 == 0 && n > 1) info.appendC ('\n');
J.util.TextFormat.lFill (info, "          ", "[" + atoms[i].getGroup3 (false) + "]" + atoms[i].getResno () + " ");
glast = g;
}continue;
default:
return "";
}
if (info.indexOf ("\n" + s + "\n") < 0) info.append (s).appendC ('\n');
}
if (tok == 1087373320) info.appendC ('\n');
return info.toString ().substring (1);
}, $fz.isPrivate = true, $fz), "~A,~N,J.util.BS");
Clazz.overrideMethod (c$, "getModelFileInfo", 
function (frames) {
var ms = this.viewer.modelSet;
var sb =  new J.util.SB ();
for (var i = 0; i < ms.modelCount; ++i) {
if (frames != null && !frames.get (i)) continue;
var s = "[\"" + ms.getModelNumberDotted (i) + "\"] = ";
sb.append ("\n\nfile").append (s).append (J.util.Escape.eS (ms.getModelFileName (i)));
var id = ms.getModelAuxiliaryInfoValue (i, "modelID");
if (id != null) sb.append ("\nid").append (s).append (J.util.Escape.eS (id));
sb.append ("\ntitle").append (s).append (J.util.Escape.eS (ms.getModelTitle (i)));
sb.append ("\nname").append (s).append (J.util.Escape.eS (ms.getModelName (i)));
}
return sb.toString ();
}, "J.util.BS");
Clazz.overrideMethod (c$, "getAllAtomInfo", 
function (bs) {
var V =  new java.util.ArrayList ();
for (var i = bs.nextSetBit (0); i >= 0; i = bs.nextSetBit (i + 1)) {
V.add (this.getAtomInfoLong (i));
}
return V;
}, "J.util.BS");
Clazz.overrideMethod (c$, "getAtomIdentityInfo", 
function (i, info) {
var ms = this.viewer.modelSet;
info.put ("_ipt", Integer.$valueOf (i));
info.put ("atomIndex", Integer.$valueOf (i));
info.put ("atomno", Integer.$valueOf (ms.getAtomNumber (i)));
info.put ("info", ms.getAtomInfo (i, null));
info.put ("sym", ms.getElementSymbol (i));
}, "~N,java.util.Map");
Clazz.defineMethod (c$, "getAtomInfoLong", 
($fz = function (i) {
var ms = this.viewer.modelSet;
var atom = ms.atoms[i];
var info =  new java.util.Hashtable ();
this.getAtomIdentityInfo (i, info);
info.put ("element", ms.getElementName (i));
info.put ("elemno", Integer.$valueOf (ms.getElementNumber (i)));
info.put ("x", Float.$valueOf (atom.x));
info.put ("y", Float.$valueOf (atom.y));
info.put ("z", Float.$valueOf (atom.z));
info.put ("coord", J.util.P3.newP (atom));
if (ms.vibrationVectors != null && ms.vibrationVectors[i] != null) {
info.put ("vibVector", J.util.V3.newV (ms.vibrationVectors[i]));
}info.put ("bondCount", Integer.$valueOf (atom.getCovalentBondCount ()));
info.put ("radius", Float.$valueOf ((atom.getRasMolRadius () / 120.0)));
info.put ("model", atom.getModelNumberForLabel ());
info.put ("shape", J.modelset.Atom.atomPropertyString (this.viewer, atom, 1087373323));
info.put ("visible", Boolean.$valueOf (atom.isVisible (0)));
info.put ("clickabilityFlags", Integer.$valueOf (atom.clickabilityFlags));
info.put ("visibilityFlags", Integer.$valueOf (atom.shapeVisibilityFlags));
info.put ("spacefill", Float.$valueOf (atom.getRadius ()));
var strColor = J.util.Escape.escapeColor (this.viewer.getColorArgbOrGray (atom.colixAtom));
if (strColor != null) info.put ("color", strColor);
info.put ("colix", Integer.$valueOf (atom.colixAtom));
var isTranslucent = atom.isTranslucent ();
if (isTranslucent) info.put ("translucent", Boolean.$valueOf (isTranslucent));
info.put ("formalCharge", Integer.$valueOf (atom.getFormalCharge ()));
info.put ("partialCharge", Float.$valueOf (atom.getPartialCharge ()));
var d = atom.getSurfaceDistance100 () / 100;
if (d >= 0) info.put ("surfaceDistance", Float.$valueOf (d));
if (ms.models[atom.modelIndex].isBioModel) {
info.put ("resname", atom.getGroup3 (false));
var seqNum = atom.getSeqNumber ();
var insCode = atom.getInsertionCode ();
if (seqNum > 0) info.put ("resno", Integer.$valueOf (seqNum));
if (insCode.charCodeAt (0) != 0) info.put ("insertionCode", "" + insCode);
var chainID = atom.getChainID ();
info.put ("name", ms.getAtomName (i));
info.put ("chain", (chainID == '\0' ? "" : "" + chainID));
info.put ("atomID", Integer.$valueOf (atom.atomID));
info.put ("groupID", Integer.$valueOf (atom.getGroupID ()));
if (atom.alternateLocationID != '\0') info.put ("altLocation", "" + atom.alternateLocationID);
info.put ("structure", Integer.$valueOf (atom.getProteinStructureType ().getId ()));
info.put ("polymerLength", Integer.$valueOf (atom.getPolymerLength ()));
info.put ("occupancy", Integer.$valueOf (atom.getOccupancy100 ()));
var temp = atom.getBfactor100 ();
info.put ("temp", Integer.$valueOf (Clazz.doubleToInt (temp / 100)));
}return info;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.overrideMethod (c$, "getAllBondInfo", 
function (bs) {
var v =  new java.util.ArrayList ();
var ms = this.viewer.modelSet;
var bondCount = ms.bondCount;
if (Clazz.instanceOf (bs, J.modelset.Bond.BondSet)) {
for (var i = bs.nextSetBit (0); i >= 0 && i < bondCount; i = bs.nextSetBit (i + 1)) v.add (this.getBondInfo (i));

return v;
}var thisAtom = (bs.cardinality () == 1 ? bs.nextSetBit (0) : -1);
var bonds = ms.bonds;
for (var i = 0; i < bondCount; i++) {
if (thisAtom >= 0 ? (bonds[i].atom1.index == thisAtom || bonds[i].atom2.index == thisAtom) : bs.get (bonds[i].atom1.index) && bs.get (bonds[i].atom2.index)) {
v.add (this.getBondInfo (i));
}}
return v;
}, "J.util.BS");
Clazz.defineMethod (c$, "getBondInfo", 
($fz = function (i) {
var bond = this.viewer.modelSet.bonds[i];
var atom1 = bond.atom1;
var atom2 = bond.atom2;
var info =  new java.util.Hashtable ();
info.put ("_bpt", Integer.$valueOf (i));
var infoA =  new java.util.Hashtable ();
this.getAtomIdentityInfo (atom1.index, infoA);
var infoB =  new java.util.Hashtable ();
this.getAtomIdentityInfo (atom2.index, infoB);
info.put ("atom1", infoA);
info.put ("atom2", infoB);
info.put ("order", Float.$valueOf (J.util.JmolEdge.getBondOrderNumberFromOrder (bond.order)));
info.put ("radius", Float.$valueOf ((bond.mad / 2000.)));
info.put ("length_Ang", Float.$valueOf (atom1.distance (atom2)));
info.put ("visible", Boolean.$valueOf (bond.shapeVisibilityFlags != 0));
var strColor = J.util.Escape.escapeColor (this.viewer.getColorArgbOrGray (bond.colix));
if (strColor != null) info.put ("color", strColor);
info.put ("colix", Integer.$valueOf (bond.colix));
var isTranslucent = bond.isTranslucent ();
if (isTranslucent) info.put ("translucent", Boolean.$valueOf (isTranslucent));
return info;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.overrideMethod (c$, "getAllChainInfo", 
function (bs) {
var finalInfo =  new java.util.Hashtable ();
var modelVector =  new java.util.ArrayList ();
var modelCount = this.viewer.modelSet.modelCount;
for (var i = 0; i < modelCount; ++i) {
var modelInfo =  new java.util.Hashtable ();
var info = this.getChainInfo (i, bs);
if (info.size () > 0) {
modelInfo.put ("modelIndex", Integer.$valueOf (i));
modelInfo.put ("chains", info);
modelVector.add (modelInfo);
}}
finalInfo.put ("models", modelVector);
return finalInfo;
}, "J.util.BS");
Clazz.defineMethod (c$, "getChainInfo", 
($fz = function (modelIndex, bs) {
var model = this.viewer.modelSet.models[modelIndex];
var nChains = model.getChainCount (true);
var infoChains =  new java.util.ArrayList ();
for (var i = 0; i < nChains; i++) {
var chain = model.getChainAt (i);
var infoChain =  new java.util.ArrayList ();
var nGroups = chain.getGroupCount ();
var arrayName =  new java.util.Hashtable ();
for (var igroup = 0; igroup < nGroups; igroup++) {
var group = chain.getGroup (igroup);
if (bs.get (group.firstAtomIndex)) infoChain.add (group.getGroupInfo (igroup));
}
if (!infoChain.isEmpty ()) {
arrayName.put ("residues", infoChain);
infoChains.add (arrayName);
}}
return infoChains;
}, $fz.isPrivate = true, $fz), "~N,J.util.BS");
Clazz.defineMethod (c$, "getAllPolymerInfo", 
function (bs) {
var finalInfo =  new java.util.Hashtable ();
var modelVector =  new java.util.ArrayList ();
var modelCount = this.viewer.modelSet.modelCount;
var models = this.viewer.modelSet.models;
for (var i = 0; i < modelCount; ++i) if (models[i].isBioModel) models[i].getAllPolymerInfo (bs, finalInfo, modelVector);

finalInfo.put ("models", modelVector);
return finalInfo;
}, "J.util.BS");
Clazz.defineMethod (c$, "getBasePairInfo", 
($fz = function (bs) {
var info =  new J.util.SB ();
var vHBonds =  new java.util.ArrayList ();
this.viewer.modelSet.calcRasmolHydrogenBonds (bs, bs, vHBonds, true, 1, false, null);
for (var i = vHBonds.size (); --i >= 0; ) {
var b = vHBonds.get (i);
J.viewer.PropertyManager.getAtomResidueInfo (info, b.atom1);
info.append (" - ");
J.viewer.PropertyManager.getAtomResidueInfo (info, b.atom2);
info.append ("\n");
}
return info.toString ();
}, $fz.isPrivate = true, $fz), "J.util.BS");
c$.getAtomResidueInfo = Clazz.defineMethod (c$, "getAtomResidueInfo", 
($fz = function (info, atom) {
info.append ("[").append (atom.getGroup3 (false)).append ("]").append (atom.getSeqcodeString ()).append (":");
var id = atom.getChainID ();
info.append (id == '\0' ? " " : "" + id);
}, $fz.isPrivate = true, $fz), "J.util.SB,J.modelset.Atom");
Clazz.defineStatics (c$,
"atomExpression", "<atom selection>");
c$.propertyTypes = c$.prototype.propertyTypes = ["appletInfo", "", "", "fileName", "", "", "fileHeader", "", "", "fileContents", "<pathname>", "", "fileContents", "", "", "animationInfo", "", "", "modelInfo", "<atom selection>", "{*}", "ligandInfo", "<atom selection>", "{*}", "shapeInfo", "", "", "measurementInfo", "", "", "centerInfo", "", "", "orientationInfo", "", "", "transformInfo", "", "", "atomList", "<atom selection>", "(visible)", "atomInfo", "<atom selection>", "(visible)", "bondInfo", "<atom selection>", "(visible)", "chainInfo", "<atom selection>", "(visible)", "polymerInfo", "<atom selection>", "(visible)", "moleculeInfo", "<atom selection>", "(visible)", "stateInfo", "<state type>", "all", "extractModel", "<atom selection>", "(visible)", "jmolStatus", "statusNameList", "", "jmolViewer", "", "", "messageQueue", "", "", "auxiliaryInfo", "<atom selection>", "{*}", "boundBoxInfo", "", "", "dataInfo", "<data type>", "types", "image", "", "", "evaluate", "<expression>", "", "menu", "<type>", "current", "minimizationInfo", "", "", "pointGroupInfo", "<atom selection>", "(visible)", "fileInfo", "<type>", "", "errorMessage", "", "", "mouseInfo", "", "", "isosurfaceInfo", "", "", "isosurfaceData", "", "", "consoleText", "", "", "jspecView", "<key>", ""];
Clazz.defineStatics (c$,
"PROP_APPLET_INFO", 0,
"PROP_FILENAME", 1,
"PROP_FILEHEADER", 2,
"PROP_FILECONTENTS_PATH", 3,
"PROP_FILECONTENTS", 4,
"PROP_ANIMATION_INFO", 5,
"PROP_MODEL_INFO", 6,
"PROP_LIGAND_INFO", 7,
"PROP_SHAPE_INFO", 8,
"PROP_MEASUREMENT_INFO", 9,
"PROP_CENTER_INFO", 10,
"PROP_ORIENTATION_INFO", 11,
"PROP_TRANSFORM_INFO", 12,
"PROP_ATOM_LIST", 13,
"PROP_ATOM_INFO", 14,
"PROP_BOND_INFO", 15,
"PROP_CHAIN_INFO", 16,
"PROP_POLYMER_INFO", 17,
"PROP_MOLECULE_INFO", 18,
"PROP_STATE_INFO", 19,
"PROP_EXTRACT_MODEL", 20,
"PROP_JMOL_STATUS", 21,
"PROP_JMOL_VIEWER", 22,
"PROP_MESSAGE_QUEUE", 23,
"PROP_AUXILIARY_INFO", 24,
"PROP_BOUNDBOX_INFO", 25,
"PROP_DATA_INFO", 26,
"PROP_IMAGE", 27,
"PROP_EVALUATE", 28,
"PROP_MENU", 29,
"PROP_MINIMIZATION_INFO", 30,
"PROP_POINTGROUP_INFO", 31,
"PROP_FILE_INFO", 32,
"PROP_ERROR_MESSAGE", 33,
"PROP_MOUSE_INFO", 34,
"PROP_ISOSURFACE_INFO", 35,
"PROP_ISOSURFACE_DATA", 36,
"PROP_CONSOLE_TEXT", 37,
"PROP_JSPECVIEW", 38,
"PROP_COUNT", 39,
"readableTypes", ["", "stateinfo", "extractmodel", "filecontents", "fileheader", "image", "menu", "minimizationInfo"]);
});
