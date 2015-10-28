import sys, time
from commands import getstatusoutput


def readfiletime(odir):
	df=[]
	out=getstatusoutput('ls -lrt --time-style=long-iso '+odir)
	if out[0]==0:
		res=out[1].split('\n')
		olen=len(res)
		for i in range(1,olen):
			v=res[i].split()
			tt=v[5].split('-')
			df.append([odir+v[-1],v[5]+' '+v[6]])
	else:
		print 'ERROR:',out[1]
	return df


def cleandata(flist,nsec=86400):
	c=0
	at=time.time()
	for dfile in flist:
		ftime=time.mktime(time.strptime(dfile[1], "%Y-%m-%d %H:%M"))
		#print dfile[0],at,ftime,at-ftime
		if (at-ftime)>nsec:
			out=getstatusoutput('su apache -c "rm -rf '+dfile[0]+'"')
			if out[0]!=0: 
				print 'ERROR:',out[1]
			else:
				c=c+1
	return


if __name__=="__main__":
        for i in range(1,len(sys.argv)):
		flist=readfiletime(sys.argv[i])
		cleandata(flist)
