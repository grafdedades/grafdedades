var colors = {"2017" : "#E57373", "2018" : "#66BB6A", "2019" : "#42A5F5",
              "2020" : "#FFFF99", "2021" : "#CC9999", "2022" : "#666633",
              "2023" : "#993300", "2024" : "#999966", "OTHER": "#660000"};


// Map of node info throw its label
var nodeHash = {};



var YearSet = new Set();

// Lists of nodes and edges (only important info for the network construction)
var nodes = [];
var edges = [];

var names = [];
nodes.forEach(function (node) {
  names.push(node.label)
});

var max_degree = [];

function increaseDegree(edge){
  var source = nodes[nodeHash[edge.source]];
  var target = nodes[nodeHash[edge.target]];
  ++nodes[source.id].edges;
  ++nodes[target.id].edges;

  if (max_degree.length == 0) {

    if (nodes[source.id].edges > nodes[target.id].edges){
      max_degree = [nodes[source.id]];
    } else if (++nodes[source.id].edges === nodes[target.id].edges){
      max_degree = [nodes[source.id], nodes[target.id]];
    } else {
      max_degree = [nodes[target.id]];
    }

  } else {
    var newNodesId = [source, target];
    newNodesId.forEach(function(n){
      if (n.edges > nodes[max_degree[0].id].edges) max_degree = [n];
      else if (n.edges === nodes[max_degree[0].id].edges && !max_degree.includes(n)) max_degree.push(n);
    });
  }
};

function edgeClick(e) {
  d3.select("#div1").transition()
    .duration(200)
    .style("opacity", .9);
  var edge_info = "<p><b><u>" + e.source.label + " & " + e.target.label + "</u></b><br/>";
  if (e.place !== "") {
    edge_info += "<b>Place: </b>" + e.place + "<br/>";
  }
  if (e.year !== "" || e.month != ""){
    edge_info += "<b>Date: </b>" + e.month + (e.month === "" ? "" : " ") + e.year + "<br/>";
  }
  if (e.comments !== "") edge_info += "<b>Comments: </b>" + e.comments;
  edge_info += "</p>"

  d3.select("#div1").html(edge_info)
};

function nodeinfo(e){
    d3.select("#div2").transition()
        .duration(200)
        .style("opacity", .9);
      var node_info = "<p><b><u>" + e.label +"</u></b><br/>";
        node_info += "<b>Gender: </b>" + e.gender + "<br/>";
        node_info += "<b>Year: </b>" + e.year + "<br/>";
        node_info += "<b>Cfis: </b>" + e.cfis + "<br/>";
        node_info += "<b>Edges: </b>" + e.edges + "<br/>";
        node_info += "</p>"
      d3.select("#div2").html(node_info)
}
