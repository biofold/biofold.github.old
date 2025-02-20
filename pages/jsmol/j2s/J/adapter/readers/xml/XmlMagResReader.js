Clazz.declarePackage ("J.adapter.readers.xml");
Clazz.load (["J.adapter.readers.xml.XmlReader"], "J.adapter.readers.xml.XmlMagResReader", ["J.util.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.myAttributes = null;
Clazz.instantialize (this, arguments);
}, J.adapter.readers.xml, "XmlMagResReader", J.adapter.readers.xml.XmlReader);
Clazz.prepareFields (c$, function () {
this.myAttributes = [];
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, J.adapter.readers.xml.XmlMagResReader, []);
});
Clazz.defineMethod (c$, "getDOMAttributes", 
function () {
var $private = Clazz.checkPrivateMethod (arguments);
if ($private != null) {
return $private.apply (this, arguments);
}
return this.myAttributes;
});
Clazz.defineMethod (c$, "processXml", 
function (parent, saxReader) {
parent.doProcessLines = true;
Clazz.superCall (this, J.adapter.readers.xml.XmlMagResReader, "processXml", [parent, saxReader]);
}, "J.adapter.readers.xml.XmlReader,~O");
Clazz.overrideMethod (c$, "processStartElement", 
function (localName) {
if (J.util.Logger.debugging) J.util.Logger.debug ("xmlmagres: start " + localName);
if (!this.parent.continuing) return;
if ("calculation".equals (localName)) {
this.keepChars = true;
return;
}if ("atoms".equals (localName)) {
this.keepChars = true;
return;
}}, "~S");
Clazz.overrideMethod (c$, "processEndElement", 
function (localName) {
if (J.util.Logger.debugging) J.util.Logger.debug ("xmlmagres: end " + localName);
while (true) {
if ("calculation".equals (localName)) {
break;
}if (!this.parent.doProcessLines) break;
if ("atoms".equals (localName)) {
break;
}return;
}
this.chars = null;
this.keepChars = false;
}, "~S");
});
