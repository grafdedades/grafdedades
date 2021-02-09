function colours() {
  return {"2017" : "#E57373", "2018" : "#66BB6A", "2019" : "#42A5F5",
          "2020" : "#FFFF99"};
};

function getNames(nodes){
  names = [];
  nodes.forEach(function (node) {
    names.push(node.label)
  });
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
