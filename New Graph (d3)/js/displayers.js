// Display edge info
function edgeinfo(e) {
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

// Display menu
function menu(val){
  if(val == "legend"){
    document.getElementById("legend_but").style.display="block";
    document.getElementById("legend_but2").style.display="none";
    document.getElementById("legend_but3").style.display="none";
  }
  if(val == "ranking_p"){
    document.getElementById("legend_but").style.display="none";
    document.getElementById("legend_but3").style.display="none";
    document.getElementById("legend_but2").style.display="block";
        var rankp_info = "<b>1r: </b>" + nodes[pnt_rank_id[0]].label + " (" +  nodes[pnt_rank_id[0]].points + ") <br/>";
        rankp_info += "<b>2n: </b>" + nodes[pnt_rank_id[1]].label + " (" +  nodes[pnt_rank_id[1]].points + ") <br/>";
        rankp_info += "<b>3r: </b>" + nodes[pnt_rank_id[2]].label + " (" +  nodes[pnt_rank_id[2]].points + ") <br/>";
        rankp_info += "<b>4t: </b>" + nodes[pnt_rank_id[3]].label + " (" +  nodes[pnt_rank_id[3]].points + ") <br/>";
        rankp_info += "<b>5è: </b>" + nodes[pnt_rank_id[4]].label + " (" +  nodes[pnt_rank_id[4]].points + ") <br/>";
      d3.select("#legend_but2").html(rankp_info)

  }
  if(val == "ranking_a"){
    document.getElementById("legend_but").style.display="none";
    document.getElementById("legend_but2").style.display="none";
    document.getElementById("legend_but3").style.display="block";
    var rankd_info = "<b>1r: </b>" + nodes[deg_rank_id[0]].label + " (" +  nodes[deg_rank_id[0]].degree + ") <br/>";
    rankd_info += "<b>2n: </b>" + nodes[deg_rank_id[1]].label + " (" +  nodes[deg_rank_id[1]].degree + ") <br/>";
    rankd_info += "<b>3r: </b>" + nodes[deg_rank_id[2]].label + " (" +  nodes[deg_rank_id[2]].degree + ") <br/>";
    rankd_info += "<b>4t: </b>" + nodes[deg_rank_id[3]].label + " (" +  nodes[deg_rank_id[3]].degree + ") <br/>";
    rankd_info += "<b>5è: </b>" + nodes[deg_rank_id[4]].label + " (" +  nodes[deg_rank_id[4]].degree + ") <br/>";
  d3.select("#legend_but3").html(rankd_info)
  }
}
