#!/usr/bin/env python
#
# Select Log Access
import os, os.path, string
from optparse import OptionParser
from datetime import date
from commands import getstatusoutput
progfilter="/export/bass/services/loghetti/loghetti.py"
progeo='/export/bass/services/log2georss-log2georss/log2georss.py'


def create_tmplog(logfile,urltext):
	# create temporary file
        tmpfile=getstatusoutput('mktemp')[1]
	# search for logfile
	com1='ls -ltr '+logfile+'* | awk \'{print $NF}\''
	out1=getstatusoutput(com1)
	if out1[0]!=0:
		print 'ERROR: logfiles '+logfile+'* not found'
	else:
		listlogs=out1[1].split()
		for logs in listlogs:
			if logs[-3:]=='.gz': 
				pre='z'
			else:
				pre=''
			print 'Search in logfile '+logs
			if urltext!='':
				com2=pre+'cat '+logs+' | grep -i '+urltext+'  >> '+tmpfile+'.1'
			else:
				com2=pre+'cat '+logs+'  >> '+tmpfile+'.1'
			out2=getstatusoutput(com2)
			if out2[0]!=0:
				print 'WARNING: logfile '+logs+' not found'
	return tmpfile


def select_logs(logfile,urltext,year,month):	
	# create temporary file with logs
	tmpfile=create_tmplog(logfile,urltext)
	nlogfile=tmpfile+'.1'
	# use loghetti.py to select log by dates
	print "Filter logfile using loghetti"
	com2=progfilter+' --file='+nlogfile+' --year='+year
	if month!='': com2=com2+' --month='+month
	com2=com2+' > '+tmpfile
	out2=getstatusoutput(com2)
	if os.path.isfile(tmpfile+'.1'): os.remove(tmpfile+'.1')
	return tmpfile


def create_mapxml(logfile,outfile,title=''):
	logdir='/tmp'
	#deftime='63244800' # 2x366 days in seconds
	deftime='31622400' # 1x366 days in seconds
	err=0
	logname=logfile.split('/')[2]
	com=progeo+' -d '+logdir+' -l '+logname+' -L apache -o '+outfile+\
	' -t '+deftime+' -q '
	if title!='': com=com+' -T '+title
	print "Create log2georss file"
	out=getstatusoutput(com)
	if out[0]!=0: 
		print 'ERROR: log2georss.py do not run correctly. '
		getstatusoutput('touch '+outfile)
		err=1
	os.remove(logfile)
	return err
	






if __name__ == "__main__":
	parser = OptionParser('\nUsage : python %prog logfile  \n[ -t urltext -y year -m month --title title -o output ]')
	parser.add_option ("-t", "--urltext",action="store",type="string",dest="urltext", help="Select URLs containing urltext")
	parser.add_option ("-y", "--year",action="store",type="int",dest="year", help="Select year's logs")
	parser.add_option ("-m", "--month",action="store",type="int",dest="month", help="Select month's logs")
        parser.add_option ("-o", "--output",action="store",type="string",dest="output", help="Output file")
        parser.add_option ("--title",action="store",type="string",dest="title", help="Data title")
	(options, args) = parser.parse_args()
	if len(args)>0:
		logfile=args[0]
		urltext=''
		year=''
		month=''
		title=''
		if options.urltext: urltext=options.urltext
		if options.year:
			year="%04d" %options.year
		else:
			year="%04d" %date.today().year
		if options.month==0:
			month='' 
		elif (options.month>0 and options.month<13): 
			month="%02d" %options.month
		else:
			month="%02d" %date.today().month
		if options.output: 
			output=options.output
			outpath=string.join(string.split(output,'/')[:-1],'/')
			if os.path.isdir(outpath)==False and outpath!='': 
				print 'WARNING: ouptut file can not be create.'
				print 'WARNING: new output',logfile
				output=logfile
                else:
                        output=logfile
		output=output+year+month+'.xml'
		if options.title: title=options.title
		tmplog=select_logs(logfile,urltext,year,month)
		err=create_mapxml(tmplog,output,title)
		if err==0: print 'Log2georss file saved in '+output
	else:
		print "\npython build_logaccess.py logfile  \n[ -t urltext -y year -m month --title title -o output ]"
