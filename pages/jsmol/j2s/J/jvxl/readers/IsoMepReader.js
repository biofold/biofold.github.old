Clazz.declarePackage ("J.jvxl.readers");
Clazz.load (["J.jvxl.readers.AtomDataReader"], "J.jvxl.readers.IsoMepReader", ["J.api.Interface"], function () {
c$ = Clazz.decorateAsClass (function () {
this.type = null;
Clazz.instantialize (this, arguments);
}, J.jvxl.readers, "IsoMepReader", J.jvxl.readers.AtomDataReader);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, J.jvxl.readers.IsoMepReader, []);
});
Clazz.defineMethod (c$, "init", 
function (sg) {
Clazz.superCall (this, J.jvxl.readers.IsoMepReader, "init", [sg]);
this.type = "Mep";
}, "J.jvxl.readers.SurfaceGenerator");
Clazz.defineMethod (c$, "setup", 
function (isMapData) {
Clazz.superCall (this, J.jvxl.readers.IsoMepReader, "setup", [isMapData]);
this.doAddHydrogens = false;
this.getAtoms (this.params.bsSelected, this.doAddHydrogens, true, false, false, false, false, this.params.mep_marginAngstroms);
this.setHeader ("MEP", "");
this.setRanges (this.params.mep_ptsPerAngstrom, this.params.mep_gridMax, 0);
}, "~B");
Clazz.overrideMethod (c$, "generateCube", 
function () {
this.newVoxelDataCube ();
var m = J.api.Interface.getOptionInterface ("quantum." + this.type + "Calculation");
m.calculate (this.volumeData, this.bsMySelected, this.atomData.atomXyz, this.params.theProperty, this.params.mep_calcType);
});
});
