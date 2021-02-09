function createNetwork(json) {
  // Map of node info throw its label
  var nodeHash = {};
  // Lists of nodes and edges (only important info for the network construction)
  var nodes = [];
  var edges = [];
  var max_degree = [];

  json.nodes.forEach(function (node) {
    nodeHash[node.label] = node.id;
    nodes.push({id: node.id, label: node.label, year: node.year, edges: node.edges, gender: node.gender, cfis: node.cfis});
  });

  json.edges.forEach(function (edge) {
    edges.push({source: nodeHash[edge.source], target: nodeHash[edge.target], weight: edge.weight, place: edge.place, month: edge.month, year: edge.year, repeated: edge.repeated, relationship: edge.relationship, comments: edge.comments});
    increaseDegree(edge, nodes, edges, max_degree);
  });
  createForceNetwork(nodes, edges);

}

function createForceNetwork(nodes, edges) {

  //create a network from an edgelist
  var colors = {"2020": "#BB8FCE" , "2019" : "#42A5F5", "2018" : "#66BB6A" , "2017" : "#E57373"};

  var names = getNames(nodes);

  var force = d3.layout.force().nodes(nodes).links(edges)
  .size([1000,1000])
  .charge(-200)
  .linkDistance(80)
  .on("tick", updateNetwork)



  d3.select("svg").selectAll("line")
  .data(edges)
  .enter()
  .append("line")
  .on("click", edgeClick)
  .style("stroke-width", function (d) {return d.weight})
  .style("stroke", "#000000")

  var nodeEnter = d3.select("svg").selectAll("g.node")
  .data(nodes)
  .enter()
  .append("g")
  .attr("class", "node")
  .on("click", nodeinfo)
  .on("dblclick", nodeDoubleClick)
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

var max = nodes[1];

  nodeEnter.append("circle")
  .attr("r", function (d) {
    if (d == max){
      return 15
    }else{
      return 10
    }
          })
  .style('fill', function(d) {
    return colors[d.year];
  })
  .style("stroke", "black")
  .style("opacity", "1");



  nodeEnter.filter(function (p) {return p == max}).append('text')
    .attr("class", "fa")  // Give it the font-awesome class
    .style("font-size", "18px")
    .style("text-anchor", "middle")
    .attr("y", 6)
    .text("\uf005");

  nodeEnter.append("text")
   .style("text-anchor", "middle")
   .attr("y", 20)
   .style("font-size", "10px")
   .text(function (d) {return d.label})
   .style("pointer-events", "none")


  force.start();



  function SearchNode() {
      var name = document.getElementById("search_bar").value
      var node = null
      nodes.forEach(function (n) {
        if(n.label == name){
            node = n
        }
      })

      if(node != null){
          nodeinfo(node)
          nodeF(node);
      }
    }

    var YearSet = new Set();

        function y2017(){
          YearFilter(2017,YearSet)
        }
        function y2018(){
          YearFilter(2018,YearSet)
        }
        function y2019(){
          YearFilter(2019,YearSet)
        }
        function y2020(){
          YearFilter(2020,YearSet)
        }
        function y2021(){
          YearFilter(2021,YearSet)
        }

        function YearFilter(year,YearSet){
            reset()
            //Actualizar el conjunto de años
            if(YearSet.has(year)){
                YearSet.delete(year)
            }
            else{
                YearSet.add(year)
            }
            console.log(YearSet,YearSet.size)

            if(YearSet.size == 0){
                filteredEdges = edges
            }
            else{
                var egoIDs = [];
                var filteredEdges = edges.filter(function (p) {return YearSet.has(p.year)});
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
        }

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
    .style("font-size", "10px")
    .attr("y", 20)
    .text(function (d) {return d.label})

    nodeEnter.filter(function (p) {return p == max}).select('text')
      .attr("class", "fa")  // Give it the font-awesome class
      .style("text-anchor", "middle")
      .attr("y", 6)
      .style("font-size", "18px")
      .text("\uf005");
  }

  function nodeDoubleClick(d) {
    d.fixed = false;
  }
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
  function edgeClick(e) {
       force.stop();
       e.fixed = true;
       recuadro(e);
       edgeF(e);
  };

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
  autocomplete(document.getElementById("search_bar"), names);
}
