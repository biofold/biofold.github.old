#!/bin/sh
# Clean SNPs&GO directories
/usr/bin/python /export/bass/tools/scripts/cleandir.py /export/bass/snps/SNPs-and-GO/https/www-data/output/ 
/usr/bin/python /export/bass/tools/scripts/cleandir.py /export/bass/snps/SNPs-and-GO/https/www-data/junk/
/usr/bin/python /export/bass/tools/scripts/cleandir.py /export/bass/snps/SNPs-and-GO/https/www-data/tmp/
# Clean PhD-SNP, PhD-SNPg e Fido-SNP
/usr/bin/python /export/bass/tools/scripts/cleandir.py /export/bass/snps/PhD-SNP/https/www-data/output/
/usr/bin/python /export/bass/tools/scripts/cleandir.py /export/bass/snps/PhD-SNPg/www-data/
/usr/bin/python /export/bass/tools/scripts/cleandir.py /export/bass/snps/Fido-SNP/www-data/
# Clean SARA directory
/usr/bin/python /export/bass/tools/scripts/cleandir.py /export/bass/structure/SARA/https/www-data/output/
# Clean Meta-SNP directory
/usr/bin/python /export/bass/tools/scripts/cleandir.py /export/bass/snps/Meta-SNP/https/www-data/output/
# Clean I-Mutant directory
/usr/bin/python /export/bass/tools/scripts/cleandir.py /export/bass/folding/I-Mutant/https/www-data/output/
# Clean K-Fold directory
/usr/bin/python /export/bass/tools/scripts/cleandir.py /export/bass/folding/K-Fold/https/www-data/output/
# Clean InterPro directory
/usr/bin/python /export/bass/tools/scripts/cleandir.py /export/bass/services/iprscan/tmp/
# Clean PepA directory
/usr/bin/python /export/bass/tools/scripts/cleandir.py /export/bass/folding/PepA/https/www-data/output/
# Clean PANTHER
/usr/bin/python /export/bass/tools/scripts/cleandir.py /export/bass/services/csnpAnalysis1.01/tmp/
# Clean ContrastRank
/usr/bin/python /export/bass/tools/scripts/cleandir.py /export/bass/snps/ContrastRank/https/www-data/
