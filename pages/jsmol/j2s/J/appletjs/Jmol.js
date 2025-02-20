Clazz.declarePackage ("J.appletjs");
Clazz.load (["J.api.JmolStatusListener", "$.JmolSyncInterface", "java.util.Hashtable"], "J.appletjs.Jmol", ["java.lang.Boolean", "java.net.URL", "java.util.ArrayList", "J.appletjs.JmolAppletRegistry", "J.constant.EnumCallback", "J.i18n.GT", "J.util.Escape", "$.Logger", "$.Parser", "$.SB", "$.TextFormat", "J.viewer.JC", "$.Viewer"], function () {
c$ = Clazz.decorateAsClass (function () {
this.language = null;
this.doTranslate = true;
this.haveDocumentAccess = false;
this.isStereoSlave = false;
this.loading = false;
this.mayScript = true;
this.htmlName = null;
this.fullName = null;
this.syncId = null;
this.outputBuffer = null;
this.gRight = null;
this.viewer = null;
this.b$ = null;
this.viewerOptions = null;
this.htParams = null;
this.jmol = null;
if (!Clazz.isClassDefined ("J.appletjs.Jmol.MyStatusListener")) {
J.appletjs.Jmol.$Jmol$MyStatusListener$ ();
}
Clazz.instantialize (this, arguments);
}, J.appletjs, "Jmol", null, J.api.JmolSyncInterface);
Clazz.prepareFields (c$, function () {
this.b$ =  new java.util.Hashtable ();
this.htParams =  new java.util.Hashtable ();
});
Clazz.makeConstructor (c$, 
function (viewerOptions) {
if (viewerOptions == null) viewerOptions =  new java.util.Hashtable ();
this.viewerOptions = viewerOptions;
for (var entry, $entry = viewerOptions.entrySet ().iterator (); $entry.hasNext () && ((entry = $entry.next ()) || true);) this.htParams.put (entry.getKey ().toLowerCase (), entry.getValue ());

this.init ();
}, "java.util.Map");
Clazz.defineMethod (c$, "jmolReady", 
function () {
System.out.println ("Jmol applet " + this.fullName + " ready");
this.viewer.getBooleanProperty ("__appletReady");
});
Clazz.defineMethod (c$, "destroy", 
function () {
this.gRight = null;
J.appletjs.JmolAppletRegistry.checkOut (this.fullName);
this.viewer.setModeMouse (-1);
this.viewer.getBooleanProperty ("__appletDestroyed");
this.viewer = null;
System.out.println ("Jmol applet " + this.fullName + " destroyed");
});
Clazz.defineMethod (c$, "setStereoGraphics", 
function (isStereo) {
{
}return null;
}, "~B");
Clazz.defineMethod (c$, "init", 
function () {
this.jmol = this;
this.htmlName = this.getParameter ("name");
this.syncId = this.getParameter ("syncId");
this.fullName = this.htmlName + "__" + this.syncId + "__";
System.out.println ("Jmol JavaScript applet " + this.fullName + " initializing");
this.setLogging ();
this.viewerOptions.remove ("debug");
this.viewerOptions.put ("fullName", this.fullName);
this.mayScript = true;
J.appletjs.JmolAppletRegistry.checkIn (this.fullName, this);
this.initWindows ();
this.initApplication ();
});
Clazz.defineMethod (c$, "initWindows", 
($fz = function () {
this.viewerOptions.put ("applet", Boolean.TRUE);
if (this.getParameter ("statusListener") == null) this.viewerOptions.put ("statusListener", Clazz.innerTypeInstance (J.appletjs.Jmol.MyStatusListener, this, null));
this.viewer =  new J.viewer.Viewer (this.viewerOptions);
this.mayScript = true;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "initApplication", 
($fz = function () {
this.viewer.pushHoldRepaint ();
var emulate = this.getValueLowerCase ("emulate", "jmol");
this.setStringProperty ("defaults", emulate.equals ("chime") ? "RasMol" : "Jmol");
this.setStringProperty ("backgroundColor", this.getValue ("bgcolor", this.getValue ("boxbgcolor", "black")));
this.loading = true;
for (var item, $item = 0, $$item = J.constant.EnumCallback.values (); $item < $$item.length && ((item = $$item[$item]) || true); $item++) {
this.setValue (item.name () + "Callback", null);
}
this.loading = false;
this.language = J.i18n.GT.getLanguage ();
System.out.println ("language=" + this.language);
var scriptParam = this.getValue ("script", "");
this.viewer.popHoldRepaint ();
if (scriptParam.length > 0) this.scriptProcessor (scriptParam, null, 1);
this.jmolReady ();
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setLogging", 
($fz = function () {
var iLevel = (this.getValue ("logLevel", (this.getBooleanValue ("debug", false) ? "5" : "4"))).charCodeAt (0) - 48;
if (iLevel != 4) System.out.println ("setting logLevel=" + iLevel + " -- To change, use script \"set logLevel [0-5]\"");
J.util.Logger.setLogLevel (iLevel);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getParameter", 
($fz = function (paramName) {
var o = this.htParams.get (paramName.toLowerCase ());
return (o == null ? null :  String.instantialize (o.toString ()));
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "getBooleanValue", 
($fz = function (propertyName, defaultValue) {
var value = this.getValue (propertyName, defaultValue ? "true" : "");
return (value.equalsIgnoreCase ("true") || value.equalsIgnoreCase ("on") || value.equalsIgnoreCase ("yes"));
}, $fz.isPrivate = true, $fz), "~S,~B");
Clazz.defineMethod (c$, "getValue", 
($fz = function (propertyName, defaultValue) {
var stringValue = this.getParameter (propertyName);
System.out.println ("getValue " + propertyName + " = " + stringValue);
if (stringValue != null) return stringValue;
return defaultValue;
}, $fz.isPrivate = true, $fz), "~S,~S");
Clazz.defineMethod (c$, "getValueLowerCase", 
($fz = function (paramName, defaultValue) {
var value = this.getValue (paramName, defaultValue);
if (value != null) {
value = value.trim ().toLowerCase ();
if (value.length == 0) value = null;
}return value;
}, $fz.isPrivate = true, $fz), "~S,~S");
Clazz.defineMethod (c$, "setValue", 
($fz = function (name, defaultValue) {
this.setStringProperty (name, this.getValue (name, defaultValue));
}, $fz.isPrivate = true, $fz), "~S,~S");
Clazz.defineMethod (c$, "setStringProperty", 
($fz = function (name, value) {
if (value == null) return;
J.util.Logger.info (name + " = \"" + value + "\"");
this.viewer.setStringProperty (name, value);
}, $fz.isPrivate = true, $fz), "~S,~S");
Clazz.defineMethod (c$, "sendJsTextStatus", 
function (message) {
System.out.println (message);
}, "~S");
Clazz.defineMethod (c$, "sendJsTextareaStatus", 
function (message) {
System.out.println (message);
}, "~S");
Clazz.defineMethod (c$, "handleEvent", 
function (e) {
if (this.viewer == null) return false;
return this.viewer.handleOldJvm10Event (e.id, e.x, e.y, e.modifiers, e.when);
}, "java.awt.Event");
Clazz.defineMethod (c$, "scriptProcessor", 
($fz = function (script, statusParams, processType) {
if (script == null || script.length == 0) return "";
switch (processType) {
case 0:
var err = this.viewer.scriptCheck (script);
return (Clazz.instanceOf (err, String) ? err : "");
case 1:
if (statusParams != null) return this.viewer.scriptWaitStatus (script, statusParams).toString ();
return this.viewer.scriptWait (script);
case 2:
default:
return this.viewer.script (script);
}
}, $fz.isPrivate = true, $fz), "~S,~S,~N");
Clazz.defineMethod (c$, "script", 
function (script) {
this.scriptNoWait (script);
}, "~S");
Clazz.defineMethod (c$, "scriptNoWait", 
function (script) {
if (script == null || script.length == 0) return "";
return this.scriptProcessor (script, null, 2);
}, "~S");
Clazz.defineMethod (c$, "scriptCheck", 
function (script) {
if (script == null || script.length == 0) return "";
return this.scriptProcessor (script, null, 0);
}, "~S");
Clazz.defineMethod (c$, "scriptWait", 
function (script) {
return this.scriptWait (script, null);
}, "~S");
Clazz.defineMethod (c$, "scriptWait", 
function (script, statusParams) {
if (script == null || script.length == 0) return "";
this.outputBuffer = null;
return this.scriptProcessor (script, statusParams, 1);
}, "~S,~S");
Clazz.defineMethod (c$, "scriptWaitOutput", 
function (script) {
if (script == null || script.length == 0) return "";
this.outputBuffer =  new J.util.SB ();
this.viewer.scriptWaitStatus (script, "");
var str = (this.outputBuffer == null ? "" : this.outputBuffer.toString ());
this.outputBuffer = null;
return str;
}, "~S");
Clazz.defineMethod (c$, "syncScript", 
function (script) {
this.viewer.syncScript (script, "~", 0);
}, "~S");
Clazz.defineMethod (c$, "getAppletInfo", 
function () {
return J.i18n.GT._ ("Jmol Applet version {0} {1}.\n\nAn OpenScience project.\n\nSee http://www.jmol.org for more information", [J.viewer.JC.version, J.viewer.JC.date]) + "\nhtmlName = " + J.util.Escape.eS (this.htmlName) + "\nsyncId = " + J.util.Escape.eS (this.syncId) + "\ndocumentBase = " + J.util.Escape.eS ("" + this.getProperty ("documentBase")) + "\ncodeBase = " + J.util.Escape.eS ("" + this.getProperty ("codeBase"));
});
Clazz.defineMethod (c$, "getProperty", 
function (infoType) {
return this.viewer.getProperty (null, infoType, "");
}, "~S");
Clazz.defineMethod (c$, "getProperty", 
function (infoType, paramInfo) {
return this.viewer.getProperty (null, infoType, paramInfo);
}, "~S,~S");
Clazz.defineMethod (c$, "getPropertyAsString", 
function (infoType) {
return this.viewer.getProperty ("readable", infoType, "").toString ();
}, "~S");
Clazz.defineMethod (c$, "getPropertyAsString", 
function (infoType, paramInfo) {
return this.viewer.getProperty ("readable", infoType, paramInfo).toString ();
}, "~S,~S");
Clazz.defineMethod (c$, "getPropertyAsJSON", 
function (infoType) {
return this.viewer.getProperty ("JSON", infoType, "").toString ();
}, "~S");
Clazz.defineMethod (c$, "getPropertyAsJSON", 
function (infoType, paramInfo) {
return this.viewer.getProperty ("JSON", infoType, paramInfo).toString ();
}, "~S,~S");
Clazz.defineMethod (c$, "loadInlineString", 
function (strModel, script, isAppend) {
var errMsg = this.viewer.loadInline (strModel, isAppend);
if (errMsg == null) this.script (script);
return errMsg;
}, "~S,~S,~B");
Clazz.defineMethod (c$, "loadInlineArray", 
function (strModels, script, isAppend) {
if (strModels == null || strModels.length == 0) return null;
var errMsg = this.viewer.loadInline (strModels, isAppend);
if (errMsg == null) this.script (script);
return errMsg;
}, "~A,~S,~B");
c$.sendCallback = Clazz.defineMethod (c$, "sendCallback", 
function (strInfo, callback, data) {
if (callback == null || callback.length == 0) {
} else if (callback.equals ("alert")) {
{
alert(strInfo);
return "";
}} else {
var tokens = J.util.TextFormat.split (callback, '.');
{
try{
var o = window[tokens[0]]
for (i = 1; i < tokens.length; i++){
o = o[tokens[i]]
}
return o(data[0],data[1],data[2],data[3],data[4],data[5],data[6],data[7]);
} catch (e) {
System.out.println(callback + " failed " + e);
}
}}return "";
}, "~S,~S,~A");
Clazz.overrideMethod (c$, "register", 
function (id, jsi) {
J.appletjs.JmolAppletRegistry.checkIn (id, jsi);
}, "~S,J.api.JmolSyncInterface");
c$.$Jmol$MyStatusListener$ = function () {
Clazz.pu$h ();
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.haveNotifiedError = false;
Clazz.instantialize (this, arguments);
}, J.appletjs.Jmol, "MyStatusListener", null, J.api.JmolStatusListener);
Clazz.overrideMethod (c$, "getRegistryInfo", 
function () {
J.appletjs.JmolAppletRegistry.checkIn (null, null);
return J.appletjs.JmolAppletRegistry.htRegistry;
});
Clazz.overrideMethod (c$, "resizeInnerPanel", 
function (a) {
}, "~S");
Clazz.overrideMethod (c$, "notifyEnabled", 
function (a) {
switch (a) {
case J.constant.EnumCallback.ANIMFRAME:
case J.constant.EnumCallback.ECHO:
case J.constant.EnumCallback.ERROR:
case J.constant.EnumCallback.EVAL:
case J.constant.EnumCallback.LOADSTRUCT:
case J.constant.EnumCallback.MEASURE:
case J.constant.EnumCallback.MESSAGE:
case J.constant.EnumCallback.PICK:
case J.constant.EnumCallback.SYNC:
case J.constant.EnumCallback.SCRIPT:
return true;
case J.constant.EnumCallback.APPLETREADY:
case J.constant.EnumCallback.ATOMMOVED:
case J.constant.EnumCallback.CLICK:
case J.constant.EnumCallback.HOVER:
case J.constant.EnumCallback.MINIMIZATION:
case J.constant.EnumCallback.RESIZE:
break;
}
return (this.b$["J.appletjs.Jmol"].b$.get (a) != null);
}, "J.constant.EnumCallback");
Clazz.defineMethod (c$, "notifyCallback", 
function (a, b) {
var c = this.b$["J.appletjs.Jmol"].b$.get (a);
var d = (c != null && (b == null || b[0] == null));
var e = false;
if (b != null) b[0] = this.b$["J.appletjs.Jmol"].htmlName;
var f = (b == null || b[1] == null ? null : b[1].toString ());
switch (a) {
case J.constant.EnumCallback.APPLETREADY:
b[3] = this.b$["J.appletjs.Jmol"].jmol;
break;
case J.constant.EnumCallback.ERROR:
case J.constant.EnumCallback.EVAL:
case J.constant.EnumCallback.HOVER:
case J.constant.EnumCallback.MINIMIZATION:
case J.constant.EnumCallback.RESIZE:
break;
case J.constant.EnumCallback.CLICK:
if ("alert".equals (c)) f = "x=" + b[1] + " y=" + b[2] + " action=" + b[3] + " clickCount=" + b[4];
break;
case J.constant.EnumCallback.ANIMFRAME:
var g = b[1];
var h = g[0];
var i = g[1];
var j = g[2];
var k = g[3];
var l = g[4];
var m = (h <= -2);
var n = (k < 0 ? -1 : 1);
var o = (l < 0 ? -1 : 1);
if (d) {
b = [this.b$["J.appletjs.Jmol"].htmlName, Integer.$valueOf (Math.max (h, -2 - h)), Integer.$valueOf (i), Integer.$valueOf (j), Integer.$valueOf (Math.abs (k)), Integer.$valueOf (Math.abs (l)), Integer.$valueOf (m ? 1 : 0), Integer.$valueOf (n), Integer.$valueOf (o)];
}break;
case J.constant.EnumCallback.ECHO:
var p = (b.length == 2);
var q = (p || (b[2]).intValue () == 1);
if (!d) {
if (q) e = true;
d = (!p && (c = this.b$["J.appletjs.Jmol"].b$.get ((a = J.constant.EnumCallback.MESSAGE))) != null);
}if (!e) this.output (f);
break;
case J.constant.EnumCallback.LOADSTRUCT:
var r = b[4];
if (r != null) {
r = (r.indexOf ("NOTE:") >= 0 ? "" : J.i18n.GT._ ("File Error:")) + r;
this.showStatus (r);
this.notifyCallback (J.constant.EnumCallback.MESSAGE, ["", r]);
return;
}break;
case J.constant.EnumCallback.MEASURE:
if (!d) d = ((c = this.b$["J.appletjs.Jmol"].b$.get ((a = J.constant.EnumCallback.MESSAGE))) != null);
var s = b[3];
if (s.indexOf ("Picked") >= 0 || s.indexOf ("Sequence") >= 0) {
this.showStatus (f);
e = true;
} else if (s.indexOf ("Completed") >= 0) {
f = s + ": " + f;
e = true;
}break;
case J.constant.EnumCallback.MESSAGE:
e = !d;
d = new Boolean (d & (f != null)).valueOf ();
if (!e) this.output (f);
break;
case J.constant.EnumCallback.PICK:
this.showStatus (f);
e = true;
break;
case J.constant.EnumCallback.SCRIPT:
var t = (b[3]).intValue ();
if (t > 0) {
this.notifyScriptTermination ();
} else if (!d) {
d = ((c = this.b$["J.appletjs.Jmol"].b$.get ((a = J.constant.EnumCallback.MESSAGE))) != null);
}this.output (f);
this.showStatus (f);
break;
case J.constant.EnumCallback.SYNC:
this.sendScript (f, b[2], true, d);
return;
}
if (e) {
var u = this.b$["J.appletjs.Jmol"].viewer.getProperty ("DATA_API", "getAppConsole", null);
if (u != null) {
u.notifyCallback (a, b);
this.output (f);
this.b$["J.appletjs.Jmol"].sendJsTextareaStatus (f);
}}if (!d || !this.b$["J.appletjs.Jmol"].mayScript) return;
try {
J.appletjs.Jmol.sendCallback (f, c, b);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
if (!this.haveNotifiedError) if (J.util.Logger.debugging) {
J.util.Logger.debug (a.name () + "Callback call error to " + c + ": " + e);
}this.haveNotifiedError = true;
} else {
throw e;
}
}
}, "J.constant.EnumCallback,~A");
Clazz.defineMethod (c$, "output", 
($fz = function (a) {
if (this.b$["J.appletjs.Jmol"].outputBuffer != null && a != null) this.b$["J.appletjs.Jmol"].outputBuffer.append (a).appendC ('\n');
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "notifyScriptTermination", 
($fz = function () {
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "notifySync", 
($fz = function (a, b) {
var c = this.b$["J.appletjs.Jmol"].b$.get (J.constant.EnumCallback.SYNC);
if (!this.b$["J.appletjs.Jmol"].mayScript || c == null) return a;
try {
{
return eval(syncCallback)(this.htmlName, info, appletName);
}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
if (!this.haveNotifiedError) if (J.util.Logger.debugging) {
J.util.Logger.debug ("syncCallback call error to " + c + ": " + e);
}this.haveNotifiedError = true;
} else {
throw e;
}
}
return a;
}, $fz.isPrivate = true, $fz), "~S,~S");
Clazz.overrideMethod (c$, "setCallbackFunction", 
function (a, b) {
if (a.equalsIgnoreCase ("modelkit")) return;
if (a.equalsIgnoreCase ("language")) {
this.consoleMessage ("");
this.consoleMessage (null);
return;
}var c = J.constant.EnumCallback.getCallback (a);
if (c != null && (this.b$["J.appletjs.Jmol"].loading || c !== J.constant.EnumCallback.EVAL)) {
if (b == null) this.b$["J.appletjs.Jmol"].b$.remove (c);
 else this.b$["J.appletjs.Jmol"].b$.put (c, b);
return;
}this.consoleMessage ("Available callbacks include: " + J.constant.EnumCallback.getNameList ().$replace (';', ' ').trim ());
}, "~S,~S");
Clazz.overrideMethod (c$, "eval", 
function (a) {
var b = a.indexOf ("\1");
if (b >= 0) return this.sendScript (a.substring (b + 1), a.substring (0, b), false, false);
if (this.b$["J.appletjs.Jmol"].b$.get (J.constant.EnumCallback.EVAL) != null) {
this.notifyCallback (J.constant.EnumCallback.EVAL, [null, a]);
return "";
}try {
{
return "" + eval(a);// strEval -- Java2Script is compressing this file for some reason
}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
J.util.Logger.error ("# error evaluating " + a + ":" + e.toString ());
} else {
throw e;
}
}
return "";
}, "~S");
Clazz.overrideMethod (c$, "createImage", 
function (a, b, c, d) {
return null;
}, "~S,~S,~O,~N");
Clazz.overrideMethod (c$, "functionXY", 
function (a, b, c) {
var d =  Clazz.newFloatArray (Math.abs (b), Math.abs (c), 0);
if (!this.b$["J.appletjs.Jmol"].mayScript || b == 0 || c == 0) return d;
try {
if (b > 0 && c > 0) {
for (var e = 0; e < b; e++) for (var f = 0; f < c; f++) {
{
fxy[i][j] = eval(functionName)(this.htmlName, i, j);
}}

} else if (c > 0) {
var e;
{
data = eval(functionName)(this.htmlName, nX, nY);
}b = Math.abs (b);
var f =  Clazz.newFloatArray (b * c, 0);
J.util.Parser.parseStringInfestedFloatArray (e, null, f);
for (var g = 0, h = 0; g < b; g++) {
for (var i = 0; i < c; i++, h++) {
d[g][i] = f[h];
}
}
} else {
{
data = eval(functionName)(htmlName, nX, nY, fxy);
}}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
J.util.Logger.error ("Exception " + e + " with nX, nY: " + b + " " + c);
} else {
throw e;
}
}
return d;
}, "~S,~N,~N");
Clazz.overrideMethod (c$, "functionXYZ", 
function (a, b, c, d) {
var e =  Clazz.newFloatArray (Math.abs (b), Math.abs (c), Math.abs (d), 0);
if (!this.b$["J.appletjs.Jmol"].mayScript || b == 0 || c == 0 || d == 0) return e;
try {
{
eval(functionName)(this.htmlName, nX, nY, nZ, fxyz);
}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
J.util.Logger.error ("Exception " + e + " for " + a + " with nX, nY, nZ: " + b + " " + c + " " + d);
} else {
throw e;
}
}
return e;
}, "~S,~N,~N,~N");
Clazz.overrideMethod (c$, "showUrl", 
function (a) {
if (J.util.Logger.debugging) {
J.util.Logger.debug ("showUrl(" + a + ")");
}if (a != null && a.length > 0) {
try {
var b =  new java.net.URL (Clazz.castNullAs ("java.net.URL"), a, null);
{
window.open(url);
}} catch (mue) {
if (Clazz.exceptionOf (mue, java.net.MalformedURLException)) {
this.consoleMessage ("Malformed URL:" + a);
} else {
throw mue;
}
}
}}, "~S");
Clazz.defineMethod (c$, "finalize", 
function () {
J.util.Logger.debug ("MyStatusListener finalize " + this);
Clazz.superCall (this, J.appletjs.Jmol.MyStatusListener, "finalize", []);
});
Clazz.defineMethod (c$, "showStatus", 
($fz = function (a) {
try {
System.out.println (a);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "consoleMessage", 
($fz = function (a) {
this.notifyCallback (J.constant.EnumCallback.ECHO, ["", a]);
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "sendScript", 
($fz = function (a, b, c, d) {
if (d) {
a = this.notifySync (a, b);
if (a == null || a.length == 0 || a.equals ("0")) return "";
}var e =  new java.util.ArrayList ();
J.appletjs.JmolAppletRegistry.findApplets (b, this.b$["J.appletjs.Jmol"].syncId, this.b$["J.appletjs.Jmol"].fullName, e);
var f = e.size ();
if (f == 0) {
if (!d && !b.equals ("*")) J.util.Logger.error (this.b$["J.appletjs.Jmol"].fullName + " couldn't find applet " + b);
return "";
}var g = (c ? null :  new J.util.SB ());
var h = (c && a.equals ("GET_GRAPHICS"));
var i = (c && a.equals ("SET_GRAPHICS_OFF"));
if (h) this.b$["J.appletjs.Jmol"].gRight = null;
for (var j = 0; j < f; j++) {
var k = e.get (j);
var l = J.appletjs.JmolAppletRegistry.htRegistry.get (k);
var m = (Clazz.instanceOf (l, J.api.JmolScriptInterface));
if (J.util.Logger.debugging) J.util.Logger.debug (this.b$["J.appletjs.Jmol"].fullName + " sending to " + k + ": " + a);
try {
if (m && (h || i)) {
this.b$["J.appletjs.Jmol"].gRight = (l).setStereoGraphics (h);
return "";
}if (c) l.syncScript (a);
 else if (m) g.append ((l).scriptWait (a, "output")).append ("\n");
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
var n = this.b$["J.appletjs.Jmol"].htmlName + " couldn't send to " + k + ": " + a + ": " + e;
J.util.Logger.error (n);
if (!c) g.append (n);
} else {
throw e;
}
}
}
return (c ? "" : g.toString ());
}, $fz.isPrivate = true, $fz), "~S,~S,~B,~B");
Clazz.overrideMethod (c$, "getProperty", 
function (a) {
return null;
}, "~S");
c$ = Clazz.p0p ();
};
Clazz.defineStatics (c$,
"SCRIPT_CHECK", 0,
"SCRIPT_WAIT", 1,
"SCRIPT_NOWAIT", 2);
});
