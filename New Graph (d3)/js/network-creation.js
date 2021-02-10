// Creation lists nodes and edges

function createNetwork(json) {

  json.nodes.forEach(function (node) {
    nodeHash[node.label] = node.id;
    nodes.push({id: node.id, label: node.label, year: node.year, gender: node.gender, cfis: node.cfis});
  });

  json.edges.forEach(function (edge) {
    edges.push({source: nodeHash[edge.source], target: nodeHash[edge.target], weight: edge.weight, place: edge.place, month: edge.month, year: edge.year, repeated: edge.repeated, relationship: edge.relationship, comments: edge.comments});
    newEdge(edge);
  });
  createForceNetwork(nodes, edges);

}

//create a network from an edgelist and nodelist and print it in a svg

function createForceNetwork(nodes, edges) {
  
  var  names = [];
  nodes.forEach(function (node) {
    names.push(node.label)
  });

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
    .style("stroke", function (d) {
      if(d.relationship == "FALSE"){
        return "#000000"
      }else{
        return "#E74C3C"
      }
    })

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


  nodeEnter.append("circle")
    .attr("r", function (d) {
      if (max_degree.includes(d)){
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



  nodeEnter.filter(function (p) {return max_degree.includes(p)}).append('text')
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


  // Search for a node (browser)

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

    // Select year from button
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

    // Highlight nodes and edges from a year
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

  // Print the graph as original

  function reset() {
    force.start();
    d3.selectAll("circle")
    .style('fill', function(d) {
      return colors[d.year];
    })
    .style("opacity", "1");

    d3.selectAll("line")
    .style("stroke-width", function (d) {return d.weight})
    .style("opacity", "1")
    .style("stroke", function (d) {
      if(d.relationship == "FALSE"){
        return "#000000"
      }else{
        return "#E74C3C"
      }
    });


    d3.selectAll("text")
    .style("text-anchor", "middle")
    .style("opacity", "1")
    .style("font-size", "10px")
    .attr("y", 20)
    .text(function (d) {return d.label})

    nodeEnter.filter(function (p) {return max_degree.includes(p)}).select('text')
      .attr("class", "fa")  // Give it the font-awesome class
      .style("text-anchor", "middle")
      .attr("y", 6)
      .style("font-size", "18px")
      .text("\uf005");
  }

  // Action in doubleclick
  function nodeDoubleClick(d) {
    d.fixed = false;
  }

  // Auxiliary function to nodeF
  function nodeOver(d) {
    force.stop();
    nodeF(d);
  }

  // Highlight edges from node
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

  // Action on click edge
  function edgeClick(e) {
       force.stop();
       e.fixed = true;
       recuadro(e);
       edgeF(e);
  };

  //Highlight edge
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

  // Move nodes
  function updateNetwork() {
    d3.select("svg").selectAll("line")
    .attr("x1", function (d) {return d.source.x})
    .attr("y1", function (d) {return d.source.y})
    .attr("x2", function (d) {return d.target.x})
    .attr("y2", function (d) {return d.target.y});

    d3.select("svg").selectAll("g.node")
      .attr("transform", function (d) {return "translate(" + d.x + "," + d.y + ")"});

  }
  console.log(names)
  autocomplete(document.getElementById("search_bar"), names);
}
