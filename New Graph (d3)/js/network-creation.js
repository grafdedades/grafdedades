
function createNetwork(json) {
  // Map of node info throw its label
  var nodeHash = {};
  // Lists of nodes and edges (only important info for the network construction)
  var nodes = [];
  var edges = [];

  json.nodes.forEach(function (node) {
    nodeHash[node.label] = node.id;
    nodes.push({id: node.id, label: node.label, year: node.year, edges: node.edges, gender: node.gender, cfis: node.cfis});
  });

  json.edges.forEach(function (edge) {
    edges.push({source: nodeHash[edge.source], target: nodeHash[edge.target], weight: edge.weight, place: edge.place, month: edge.month, year: edge.year, repeated: edge.repeated, relationship: edge.relationship, comments: edge.comments});
    ++nodes[nodeHash[edge.source]].edges;
    ++nodes[nodeHash[edge.target]].edges;
  });
  createForceNetwork(nodes, edges);

}

function createForceNetwork(nodes, edges) {

  var colors = colours();

  var names = getNames(nodes);

  var force = d3.layout.force().nodes(nodes).links(edges)
  .size([1000,1000])
  .charge(-200)
  .linkDistance(80)
  .on("tick", updateNetwork);

  d3.select("svg").selectAll("line")
  .data(edges)
  .enter()
  .append("line")
  .on("click", edgeClick)
  .style("stroke-width", function (d) {return d.weight})
  .style("stroke", "#000000");

  var nodeEnter = d3.select("svg").selectAll("g.node")
  .data(nodes)
  .enter()
  .append("g")
  .attr("class", "node")
  .on("mouseover", nodeOver)
  .on("mouseout", reset)
  .call(force.drag());

  d3.select("#search_button")
  .on("click", SearchNode);

  d3.select("#but1")
    .on("click", y2017);

  d3.select("#but2")
    .on("click", y2018);

  d3.select("#but3")
    .on("click", y2019);

  d3.select("#but4")
    .on("click", y2020);

  d3.select("#but5")
    .on("click", y2021);


  nodeEnter.append("circle")
  .attr("r", 10)
  .style('fill', function(d) {return colors[d.year];})
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

  // NODE INTERACTION FUNCTIONS

  function nodeOver(d) {
    force.stop();
    nodeF(d);
  }

  function nodeF(d) {
    var egoIDs = [];
    var filteredEdges = edges.filter(function (p) {return p.source == d || p.target == d});
    egoIDs.push(d.id)
    filteredEdges
    .forEach(function (p) {
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

  // SEARCH NODE FUNCTIONS

  function SearchNode() {
    var name = document.getElementById("search_bar").value;
    console.log(name);
    var node = null;
    nodes.forEach(function (n) {
      if(n.label == name){
          node = n
      }
    });

    if(node != null){
        nodeF(node);
    };
  };

  // YEAR FILTER FUNCTIONS

  function y2017(){
    YearFilter(2017)
  };

  function y2018(){
    YearFilter(2018)
  };

  function y2019(){
    YearFilter(2019)
  };

  function y2020(){
    YearFilter(2020)
  };

  function y2021(){
    YearFilter(2021)
  };

  function YearFilter(year){
    var egoIDs = [];
    var filteredEdges = edges.filter(function (p) {return p.year == year});
    filteredEdges.forEach(function (p) {
      egoIDs.push(p.target.id);
      egoIDs.push(p.source.id);
    });

    reset();

    d3.selectAll("line").filter(function (p) {return filteredEdges.indexOf(p) == -1})
    .style("opacity", "0.3")
    .style("stroke-width", "1")

    d3.selectAll("text").filter(function (p) {return egoIDs.indexOf(p.id) == -1})
    .style("opacity", "0")

    d3.selectAll("circle").filter(function (p) {return egoIDs.indexOf(p.id) == -1})
    .style("fill", "#66CCCC")
    .style("opacity", "0.3");
  }

  // GENERAL FUNCTIONS
  
  function reset() {
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
