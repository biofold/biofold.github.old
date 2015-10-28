#!/bin/sh
# Update Servers' Access

if [ -z $1 ]; 
then
        year=`date +"%Y"`
        month=`date +"%m"| sed s/^0//g`
else
        month=$1
        year=$2
fi

# SARA
echo "1) Update SARA access"
/export/bass/tools/scripts/build_logaccess.py /export/bass/structure/logs/access.log -m 0 -y $year -t SARA -o /export/bass/structure/https/maps/georss/access_sara --title "\"SARA\""
/export/bass/tools/scripts/build_logaccess.py /export/bass/structure/logs/access.log -m $month -y $year -t SARA -o /export/bass/structure/https/maps/georss/access_sara --title "\"SARA\""
echo ""


# STRUCTURE
echo "5) Update Structure access"
tmpaccess=`mktemp`
# Search in zipped file
for i in `ls -ltr /export/bass/structure/logs/access.log* | grep ".gz$" | awk '{print $NF}'`
do 
zcat $i | grep -vi SARA  >>$tmpaccess
done
# Search in regular files
for i in `ls -ltr /export/bass/structure/logs/access.log* | grep -v ".gz$" | awk '{print $NF}'`
do 
cat $i  | grep -vi SARA  >>$tmpaccess
done
/export/bass/tools/scripts/build_logaccess.py $tmpaccess -m 0 -y $year  -o /export/bass/structure/https/maps/georss/access_structure --title "\"Structure@UAB\""
/export/bass/tools/scripts/build_logaccess.py $tmpaccess -m $month -y $year  -o /export/bass/structure/https/maps/georss/access_structure --title "\"Structure@UAB\""
rm $tmpaccess
rsync -ar /export/bass/structure/https/maps/georss /export/emidio/public_html/structure/maps
