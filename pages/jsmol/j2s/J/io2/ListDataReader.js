Clazz.declarePackage ("J.io2");
Clazz.load (["J.io.DataReader"], "J.io2.ListDataReader", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.data = null;
this.pt = 0;
this.len = 0;
Clazz.instantialize (this, arguments);
}, J.io2, "ListDataReader", J.io.DataReader);
Clazz.overrideMethod (c$, "setData", 
function (data) {
this.data = data;
this.len = this.data.size ();
return this;
}, "~O");
Clazz.overrideMethod (c$, "read", 
function (buf, off, len) {
return this.readBuf (buf, off, len);
}, "~A,~N,~N");
Clazz.overrideMethod (c$, "readLine", 
function () {
return (this.pt < this.len ? this.data.get (this.pt++) : null);
});
Clazz.defineMethod (c$, "mark", 
function (ptr) {
this.ptMark = this.pt;
}, "~N");
Clazz.overrideMethod (c$, "reset", 
function () {
this.pt = this.ptMark;
});
});
