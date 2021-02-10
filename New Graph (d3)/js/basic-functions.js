var colors = {"2017" : "#E57373", "2018" : "#66BB6A", "2019" : "#42A5F5",
              "2020" : "#FFFF99", "2021" : "#CC9999", "2022" : "#666633",
              "2023" : "#993300", "2024" : "#999966", "OTHER": "#660000"};


function createRankings(){
  var nodes_copy = [];
  nodes.forEach((n) => {
    nodes_copy.push({id : n.id, degree : n.degree, points : n.points, average : n.average})
  });
  pointsRanking(nodes_copy);
  degreeRanking(nodes_copy);
  averageRanking(nodes_copy);
}

// Display edge info
function recuadro(e) {
  d3.select("#div1").transition()
    .duration(200)
    .style("opacity", .9);
  var edge_info = "<b><u>" + e.source.label + " i " + e.target.label + "</u></b><br/>";
  if (e.place !== "") {
    edge_info += "<b>Lloc: </b>" + e.place + "<br/>";
  }
  if (e.year !== "" || e.month != ""){
    edge_info += "<b>Data: </b>" + e.month + (e.month === "" ? "" : " ") + e.year + "<br/>";
  }
  if (e.comments !== "") edge_info += "<b>Comentaris: </b>" + e.comments + "<br/>";
  edge_info += "<b>Pes: </b>" + e.weight + "<br/>";
  edge_info += "<b>Han repetit?: </b>" + e.repeated + "<br/>";


  d3.select("#div1").html(edge_info)
  d3.select("#div2").style("opacity", 0);
};

// Map of node info throw its label
var nodeHash = {};

// Lists of nodes and edges (only important info for the network construction)
var nodes = [];
var edges = [];

var max_degree = [];

// Creation edges
function newEdge(edge){
  var source   = nodes[nodeHash[edge.source]];
  var target   = nodes[nodeHash[edge.target]];

  increaseDegree(source, target);
  addPoints([source, target], edge.weight);
}

// Calculate metrics of edges
function addPoints(newNodes, points){
  newNodes.forEach(function(n){
    if ('points' in nodes[n.id]){
      nodes[n.id].points += points;
      nodes[n.id].average = Math.floor((nodes[n.id].points / nodes[n.id].degree)*100)/100;
    } else {
      nodes[n.id]['points']  = points;
      nodes[n.id]['average'] = nodes[n.id].points;
    }
  });
}

// Calculate degree nodes
function increaseDegree(source, target){

  var newNodes = [source, target];

  newNodes.forEach(function(n){
    if ('degree' in nodes[n.id]){
      ++nodes[n.id].degree;
    } else {
      nodes[n.id]['degree'] = 1;
    }
  });

  checkMaxDegree(source, target);
};

// Calculate max_degree
function checkMaxDegree(source, target){
  if (max_degree.length == 0) {

    if (nodes[source.id].degree > nodes[target.id].degree){
      max_degree = [nodes[source.id]];
    } else if (++nodes[source.id].degree === nodes[target.id].degree){
      max_degree = [nodes[source.id], nodes[target.id]];
    } else {
      max_degree = [nodes[target.id]];
    }

  } else {
    var newNodes = [source, target];
    newNodes.forEach(function(n){
      if (n.degree > nodes[max_degree[0].id].degree) max_degree = [n];
      else if (n.degree === nodes[max_degree[0].id].degree && !max_degree.includes(n)) max_degree.push(n);
    });
  }
}

// Display info about node
function nodeinfo(e){
    d3.select("#div2").transition()
        .duration(200)
        .style("opacity", .9);
      var node_info = "<b><u>" + e.label +"</u></b><br/>";
        node_info += "<b>Sexe: </b>" + e.gender + "<br/>";
        node_info += "<b>Any: </b>" + e.year + "<br/>";
        node_info += "<b>CFIS: </b>" + e.cfis + "<br/>";
        node_info += "<b>Arestes: </b>" + e.degree + "<br/>";
        node_info += "<b>Points: </b>" + e.points + "<br/>";
        node_info += "<b>Average: </b>" + e.average + "<br/>";
      d3.select("#div2").html(node_info)
      d3.select("#div1").style("opacity", 0);
}
