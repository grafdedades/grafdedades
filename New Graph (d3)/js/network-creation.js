// Creation lists nodes and edges

function createNetwork(json) {

  json.nodes.forEach(function(node) {
    nodeHash[node.label] = node.id;
    nodes.push({
      id: node.id,
      label: node.label,
      year: node.year,
      gender: node.gender,
      cfis: node.cfis
    });
  });

  json.edges.forEach(function(edge) {
    edges.push({
      source: nodeHash[edge.source],
      target: nodeHash[edge.target],
      weight: edge.weight,
      place: edge.place,
      month: edge.month,
      year: edge.year,
      repeated: edge.repeated,
      relationship: edge.relationship,
      comments: edge.comments
    });
    newEdge(edge);
  });
  createRankings();
  createForceNetwork(nodes, edges);

}




//create a network from an edgelist and nodelist and print it in a svg

function createForceNetwork(nodes, edges) {

  var names = [];
  nodes.forEach(function(node) {
    names.push(node.label)
  });

  var force = d3.layout.force().nodes(nodes).links(edges)
    .size([1000, 1000])
    .charge(-200)
    .linkDistance(80)
    .on("tick", updateNetwork)



  d3.select("svg").selectAll("line")
    .data(edges)
    .enter()
    .append("line")
    .on("click", edgeClick)
    .style("stroke-width", function(d) {
      return d.weight
    })
    .style("stroke", function(d) {
      if (d.relationship == "FALSE") {
        return color_t
      } else {
        return "#E74C3C"
      }
    })

  var nodeEnter = d3.select("svg").selectAll("g.node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .on("click", nodeclick)
    .on("dblclick", nodeDoubleClick)
    .call(force.drag());

  d3.select("#search_button")
    .on("click", SearchNode);

  d3.select("#e2018")
    .on("click", y2018);
  d3.select("#e2019")
    .on("click", y2019);
  d3.select("#e2020")
    .on("click", y2020);
  d3.select("#e2021")
    .on("click", y2021);
  d3.select("#n2017")
    .on("click", node2017);
  d3.select("#n2018")
    .on("click", node2018);
  d3.select("#n2019")
    .on("click", node2019);
  d3.select("#n2020")
    .on("click", node2020);
  d3.select("#rank_1_a")
    .on("click", rank1_a);
  d3.select("#rank_2_a")
    .on("click", rank2_a);
  d3.select("#rank_3_a")
    .on("click", rank3_a);
  d3.select("#rank_4_a")
    .on("click", rank4_a);
  d3.select("#rank_5_a")
    .on("click", rank5_a);

  d3.select("#rank_1_p")
    .on("click", rank1_p);
  d3.select("#rank_2_p")
    .on("click", rank2_p);
  d3.select("#rank_3_p")
    .on("click", rank3_p);
  d3.select("#rank_4_p")
    .on("click", rank4_p);
  d3.select("#rank_5_p")
    .on("click", rank5_p);
  d3.select("#switch-label")
    .on("click", Darkmode);

    d3.select("#rank_1_m")
      .on("click", rank1_m);
    d3.select("#rank_2_m")
      .on("click", rank2_m);
    d3.select("#rank_3_m")
      .on("click", rank3_m);
    d3.select("#rank_4_m")
      .on("click", rank4_m);
    d3.select("#rank_5_m")
      .on("click", rank5_m);
    d3.select("#switch-label")
      .on("click", Darkmode);



  nodeEnter.append("circle")
    .attr("r", function(d) {
      if (max_degree.includes(d)) {
        return 15
      } else {
        return 10
      }
    })
    .style('fill', function(d) {
      return colors[d.year];
    })
    .style("stroke", color_n)
    .style("opacity", "1");



  nodeEnter.filter(function(p) {
      return max_degree.includes(p)
    }).append('text')
    .attr("class", "fa") // Give it the font-awesome class
    .style("font-size", "18px")
    .style("text-anchor", "middle")
    .attr("y", 6)
    .text("\uf005");

  nodeEnter.append("text")
    .style("text-anchor", "middle")
    .attr("y", 20)
    .style("font-size", "10px")
    .style("fill", color_t)
    .text(function(d) {
      return d.label
    })
    .style("pointer-events", "none")


  force.start();


  // Search for a node (browser)

  function SearchNode() {
    reset();
    var name = document.getElementById("search_bar").value

    var node = null
    nodes.forEach(function(n) {
      if (n.label == name) {
        node = n
      }
    })

    if (node != null) {
      nodeinfo(node)
      nodeF(node);
    }
  }

  function nodeclick(d){
    reset();
    nodeinfo(d);
    nodeF(d);

  }

  function Darkmode() {
     var element = document.body;
     element.classList.toggle("dark-mode");
     darkmode = !darkmode
     console.log(darkmode)
     if (darkmode){
       color_t = "#ffffff"
       color_n = "white"
     }else{
       color_t = "#000000"
       color_n = "black"
     }
     console.log(color_t);
     reset();

  }


  var YearSet = new Set();

  function rank1_a(){
    reset()
    d3.select("#rank_1_a")
    .style("opacity", 0.5)
    nodeF(nodes[deg_rank_id[0]])
    nodeinfo(nodes[deg_rank_id[0]])
  }
  function rank2_a(){
    reset()
    d3.select("#rank_2_a")
    .style("opacity", 0.5)
    nodeF(nodes[deg_rank_id[1]])
    nodeinfo(nodes[deg_rank_id[1]])
  }
  function rank3_a(){
    reset()
    d3.select("#rank_3_a")
    .style("opacity", 0.5)
    nodeF(nodes[deg_rank_id[2]])
    nodeinfo(nodes[deg_rank_id[2]])
  }
  function rank4_a(){
    reset()
    d3.select("#rank_4_a")
    .style("opacity", 0.5)
    nodeF(nodes[deg_rank_id[3]])
    nodeinfo(nodes[deg_rank_id[3]])
  }
  function rank5_a(){
    reset()
    d3.select("#rank_5_a")
    .style("opacity", 0.5)
    nodeF(nodes[deg_rank_id[4]])
    nodeinfo(nodes[deg_rank_id[4]])
  }

  function rank1_p(){
    reset()
    d3.select("#rank_1_p")
    .style("opacity", 0.5)
    nodeF(nodes[pnt_rank_id[0]])
    nodeinfo(nodes[pnt_rank_id[0]])
  }
  function rank2_p(){
    reset()
    d3.select("#rank_2_p")
    .style("opacity", 0.5)
    nodeF(nodes[pnt_rank_id[1]])
    nodeinfo(nodes[pnt_rank_id[1]])
  }
  function rank3_p(){
    reset()
    d3.select("#rank_3_p")
    .style("opacity", 0.5)
    nodeF(nodes[pnt_rank_id[2]])
    nodeinfo(nodes[pnt_rank_id[2]])
  }
  function rank4_p(){
    reset()
    d3.select("#rank_4_p")
    .style("opacity", 0.5)
    nodeF(nodes[pnt_rank_id[3]])
    nodeinfo(nodes[pnt_rank_id[3]])
  }
  function rank5_p(){
    reset()
    d3.select("#rank_5_p")
    .style("opacity", 0.5)
    nodeF(nodes[pnt_rank_id[4]])
    nodeinfo(nodes[pnt_rank_id[4]])
  }
  function rank1_m(){
    reset()
    d3.select("#rank_1_m")
    .style("opacity", 0.5)
    nodeF(nodes[avg_rank_id[0]])
    nodeinfo(nodes[avg_rank_id[0]])

  }
  function rank2_m(){
    reset()
    d3.select("#rank_2_m")
    .style("opacity", 0.5)
    nodeF(nodes[avg_rank_id[1]])
    nodeinfo(nodes[avg_rank_id[1]])
  }
  function rank3_m(){
    reset()
    d3.select("#rank_3_m")
    .style("opacity", 0.5)
    nodeF(nodes[avg_rank_id[2]])
    nodeinfo(nodes[avg_rank_id[2]])
  }
  function rank4_m(){
    reset()
    d3.select("#rank_4_m")
    .style("opacity", 0.5)
    nodeF(nodes[avg_rank_id[3]])
    nodeinfo(nodes[avg_rank_id[3]])
  }
  function rank5_m(){
    reset()
    d3.select("#rank_5_m")
    .style("opacity", 0.5)
    nodeF(nodes[avg_rank_id[4]])
    nodeinfo(nodes[avg_rank_id[4]])
  }
  // Select year from button
  function y2017() {
    YearFilter(2017, YearSet)
  }

  function y2018() {
    YearFilter(2018, YearSet)
  }

  function y2019() {
    YearFilter(2019, YearSet)
  }

  function y2020() {
    YearFilter(2020, YearSet)
  }

  function y2021() {
    YearFilter(2021, YearSet)
  }


  function node2017() {
    Nodes_YearFilter(2017)
  }

  function node2018() {
    Nodes_YearFilter(2018)
  }

  function node2019() {
    Nodes_YearFilter(2019)
  }

  function node2020() {
    Nodes_YearFilter(2020)
  }


  // Highlight nodes and edges from a year
  function YearFilter(year, YearSet) {
    reset()
    //Actualizar el conjunto de años
    if (YearSet.has(year)) {
      YearSet.delete(year)
    } else {
      YearSet.add(year)
    }
    console.log(YearSet, YearSet.size)

    if (YearSet.size == 0) {
      filteredEdges = edges
    } else {
      var egoIDs = [];
      var filteredEdges = edges.filter(function(p) {
        return YearSet.has(p.year)
      });
      filteredEdges.forEach(function(p) {
        egoIDs.push(p.target.id);
        egoIDs.push(p.source.id);
      });

      d3.selectAll("line").filter(function(p) {
          return filteredEdges.indexOf(p) == -1
        })
        .style("opacity", "0.3")
        .style("stroke-width", "1")

      d3.selectAll("text").filter(function(p) {
          return egoIDs.indexOf(p.id) == -1
        })
        .style("opacity", "0")

      d3.selectAll("circle").filter(function(p) {
          return egoIDs.indexOf(p.id) == -1
        })
        .style("fill", "#66CCCC")
        .style("opacity", "0.3");
    }
  }

  function Nodes_YearFilter(year) {
    reset()
    if (!unmark){
      return;
    }
    var egoIDs = [];
    var filteredEdges = edges.filter(function(p) {
      return p.source.year == year || p.target.year == year
    });
    filteredEdges.forEach(function(p) {
      if (p.target.year == year) {

        egoIDs.push(p.target.id);
      }
      if (p.source.year == year) {
        egoIDs.push(p.source.id);
      }
    });

    d3.selectAll("line").filter(function(p) {
        return filteredEdges.indexOf(p) == -1
      })
      .style("opacity", "0.3")
      .style("stroke-width", "1")

    d3.selectAll("text").filter(function(p) {
        return egoIDs.indexOf(p.id) == -1
      })
      .style("opacity", "0")

    d3.selectAll("circle").filter(function(p) {
        return egoIDs.indexOf(p.id) == -1
      })
      .style("fill", "#66CCCC")
      .style("opacity", "0.3");
  }



  // Print the graph as original

  function reset() {
    force.start();

    // unselectAllButtons();

    d3.select("#rank_1_p")
    .style("opacity", 1)
    d3.select("#rank_2_p")
    .style("opacity", 1)
    d3.select("#rank_3_p")
    .style("opacity", 1)
    d3.select("#rank_4_p")
    .style("opacity", 1)
    d3.select("#rank_5_p")
    .style("opacity", 1)

    d3.select("#rank_1_a")
    .style("opacity", 1)
    d3.select("#rank_2_a")
    .style("opacity", 1)
    d3.select("#rank_3_a")
    .style("opacity", 1)
    d3.select("#rank_4_a")
    .style("opacity", 1)
    d3.select("#rank_5_a")
    .style("opacity", 1)

    d3.select("#rank_1_m")
    .style("opacity", 1)
    d3.select("#rank_2_m")
    .style("opacity", 1)
    d3.select("#rank_3_m")
    .style("opacity", 1)
    d3.select("#rank_4_m")
    .style("opacity", 1)
    d3.select("#rank_5_m")
    .style("opacity", 1)



    d3.selectAll("circle")
      .style('fill', function(d) {
        return colors[d.year];
      })
      .style("opacity", "1")
      .style("stroke", color_n);

    d3.selectAll("line")
      .style("stroke-width", function(d) {
        return d.weight
      })
      .style("opacity", "1")
      .style("stroke", function(d) {
        if (d.relationship == "FALSE") {
          return color_t
        } else {
          return "#E74C3C"
        }
      });


    d3.selectAll("text")
      .style("text-anchor", "middle")
      .style("opacity", "1")
      .style("font-size", "10px")
      .style("fill", color_t)
      .attr("y", 20)
      .text(function(d) {
        return d.label
      })

    nodeEnter.filter(function(p) {
        return max_degree.includes(p)
      }).select('text')
      .attr("class", "fa") // Give it the font-awesome class
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
    var filteredEdges = edges.filter(function(p) {
      return p.source == d || p.target == d
    });
    egoIDs.push(d.id)
    filteredEdges
      .forEach(function(p) {
        if (p.source == d) {
          egoIDs.push(p.target.id)
        } else {
          egoIDs.push(p.source.id)
        }
      });
    d3.selectAll("line").filter(function(p) {
        return filteredEdges.indexOf(p) == -1
      })
      .style("opacity", "0.3")
      .style("stroke-width", "1")

    d3.selectAll("text").filter(function(p) {
        return egoIDs.indexOf(p.id) == -1
      })
      .style("opacity", "0")

    d3.selectAll("circle").filter(function(p) {
        return egoIDs.indexOf(p.id) == -1
      })
      .style("fill", "#66CCCC")
      .style("opacity", "0.3");

  }

  // Action on click edge
  function edgeClick(e) {
    force.stop();
    e.fixed = true;
    reset();
    edgeinfo(e);
    edgeF(e);
  };

  //Highlight edge
  function edgeF(e) {
    var egoIDs = [];
    var filteredEdges = edges.filter(function(p) {
      return p == e
    });
    filteredEdges.forEach(function(p) {
      if (p == e) {
        egoIDs.push(p.target.id)
        egoIDs.push(p.source.id)
      }
    });

    d3.selectAll("line").filter(function(p) {
        return filteredEdges.indexOf(p) == -1
      })
      .style("opacity", "0.3")
      .style("stroke-width", "1")

    d3.selectAll("text").filter(function(p) {
        return egoIDs.indexOf(p.id) == -1
      })
      .style("opacity", "0")

    d3.selectAll("circle").filter(function(p) {
        return egoIDs.indexOf(p.id) == -1
      })
      .style("fill", "#66CCCC")
      .style("opacity", "0.3");

  }

  // Move nodes
  function updateNetwork() {
    d3.select("svg").selectAll("line")
      .attr("x1", function(d) {
        return d.source.x
      })
      .attr("y1", function(d) {
        return d.source.y
      })
      .attr("x2", function(d) {
        return d.target.x
      })
      .attr("y2", function(d) {
        return d.target.y
      });

    d3.select("svg").selectAll("g.node")
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")"
      });

  }
  autocomplete(document.getElementById("search_bar"), names);

  const svg = document.querySelector('svg')
  window.addEventListener('click',e=>{
    if(e.target == svg){
      reset();
    }
  })





  // --------------------------------------------------
  // --------------------------------------------------
  // --------------------------------------------------
  //              autocomplete
  // --------------------------------------------------
  // --------------------------------------------------
  // --------------------------------------------------





  function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
          reset();
          SearchNode();
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  }

}
