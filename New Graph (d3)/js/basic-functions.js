function colours() {
  return {"2017" : "#E57373", "2018" : "#66BB6A", "2019" : "#42A5F5",
          "2020" : "#FFFF99"};
};

function getNames(nodes){
  var  names = [];
  nodes.forEach(function (node) {
    names.push(node.label)
  });
  return names;
};

function recuadro(e) {
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
  d3.select("#div2").style("opacity", 0);
};

function increaseDegree(edge, nodes, max_degree, nodeHash){

  if (max_degree.length === 0) {
    ++nodes[nodeHash[edge.source]].edges;
    ++nodes[nodeHash[edge.target]].edges;

    if (nodes[nodeHash[edge.source]].edges > nodes[nodeHash[edge.target]].edges){
      max_degree = [nodeHash[edge.source]];
    } else if (++nodes[nodeHash[edge.source]].edges === nodes[nodeHash[edge.target]].edges){
      max_degree = [nodeHash[edge.source], nodeHash[edge.target]];
    } else {
      max_degree = [nodeHash[edge.target]];
    }
  } else {
    var newEdges = [edge.source, edge.target];
    for (i in newEdges){
      if (++nodes[nodeHash[newEdges[i]]].edges > nodes[max_degree[0]].edges) max_degree = [nodeHash[edge]];
      else if (++nodes[nodeHash[newEdges[i]]].edges === nodes[max_degree[0]].edges) max_degree.push(nodeHash[edge]);
    }
  }
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
      d3.select("#div1").style("opacity", 0);
}
