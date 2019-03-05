var main = function () {

d3.tsv("http://snps.path.uab.edu//contrastrank/tmp/resources/tcga.tsv", function(links) {
	var data_table = []
	for (var i = 0; i <links.length; i++){
		data_table.push({"chr":links[i].CHR, "pos":links[i].POSITION, "rs":links[i].RSID, "ref":links[i].REF, 
		"alt":links[i].ALT, "gene":links[i].GENE, "gi":links[i].GI, "mut":links[i].MUTATION, "score":links[i].SCORE, "KG":links[i].KG})
		console.log(data[i])
	
	}
});
}
