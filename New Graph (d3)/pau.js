function createNetwork(json) {
  // Map of node info throw its label
  var nodeHash = {};
  // Lists of nodes and edges (only important info for the network construction)
  var nodes = [];
  var edges = [];

  json.nodes.forEach(function (node) {
    nodeHash[node.label] = node.id;
    nodes.push({id: node.id, label: node.label, year: node.year,
                edges: node.edges, gender: node.gender, cfis: node.cfis});
  });

  json.edges.forEach(function (edge) {
    edges.push({source: nodeHash[edge.source], target: nodeHash[edge.target],
                weight: edge.weight, place: edge.place, month: edge.month,
                year: edge.year, repeated: edge.repeated,
                relationship: edge.relationship, comments: edge.comments});
    ++nodes[nodeHash[edge.source]].edges;
    ++nodes[nodeHash[edge.target]].edges;
  });
  createForceNetwork(nodes, edges);
}

function createForceNetwork(nodes, edges) {

  var colors = {"2017" : "#E57373", "2018" : "#66BB6A", "2019" : "#42A5F5",
                "2020" : "#FFFF99", "2021" : "#996666", "2022" : "#66CCCC",
                "2023" : "#CC9999", "2024" : "#666633", "2025" : "#993300",
                "2026" : "#999966", "2027" : "#660000", "2028" : "#996699",
                "2029" : "#cc6633", "2030" : "#ff9966", "2031" : "#339999",
                "2032" : "#6699cc", "2033" : "#ffcc66", "UNKN" : "#ff6600"};

  var force = d3.layout.force().nodes(nodes).links(edges)
  .size([1000,1000])
  .charge(-200)
  .linkDistance(80)
  .on("tick", updateNetwork);

  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var but1 = d3.select("body").append("button")
      .attr("class", "button button1")
      .attr("id", "but1")
      .html("2017")
      .style("opacity", 1);

  var but2 = d3.select("body").append("button")
      .attr("class", "button button2")
      .html("2018")
      .style("opacity", 1);

  var but3 = d3.select("body").append("button")
      .attr("class", "button button3")
      .html("2019")
      .style("opacity", 1);

  var search = d3.select("body").append("input")
    .attr("id","search_bar")
    .attr("class", "input1")
    .attr("placeholder", "¿Qué pecador buscas?")

  var search_button = d3.select("body").append("button")
    .attr("type","button")
    .attr("class", "button button_s")
    .attr("id","search_button")
    .text("Search")

  d3.select("svg").selectAll("line")
  .data(edges)
  .enter()
  .append("line")
  .on("click", function(e) {
            e.fixed = true;
            div.transition()
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

            div.html(edge_info)

            edgeClick(e);
          })

  .on("mouseout", function(e) {
            if (e.fixed){
              nodeOut();
              e.fixed = false
            }
        })
  .style("stroke-width", function (d) {return d.weight})
  .style("stroke", "#000000");

  var nodeEnter = d3.select("svg").selectAll("g.node")
  .data(nodes)
  .enter()
  .append("g")
  .attr("class", "node")
  .on("click", nodeClick)
  .on("mouseout", function(d) {
            if (d.fixed){
              nodeOut();
              d.fixed = false
            }
        })
  .call(force.drag());

  d3.select("#search_button")
  .on("click", SearchNode);

  d3.select("#but1")
  .on("click", YearFilter);

  nodeEnter.append("circle")
  .attr("r", 10)
  .style('fill', function(d) {
    return colors[d.year];
  })
  .style("stroke", "black")
  .style("opacity", "1");

  nodeEnter.append("text")
   .style("text-anchor", "middle")
   .attr("y", 20)
   .style("stroke-width", "1px")
   .style("stroke-opacity", 0.75)
   .style("stroke", "white")
   .style("font-size", "10px")
   .text(function (d) {return d.label})
   .style("pointer-events", "none")

   nodeEnter.append("text")
   .style("text-anchor", "middle")
   .attr("y", 20)
   .style("font-size", "10px")
    .style("opacity", "1")
   .text(function (d) {return d.label})
   .style("pointer-events", "none")

  force.start();

  function YearFilter(){
    var egoIDs = [];
    var filteredEdges = edges.filter(function (p) {return p.year == 2020});
    filteredEdges.forEach(function (p) {
      egoIDs.push(p.target.id);
      egoIDs.push(p.source.id);
    });

    d3.selectAll("line").filter(function (p) {return filteredEdges.indexOf(p) == -1})
    .style("opacity", "0.3")
    .style("stroke-width", "1")

    d3.selectAll("text").filter(function (p) {return egoIDs.indexOf(p.id) == -1})
    .style("opacity", "0")

    d3.selectAll("circle").filter(function (p) {return egoIDs.indexOf(p.id) == -1})
    .style("fill", "#66CCCC")
    .style("opacity", "0.3");
  }

  function SearchNode() {
      var name = document.getElementById("search_bar").value
      console.log(name)
      var node = null
      nodes.forEach(function (n) {
        if(n.label == name){
            node = n
        }
      })

      if(node != null){
          nodeF(node);
      }
    }

  function nodeOut() {
    force.start();
    d3.selectAll("circle")
    .style('fill', function(d) {
      return colors[d.year];
    })
    .style("opacity", "1");

    d3.selectAll("line")
    .style("stroke", "#000000")
    .style("stroke-width", function (d) {return d.weight})
    .style("opacity", "1")

    d3.selectAll("text")
    .style("text-anchor", "middle")
    .style("opacity", "1")
    .attr("y", 20)
    .text(function (d) {return d.label})
  }
  function nodeClick(d) {
    force.stop();
    d.fixed = true;
    nodeF(d);
  }
  function edgeClick(e) {
    force.stop();
    e.fixed = true;
    edgeF(e);
  }

  function nodeF(d) {
    var egoIDs = [];
    var filteredEdges = edges.filter(function (p) {return p.source == d || p.target == d});
    egoIDs.push(d.id)
    filteredEdges.forEach(function (p) {
      if (p.source == d) {
        egoIDs.push(p.target.id)
      }
      else {
        egoIDs.push(p.source.id)
      }
    });

    d3.selectAll("line").filter(function (p) {return filteredEdges.indexOf(p) == -1})
    .style("opacity", "0.3")
    .style("stroke-width", "1")

    d3.selectAll("text").filter(function (p) {return egoIDs.indexOf(p.id) == -1})
    .style("opacity", "0")

    d3.selectAll("circle").filter(function (p) {return egoIDs.indexOf(p.id) == -1})
    .style("fill", "#66CCCC")
    .style("opacity", "0.3");

  }

  function edgeF(e) {
    var egoIDs = [];
    var filteredEdges = edges.filter(function (p) {return p == e});
    filteredEdges.forEach(function (p) {
      if (p == e) {
        egoIDs.push(p.target.id)
        egoIDs.push(p.source.id)
      }
    });

    d3.selectAll("line").filter(function (p) {return filteredEdges.indexOf(p) == -1})
    .style("opacity", "0.3")
    .style("stroke-width", "1")

    d3.selectAll("text").filter(function (p) {return egoIDs.indexOf(p.id) == -1})
    .style("opacity", "0")

    d3.selectAll("circle").filter(function (p) {return egoIDs.indexOf(p.id) == -1})
    .style("fill", "#66CCCC")
    .style("opacity", "0.3");

  }



  function updateNetwork() {
    d3.select("svg").selectAll("line")
    .attr("x1", function (d) {return d.source.x})
    .attr("y1", function (d) {return d.source.y})
    .attr("x2", function (d) {return d.target.x})
    .attr("y2", function (d) {return d.target.y});

    d3.select("svg").selectAll("g.node")
      .attr("transform", function (d) {return "translate(" + d.x + "," + d.y + ")"});

  }
}
