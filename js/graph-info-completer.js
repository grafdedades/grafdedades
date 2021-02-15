// Creation edges
function newEdge(edge){
  var source   = nodes[nodeHash[edge.source]];
  var target   = nodes[nodeHash[edge.target]];

  increaseDegree(source, target);
  addPoints([source, target], edge.weight);
}

// Calculate metrics of edges
function addPoints(newNodes, points){
  newNodes.forEach(function(n){
    if ('points' in nodes[n.id]){
      nodes[n.id].points += points;
      nodes[n.id].average = Math.floor((nodes[n.id].points / nodes[n.id].degree)*100)/100;
    } else {
      nodes[n.id]['points']  = points;
      nodes[n.id]['average'] = nodes[n.id].points;
    }
  });
}

// Calculate degree nodes
function increaseDegree(source, target){

  var newNodes = [source, target];
  newNodes.forEach(function(n){
    if ('degree' in nodes[n.id]){
      ++nodes[n.id].degree;
    } else {
      nodes[n.id]['degree'] = 1;
    }
  });

  checkMaxDegree(source, target);
};

// Calculate max_degree
function checkMaxDegree(source, target){
  if (max_degree.length == 0) {

    if (nodes[source.id].degree > nodes[target.id].degree){
      max_degree = [nodes[source.id]];
    } else if (++nodes[source.id].degree === nodes[target.id].degree){
      max_degree = [nodes[source.id], nodes[target.id]];
    } else {
      max_degree = [nodes[target.id]];
    }

  } else {
    var newNodes = [source, target];
    newNodes.forEach(function(n){
      if (n.degree > nodes[max_degree[0].id].degree) max_degree = [n];
      else if (n.degree === nodes[max_degree[0].id].degree && !max_degree.includes(n)) max_degree.push(n);
    });
  }
}
