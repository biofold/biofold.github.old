@source http://chemapps.stolaf.edu/jmol/jsmol
@author hansonr@stolaf.edu project started 8/26/2012

last revision, 2/23/2013

JSmol -- Java(Script) web-based molecular viewer

see jmol.sourceforge.net  jsmol.sourceforge.net

http://chemapps.stolaf.edu/jmol/jsmol/jsmol.htm

This zip directory contains the work in progress toward
a complete Java->JavaScript code conversion for Jmol. 

Note that JSmol is not a <i>different</i> program than Jmol.
JSmol <i>is</i> Jmol, just compiled into JavaScript as well as Java byte code.
All development is done working with the trunk Jmol Java source, 
but compilation of that code creates both Java .class files and equivalent JavaScript .js files 

As such, JSmol has just about all of the features of Jmol: 

 full file reading (including binary formats)
 full Jmol scripting (including atom selection and Jmol Math)
 full Jmol shape object support
  
Status:

 complete Jmol code implementation in JavaScript
 Java2Script js compiler adapted successfully
 WebGL: full, fast rendering, including cartoons and isosurfaces (vdw, sasurface)
 HTML5: slower rendering; but a full implementation of Jmol, including translucency and labels

To do:

 WebGL option is limited; still no text, for example

What's here:

REQUIRED DIRECTORIES:

j2s/        the key Java2Script-created files, including com/, java/, and J/
            along with j2s/core, which contains package.js and selected minimized core JS files

OPTIONAL DIRECTORIES:

data/       all the model and script files used by these test pages
java/       Jar files for the Java version of JSmol
js/         JSmolXXXX.js JavaScript files that are included in JSmol.min.js
make/       Windows batch files and closure_comiler.jar used to create this whole package
test/       some speed-test files 

FILES:

JSmol.min.js
============

All of the necessary files to start JSmol, minimized with the 
Google Closure Compiler (in the make/ directory)

jsmol.htm
=========

The main test page. Use this page as your starting point for the pages you write.
jsmol.htm is a general test of the integration of JSmol with JmolJSO.
It uses JSmol.min.js, which will call for files in j2s/ as needed.

On the server side, it uses jsmol.php for delivering cross-domain models into the viewer. 

simple.htm
==========

A JavaScript equivalent of http://chemapps.stolaf.edu/jmol/simple.htm

test2.htm
=========

A test page that does not use JSmol.min.js and instead uses the files in js/
This Jmol page will automatically switch to different modes
depending upon browser capabilities. It is set to use HTML5, but you can change that.
Read the information in the file for details.

It uses the unminimized set of JSmolXXXX.js files
If you add ?debugcode to the URL, it will bypasss j2s/core files and read from j2s/J, j2s/com, and j2s/java
It uses the signed Jmol applet, the unsigned Jmol applet
with server-side help, or <a href="jsmol.sourceforge.net">JSmol</a> using 
HTML5 when WebGL is not available (iPad/iPhone/Android).
JSmol implements <a href="java2script.sourceforge.net">Java2Script</a> 
to recreate the entire Jmol Java applet in JavaScript.

Note that if test2.htm is on your LOCAL MACHINE, then the unsigned applet,
which is in java/, will not find the data files, which are in data/,
and even if you use the signed applet, then some browsers may not be able to
find those files on your local machine. Firefox/Windows is fine.

On the server side, it uses jsmol.php for 
delivering cross-domain models into the viewer. 

Credits:

Jmol code conversion to JavaScript by Bob Hanson. 
GLmol interface written by Takanori Nakane. 
Java2Script written by Zhou Renjian, et al.
Jzlib written by Atsuhiko Yamanaka.
Testing assistance by Duncan Blue, St. Olaf '17


Developer notes:

The creation of the files in j2s is not trivial. 
We start with two Sourceforge projects in Eclipse: Jmol and JSmol.
Eclipse must include the Java2Script plug-in.

All the PROGRAMMING is done in the Jmol project.
JavaDoc @j2sNative sections allow indicating specific JavaScript/Java-only segments 

run build.xls

Then, within the JSmol project, we do the following:

run buildfromjmol.xls // transfers requird Java files from Jmol to JSmol
refresh the JSmol project // registers those new files
build the JSMol project // creates .js files in the bin/ directory
run buildtojs.xls  // copies those .js files to the js/ directory (for synchronizing)
                      and to jslocal/ for use here
                      also replaces "org.jmol" with "J"                      
copy all files in jslocal/ to the J/ directory here
run make/make.bat
use jsmol.htm to test the minimization into JSmol.min.js and core files
use test2.htm?debugcode to test the files in J/



revision 12:32 PM 11/2/2012  -- java/jmolcore.z.js

revision 1:19 PM 11/13/2012  -- full binary file reading on all tested browsers

revision 9:20 PM 11/18/2012  -- full threading -- hover, spin, animation, vibration, timeout, delay, moveto

revision 11/21/2012 10:26:18 AM  -- Spartan binary file reading, measurements working

revision 8:11 AM 11/22/2012  -- color Labels fix; adds _version information; adds Jmol.debugCode (true to skip core.z.js)

revision 8:12 PM 11/23/2012  -- adds MO homo SQUARED

revision 12:23 PM 11/24/2012 -- j2sjmol.js code trimming, Jmol.clearConsole(applet), 
				automatic switching of consoles between applets on mouseClick and scipting,
                                better handling of console vs information

revision 5:46 AM 11/26/2012  -- clean, ordered execution solves multithreading issues in Firefox and for multiple applets

revision 6:48 AM 12/7/2012   -- threading work complete -- script queuing, !quit, !exit, TRY/CATCH, FUNCTION, DELAY, MOVE, etc.

revision 12/24/2012 9:48:49 PM -- JavaScript popup menu and (preliminary) console

revision 7:45 PM 1/2/2013  -- Chrome displaying default popup menu with menu right-mouse click

revision 9:22 AM 1/15/2013 -- Full writing of PNG, PNGJ, JMOL, ZIP and general WRITE command; requires jsmol.php on server currently
                           -- JavaScript version completely switched to double precision; subtle differences with Jmol may arise.

revision 1/17/2013 6:00:50 PM -- SMILES matching compare({*},{*},"isomer") fails (Java new int[n][] in SmilesMatcher)

revision 10:57 AM 2/23/2013 -- rearranging of files in jsmol/ directory; move of j2s/org/mol to j2s/J

