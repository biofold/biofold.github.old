#!/bin/sh
# Update Servers' Access

if [ -z $1 ]; then
	year=`date +"%Y"`
	month=`date +"%m"| sed s/^0//g`
else
	month=$1
	year=$2
fi


# SNPs&GO
echo "1) Update SNPs&GO access"
/export/bass/tools/scripts/build_logaccess.py /export/bass/snps/logs/access.log -m 0 -y $year -t SNPs-and-GO -o /export/bass/snps/https/maps/georss/access_snpsgo --title "\"SNPs&GO\""
/export/bass/tools/scripts/build_logaccess.py /export/bass/snps/logs/access.log -m $month -y $year -t SNPs-and-GO -o /export/bass/snps/https/maps/georss/access_snpsgo --title "\"SNPs&GO\""
echo ""

# PhD-SNP
echo "2) Update PhD-SNP access"
/export/bass/tools/scripts/build_logaccess.py /export/bass/snps/logs/access.log -m 0 -y $year -t PhD-SNP -o /export/bass/snps/https/maps/georss/access_phdsnp --title "\"PhD-SNP\""
/export/bass/tools/scripts/build_logaccess.py /export/bass/snps/logs/access.log -m $month -y $year -t PhD-SNP -o /export/bass/snps/https/maps/georss/access_phdsnp --title "\"PhD-SNP\""
echo ""

# Meta-SNP
echo "3) Update Meta-SNP access"
/export/bass/tools/scripts/build_logaccess.py /export/bass/snps/logs/access.log -m 0 -y $year -t Meta-SNP -o /export/bass/snps/https/maps/georss/access_metasnp --title "\"Meta-SNP\""
/export/bass/tools/scripts/build_logaccess.py /export/bass/snps/logs/access.log -m $month -y $year -t Meta-SNP -o /export/bass/snps/https/maps/georss/access_metasnp --title "\"Meta-SNP\""

echo ""

# DrCancer
echo "4) Update DrCancer access"
/export/bass/tools/scripts/build_logaccess.py /export/bass/snps/logs/access.log -m 0 -y $year -t DrCancer -o /export/bass/snps/https/maps/georss/access_drcancer --title "\"DrCancer\""
/export/bass/tools/scripts/build_logaccess.py /export/bass/snps/logs/access.log -m $month -y $year -t DrCancer -o /export/bass/snps/https/maps/georss/access_drcancer --title "\"DrCancer\""
echo ""

# ContrastRank
echo "5) Update ContrastRank access"
/export/bass/tools/scripts/build_logaccess.py /export/bass/snps/logs/access.log -m 0 -y $year -t ContrastRank -o /export/bass/snps/https/maps/georss/access_contrastrank --title "\"ContrastRank\""
/export/bass/tools/scripts/build_logaccess.py /export/bass/snps/logs/access.log -m $month -y $year -t ContrastRank -o /export/bass/snps/https/maps/georss/access_contrastrank --title "\"ContrastRank\""
echo ""


# SNPs
echo "6) Update SNPs access"
tmpaccess=`mktemp`
# Search in zipped file
for i in `ls -ltr /export/bass/snps/logs/access.log* | grep ".gz$" | awk '{print $NF}'`
do 
zcat $i | grep -vi SNPs-and-GO | grep -vi DrCancer | grep -vi PhD-SNP | grep -vi Meta-SNP |grep -vi ContrastRank >>$tmpaccess
done
# Search in regular files
for i in `ls -ltr /export/bass/snps/logs/access.log* | grep -v ".gz$" | awk '{print $NF}'`
do 
cat $i  | grep -vi SNPs-and-GO | grep -vi DrCancer | grep -vi PhD-SNP | grep -vi Meta-SNP >>$tmpaccess
done
/export/bass/tools/scripts/build_logaccess.py $tmpaccess -m 0 -y $year  -o /export/bass/snps/https/maps/georss/access_snps --title "\"SNPs@UAB\""
/export/bass/tools/scripts/build_logaccess.py $tmpaccess -m $month -y $year  -o /export/bass/snps/https/maps/georss/access_snps --title "\"SNPs@UAB\""
rm $tmpaccess
rsync -ar /export/bass/snps/https/maps/georss /export/emidio/public_html/snps/maps
