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
