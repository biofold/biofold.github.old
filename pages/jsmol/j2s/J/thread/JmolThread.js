Clazz.declarePackage ("J.thread");
Clazz.load (["java.lang.Thread"], "J.thread.JmolThread", ["J.util.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.$name = "JmolThread";
this.viewer = null;
this.eval = null;
this.sc = null;
this.hoverEnabled = false;
this.startTime = 0;
this.targetTime = 0;
this.lastRepaintTime = 0;
this.currentTime = 0;
this.sleepTime = 0;
this.isJS = false;
this.stopped = false;
this.isReset = false;
this.useTimeout = true;
this.junk = 0;
Clazz.instantialize (this, arguments);
}, J.thread, "JmolThread", Thread);
Clazz.defineMethod (c$, "setViewer", 
function (viewer, name) {
this.setName (name);
this.$name = name + "_" + (($t$ = ++ J.thread.JmolThread.threadIndex, J.thread.JmolThread.prototype.threadIndex = J.thread.JmolThread.threadIndex, $t$));
this.viewer = viewer;
this.isJS = viewer.isSingleThreaded;
}, "J.viewer.Viewer,~S");
Clazz.defineMethod (c$, "setEval", 
function (eval) {
this.eval = eval;
this.sc = this.viewer.getEvalContextAndHoldQueue (eval);
if (this.sc != null) this.useTimeout = eval.getAllowJSThreads ();
}, "J.api.JmolScriptEvaluator");
Clazz.defineMethod (c$, "resumeEval", 
function () {
if (this.eval == null || !this.isJS || !this.useTimeout) return;
this.sc.mustResumeEval = !this.stopped;
this.eval.resumeEval (this.sc);
this.eval = null;
this.sc = null;
});
Clazz.defineMethod (c$, "start", 
function () {
if (this.isJS) {
J.util.Logger.info ("starting " + this.$name);
this.run ();
} else {
Clazz.superCall (this, J.thread.JmolThread, "start", []);
}});
Clazz.overrideMethod (c$, "run", 
function () {
this.startTime = System.currentTimeMillis ();
try {
this.run1 (-1);
} catch (e$$) {
if (Clazz.exceptionOf (e$$, InterruptedException)) {
var e = e$$;
{
if (J.util.Logger.debugging) this.oops (e);
}
} else if (Clazz.exceptionOf (e$$, Exception)) {
var e = e$$;
{
this.oops (e);
}
} else {
throw e$$;
}
}
});
Clazz.defineMethod (c$, "oops", 
function (e) {
System.out.println (this.$name + " exception " + e);
e.printStackTrace ();
this.viewer.queueOnHold = false;
}, "Exception");
Clazz.defineMethod (c$, "runSleep", 
function (millis, runPtr) {
if (this.isJS && !this.useTimeout) {
return true;
}{
var me = this;
setTimeout(function(){me.run1(runPtr)}, Math.max(millis, 0));
return false;
}}, "~N,~N");
Clazz.defineMethod (c$, "interrupt", 
function () {
this.stopped = true;
this.viewer.startHoverWatcher (true);
if (!this.isJS) Clazz.superCall (this, J.thread.JmolThread, "interrupt", []);
});
Clazz.defineMethod (c$, "checkInterrupted", 
function () {
{
return this.stopped;
}});
Clazz.defineMethod (c$, "reset", 
function () {
this.isReset = true;
this.interrupt ();
});
Clazz.defineStatics (c$,
"threadIndex", 0,
"INIT", -1,
"MAIN", 0,
"FINISH", -2,
"CHECK1", 1,
"CHECK2", 2,
"CHECK3", 3);
});
