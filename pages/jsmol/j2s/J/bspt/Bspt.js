Clazz.declarePackage ("J.bspt");
Clazz.load (null, "J.bspt.Bspt", ["J.bspt.CubeIterator", "$.Leaf", "J.util.Logger", "$.SB"], function () {
c$ = Clazz.decorateAsClass (function () {
this.treeDepth = 0;
this.dimMax = 0;
this.index = 0;
this.eleRoot = null;
Clazz.instantialize (this, arguments);
}, J.bspt, "Bspt");
Clazz.makeConstructor (c$, 
function (dimMax, index) {
this.dimMax = dimMax;
this.index = index;
this.reset ();
}, "~N,~N");
Clazz.defineMethod (c$, "reset", 
function () {
this.eleRoot =  new J.bspt.Leaf (this, null, 0);
this.treeDepth = 1;
});
Clazz.defineMethod (c$, "addTuple", 
function (tuple) {
this.eleRoot = this.eleRoot.addTuple (0, tuple);
}, "J.util.P3");
Clazz.defineMethod (c$, "stats", 
function () {
});
Clazz.defineMethod (c$, "dump", 
function () {
var sb =  new J.util.SB ();
this.eleRoot.dump (0, sb);
J.util.Logger.info (sb.toString ());
});
Clazz.defineMethod (c$, "allocateCubeIterator", 
function () {
return  new J.bspt.CubeIterator (this);
});
Clazz.defineStatics (c$,
"leafCountMax", 2,
"MAX_TREE_DEPTH", 100);
});
