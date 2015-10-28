#!/bin/sh
# Update Servers' Access

if [ -z $1 ]; then
        year=`date +"%Y"`
        month=`date +"%m"| sed s/^0//g`
else
        month=$1
        year=$2
fi

# I-Mutant
echo "1) Update I-Mutant access"
/export/bass/tools/scripts/build_logaccess.py /export/bass/folding/logs/access.log -m 0 -y $year -t I-Mutant -o /export/bass/folding/https/maps/georss/access_imutant --title "\"I-Mutant\""
/export/bass/tools/scripts/build_logaccess.py /export/bass/folding/logs/access.log -m $month -y $year -t I-Mutant -o /export/bass/folding/https/maps/georss/access_imutant --title "\"I-Mutant\""
echo ""

# K-Fold
echo "2) Update K-Fold access"
/export/bass/tools/scripts/build_logaccess.py /export/bass/folding/logs/access.log -m 0 -y $year -t K-Fold -o /export/bass/folding/https/maps/georss/access_kfold --title "\"K-Fold\""
/export/bass/tools/scripts/build_logaccess.py /export/bass/folding/logs/access.log -m $month -y $year -t K-Fold -o /export/bass/folding/https/maps/georss/access_kfold --title "\"K-Fold\""
echo ""

# Folding
echo "3) Update Folding access"
tmpaccess=`mktemp`
# Search in zipped file
for i in `ls -ltr /export/bass/folding/logs/access.log* | grep ".gz$" | awk '{print $NF}'`
do 
zcat $i | grep -vi I-Mutant | grep -vi K-Fold >>$tmpaccess
done
# Search in regular files
for i in `ls -ltr /export/bass/folding/logs/access.log* | grep -v ".gz$" | awk '{print $NF}'`
do 
cat $i  | grep -vi I-Mutant | grep -vi K-Fold >>$tmpaccess
done
/export/bass/tools/scripts/build_logaccess.py $tmpaccess -m 0 -y $year  -o /export/bass/folding/https/maps/georss/access_folding --title "\"Folding@UAB\""
/export/bass/tools/scripts/build_logaccess.py $tmpaccess -m $month -y $year  -o /export/bass/folding/https/maps/georss/access_folding --title "\"Folding@UAB\""
rm $tmpaccess
rsync -arv /export/bass/folding/https/maps/georss /export/emidio/public_html/folding/maps
