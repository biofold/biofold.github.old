Clazz.declarePackage ("J.awtjs2d");
Clazz.load (["J.awtjs2d.JSPopup"], "J.awtjs2d.JSModelKitPopup", ["J.i18n.GT", "J.modelkit.ModelKitPopupResourceBundle", "J.util.Elements"], function () {
c$ = Clazz.declareType (J.awtjs2d, "JSModelKitPopup", J.awtjs2d.JSPopup);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, J.awtjs2d.JSModelKitPopup, []);
});
Clazz.overrideMethod (c$, "jpiInitialize", 
function (viewer, menu) {
this.updateMode = -1;
var doTranslate = J.i18n.GT.setDoTranslate (true);
var bundle =  new J.modelkit.ModelKitPopupResourceBundle ();
this.initialize (viewer, bundle, bundle.getMenuName ());
J.i18n.GT.setDoTranslate (doTranslate);
}, "J.viewer.Viewer,~S");
Clazz.defineMethod (c$, "checkMenuClick", 
function (source, script) {
if (script.equals ("clearQ")) {
for (var o, $o = this.htCheckbox.values ().iterator (); $o.hasNext () && ((o = $o.next ()) || true);) {
{
script = o.getActionCommand();
if (script.indexOf(":??") < 0)
continue;
this.updateButton(o, "??", "_??P!:");
o.setSelected(false);
this.thisPopup.tainted = true;
}}
this.viewer.evalStringQuiet ("set picking assignAtom_C");
return;
}Clazz.superCall (this, J.awtjs2d.JSModelKitPopup, "checkMenuClick", [source, script]);
}, "~O,~S");
Clazz.overrideMethod (c$, "menuSetCheckBoxOption", 
function (item, name, what) {
var element = J.i18n.GT._ ("Element?");
if (element == null || J.util.Elements.elementNumberFromSymbol (element, true) == 0) return null;
this.updateButton (item, element, "assignAtom_" + element + "P!:??");
return "set picking assignAtom_" + element;
}, "~O,~S,~S");
Clazz.overrideMethod (c$, "getEntryIcon", 
function (ret) {
var entry = ret[0];
if (!entry.startsWith ("<")) return null;
var pt = entry.indexOf (">");
ret[0] = entry.substring (pt + 1);
return "org/jmol/modelkit/images/" + entry.substring (1, pt);
}, "~A");
});
