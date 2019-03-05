function drawTable () {

document.getElementById('score').addEventListener('change', readTable(3), false);

function readTable(th) {
// Read ContrastRank OutputTable

if (!th) 
	{
	th = 3
}
else {
	th = parseFloat(th)
}


console.log ("Read ContrastRank Output")

d3.tsv("tcga.tsv", function(links) {

columns = [
	    { "title": "gene"},
	    { "title": "gi"},
	    { "title": "mutation"},
            { "title": "chr" },
            { "title": "position" },
            { "title": "rsid" },
            { "title": "ref/alt"},
	    { "title": "score"},
        ];


var getData = function (th) {
	var data_table = []
	var score = 0.0
	var c = 0
	for (var i = 0; i <links.length; i++){
		if (links[i].SCORE>=th) {
		data_table.push([links[i].GENE,links[i].GI,links[i].MUTATION,links[i].CHR,links[i].POSITION,links[i].RSID, 
		links[i].REF+"/"+links[i].ALT, links[i].SCORE]);
		score = score + parseFloat(links[i].SCORE);
		}
		c ++
        }
	if (c>0) {score = score /c;}
	console.log('Threshold= '+th+" Score= "+score)
	return score, data_table
}

var score, data_table = getData(th)


$(document).ready(function() {
$("#example").dataTable(
		{"data" : data_table, 
		"columns" :  columns,
		"order": [[ 7, "desc" ]],
	        "lengthMenu": [[10, 25, 50, 100, -1],
                        [10, 25, 50, 100, "All"]]
		});
	});
});

}


}
