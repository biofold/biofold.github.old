Clazz.declarePackage ("J.util");
Clazz.load (["J.util.BitSet"], "J.util.BitSetUtil", null, function () {
c$ = Clazz.declareType (J.util, "BitSetUtil");
c$.newAndSetBit = Clazz.defineMethod (c$, "newAndSetBit", 
function (i) {
var bs = J.util.BitSetUtil.newBitSet (i + 1);
bs.set (i);
return bs;
}, "~N");
c$.areEqual = Clazz.defineMethod (c$, "areEqual", 
function (a, b) {
return (a == null || b == null ? a == null && b == null : a.equals (b));
}, "J.util.BitSet,J.util.BitSet");
c$.haveCommon = Clazz.defineMethod (c$, "haveCommon", 
function (a, b) {
return (a == null || b == null ? false : a.intersects (b));
}, "J.util.BitSet,J.util.BitSet");
c$.cardinalityOf = Clazz.defineMethod (c$, "cardinalityOf", 
function (bs) {
return (bs == null ? 0 : bs.cardinality ());
}, "J.util.BitSet");
c$.newBitSet2 = Clazz.defineMethod (c$, "newBitSet2", 
function (i0, i1) {
var bs = J.util.BitSetUtil.newBitSet (i1);
bs.setBits (i0, i1);
return bs;
}, "~N,~N");
c$.setAll = Clazz.defineMethod (c$, "setAll", 
function (n) {
var bs = J.util.BitSetUtil.newBitSet (n);
bs.setBits (0, n);
return bs;
}, "~N");
c$.andNot = Clazz.defineMethod (c$, "andNot", 
function (a, b) {
if (b != null && a != null) a.andNot (b);
return a;
}, "J.util.BitSet,J.util.BitSet");
c$.copy = Clazz.defineMethod (c$, "copy", 
function (bs) {
return bs == null ? null : bs.clone ();
}, "J.util.BitSet");
c$.copy2 = Clazz.defineMethod (c$, "copy2", 
function (a, b) {
if (a == null || b == null) return null;
b.clearAll ();
b.or (a);
return b;
}, "J.util.BitSet,J.util.BitSet");
c$.copyInvert = Clazz.defineMethod (c$, "copyInvert", 
function (bs, n) {
return (bs == null ? null : J.util.BitSetUtil.andNot (J.util.BitSetUtil.setAll (n), bs));
}, "J.util.BitSet,~N");
c$.invertInPlace = Clazz.defineMethod (c$, "invertInPlace", 
function (bs, n) {
return J.util.BitSetUtil.copy2 (J.util.BitSetUtil.copyInvert (bs, n), bs);
}, "J.util.BitSet,~N");
c$.toggleInPlace = Clazz.defineMethod (c$, "toggleInPlace", 
function (a, b) {
if (a.equals (b)) {
a.clearAll ();
} else if (J.util.BitSetUtil.andNot (J.util.BitSetUtil.copy (b), a).length () == 0) {
J.util.BitSetUtil.andNot (a, b);
} else {
a.or (b);
}return a;
}, "J.util.BitSet,J.util.BitSet");
c$.deleteBits = Clazz.defineMethod (c$, "deleteBits", 
function (bs, bsDelete) {
if (bs == null || bsDelete == null) return bs;
var ipt = bsDelete.nextSetBit (0);
if (ipt < 0) return bs;
var len = bs.length ();
var lend = Math.min (len, bsDelete.length ());
var i;
for (i = bsDelete.nextClearBit (ipt); i < lend && i >= 0; i = bsDelete.nextClearBit (i + 1)) bs.setBitTo (ipt++, bs.get (i));

for (i = lend; i < len; i++) bs.setBitTo (ipt++, bs.get (i));

if (ipt < len) bs.clearBits (ipt, len);
return bs;
}, "J.util.BitSet,J.util.BitSet");
c$.newBitSet = Clazz.defineMethod (c$, "newBitSet", 
function (nFree) {
return J.util.BitSet.newN (nFree);
}, "~N");
c$.bsNull = c$.prototype.bsNull =  new J.util.BitSet ();
c$.emptySet = c$.prototype.emptySet =  new J.util.BitSet ();
});
