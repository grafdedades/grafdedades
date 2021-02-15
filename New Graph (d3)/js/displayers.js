// Display edge infos
function edgeinfo(e) {
  d3.select("#div1").transition()
    .duration(200)
    .style("opacity", .9);
  var edge_info = "<h5 class=\"text-white card-title\" style=\"margin-bottom:0;\">" + e.source.label + " i " + e.target.label + "</h5>";
  edge_info += "<p class=\"text-white card-text\">"
  if (e.place !== "") {
    edge_info += "<b>Lloc: </b>" + e.place + "<br/>";
  }
  if (e.year !== "" || e.month != ""){
    edge_info += "<b>Data: </b>" + e.month + (e.month === "" ? "" : " ") + e.year + "<br/>";
  }
  if (e.comments !== "") edge_info += "<b>Comentaris: </b>" + e.comments + "<br/>";
  edge_info += "<b>Pes: </b>" + e.weight + "<br/>";
  edge_info += "<b>Han repetit?: </b>" + e.repeated + "<br/>";
  edge_info += "<p/>"

  d3.select("#div1").html(edge_info)
  d3.select("#div2").style("opacity", 0);
};

// Display info about node
function nodeinfo(e){
    d3.select("#div2").transition()
        .duration(200)
        .style("opacity", .9);
      var node_info = "<h5 class=\"text-white card-title\" style=\"margin-bottom:0;\">" + e.label +"</h5>";
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
  if(val == "not_choosen"){
    document.getElementById("no_choose").style.display="block";
    document.getElementById("rank_p").style.display="none";
    document.getElementById("rank_a").style.display="none";
    document.getElementById("rank_m").style.display="none";
  }
  if(val == "ranking_p"){
    document.getElementById("no_choose").style.display="none";
    document.getElementById("rank_p").style.display="block";
    document.getElementById("rank_a").style.display="none";
    document.getElementById("rank_m").style.display="none";

        var rank1_p = "<b>1r: </b>" + nodes[pnt_rank_id[0]].label + " (" +  nodes[pnt_rank_id[0]].points + ") <br/>";
        var rank2_p = "<b>2n: </b>" + nodes[pnt_rank_id[1]].label + " (" +  nodes[pnt_rank_id[1]].points + ") <br/>";
        var rank3_p = "<b>3r: </b>" + nodes[pnt_rank_id[2]].label + " (" +  nodes[pnt_rank_id[2]].points + ") <br/>";
        var rank4_p = "<b>4t: </b>" + nodes[pnt_rank_id[3]].label + " (" +  nodes[pnt_rank_id[3]].points + ") <br/>";
        var rank5_p = "<b>5è: </b>" + nodes[pnt_rank_id[4]].label + " (" +  nodes[pnt_rank_id[4]].points + ") <br/>";
      console.log(rank1_p)
      d3.select("#rank_1_p").html(rank1_p)
      d3.select("#rank_2_p").html(rank2_p)
      d3.select("#rank_3_p").html(rank3_p)
      d3.select("#rank_4_p").html(rank4_p)
      d3.select("#rank_5_p").html(rank5_p)
  }
  if(val == "ranking_a"){
    document.getElementById("no_choose").style.display="none";
    document.getElementById("rank_p").style.display="none";
    document.getElementById("rank_a").style.display="block";
    document.getElementById("rank_m").style.display="none";

    var rank1_a = "<b>1r: </b>" + nodes[deg_rank_id[0]].label + " (" +  nodes[deg_rank_id[0]].degree + ")";
    var rank2_a = "<b>2n: </b>" + nodes[deg_rank_id[1]].label + " (" +  nodes[deg_rank_id[1]].degree + ") ";
    var rank3_a = "<b>3r: </b>" + nodes[deg_rank_id[2]].label + " (" +  nodes[deg_rank_id[2]].degree + ") ";
    var rank4_a = "<b>4t: </b>" + nodes[deg_rank_id[3]].label + " (" +  nodes[deg_rank_id[3]].degree + ") ";
    var rank5_a = "<b>5è: </b>" + nodes[deg_rank_id[4]].label + " (" +  nodes[deg_rank_id[4]].degree + ") ";

  d3.select("#rank_1_a").html(rank1_a)
  d3.select("#rank_2_a").html(rank2_a)
  d3.select("#rank_3_a").html(rank3_a)
  d3.select("#rank_4_a").html(rank4_a)
  d3.select("#rank_5_a").html(rank5_a)
  }
  if(val == "ranking_m"){
    document.getElementById("no_choose").style.display="none";
    document.getElementById("rank_p").style.display="none";
    document.getElementById("rank_m").style.display="block";
    document.getElementById("rank_a").style.display="none";

    var rank1_m = "<b>1r: </b>" + nodes[avg_rank_id[0]].label + " (" +  nodes[avg_rank_id[0]].average + ")";
    var rank2_m = "<b>2n: </b>" + nodes[avg_rank_id[1]].label + " (" +  nodes[avg_rank_id[1]].average + ") ";
    var rank3_m = "<b>3r: </b>" + nodes[avg_rank_id[2]].label + " (" +  nodes[avg_rank_id[2]].average + ") ";
    var rank4_m = "<b>4t: </b>" + nodes[avg_rank_id[3]].label + " (" +  nodes[avg_rank_id[3]].average + ") ";
    var rank5_m = "<b>5è: </b>" + nodes[avg_rank_id[4]].label + " (" +  nodes[avg_rank_id[4]].average + ") ";

  d3.select("#rank_1_m").html(rank1_m)
  d3.select("#rank_2_m").html(rank2_m)
  d3.select("#rank_3_m").html(rank3_m)
  d3.select("#rank_4_m").html(rank4_m)
  d3.select("#rank_5_m").html(rank5_m)
  }
}
