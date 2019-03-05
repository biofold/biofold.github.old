var main = function () {
console.log("gene: " + $('#diseaseSelection').val())

d3.tsv("resources/list_cancer_genepairs.tsv", function(geneLink) {


d3.tsv("resources/list_cancer_triplegenes.tsv", function(links) {

var disease = $('#diseaseSelection').val()
var reactome = $('#reactomeSelection').is(':checked')
var geneList = $("#geneTxt").val().split(", ")

console.log(reactome)

//Filter data
function filterLinks (a) {
    if (reactome){
    	return  ( a.target == disease) ;
    }
    else {
	    return ( a.target == disease && a.type == "Pathway" )
    }
  }
    
links = links.filter(filterLinks)

console.log(links.length)


var getAllGenes = function (){
	var genes = {}
        for (var i = 0;  i < geneLink.length; i++){
        var x=geneLink[i]
	genes[x.target]=1
	genes[x.source]=1
	}
	return genes

}


allgenes = getAllGenes() 

var diseaseNodes = {};
var selNodes = {};
for (var j = 0 ; j<links.length; j++){
    diseaseNodes[links[j].source]=links[j].type
    selNodes[links[j].source]=links[j].type
  }

if (geneList!=""){
	selNodes={}
  	for (var j = 0 ; j<geneList.length; j++){
	if (allgenes[geneList[j]]) {
	  	if (! diseaseNodes[geneList[j]]) {
			selNodes[geneList[j]]="Selected"
		}
		else {
			selNodes[geneList[j]]="Pathway"
		}
	}
	else {
	console.log("WARNING: Gene "+geneList[j]+" not in the gene list")
}
  }
}

console.log(Object.keys(selNodes).length)

var filterGenes = function(){
  var edges=[] 
    for (var key in selNodes){
	edges.push({'target': key,
		   'source': key,
		   'type': "physical-association"
		  })
	}
    for (var i = 0;  i < geneLink.length; i++){
      var x=geneLink[i]
      if (selNodes[x.source] && selNodes[x.target]) {
	edges.push(x)
	}
    }
  return edges
}



links = filterGenes()
// console.log(links.length)


/*
var w = [];
for (var y in links){
for (var x in geneLink) {
  if (x.target == y.source){
    w.push(links[y])
  }
}
}
*/
var nodes = {};

// Compute the distinct nodes from the links.
links.forEach(function(link) {
  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, type: link.type});
  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, type: link.type});
  //link.type = nodes[link.type] || (nodes[link.source] = {type: link.type});
});

var width = 800,
    height = 600;
//color scale for groups

// var color = d3.scale.category10();

var color = {
	"Pathway": "#d62728",
	"Selected": "#3182bd",
	"Reactome": "#98df8a", 
	"physical-association": "#7f7f7f",
	"association": "#fdae6b" }

var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(50)
    .charge(-20)
    .gravity(0.4)
    .on("tick", tick)
    .start();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var link = svg.selectAll(".link")
    .data(force.links())
  .enter().append("line")
    .attr("class", "link")
    .style("stroke", function (d){return color[d.type];});

var node = svg.selectAll(".node")
    .data(force.nodes())
  .enter().append("g")
    .attr("class", "node")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .call(force.drag);

node.append("circle")
    .attr("r", 4)
    .style("fill", function (d){return color[selNodes[d.name]];});

node.append("title")
    .attr("x", 10)
    .attr("dy", ".35em")
    .text(function(d) { return d.name + " " + selNodes[d.name]; });

function tick() {
  link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function mouseover() {
  d3.select(this).select("circle").transition()
      .duration(750)
      .attr("r", 10);

}

function mouseout() {
  d3.select(this).select("circle").transition()
      .duration(750)
      .attr("r", 4)
}

 });

 });
//end of main()
}
