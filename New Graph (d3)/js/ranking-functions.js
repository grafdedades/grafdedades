// POINTS

var pnt_rank_id = [];

function comparePoints( a, b ) {
  if ( a.points < b.points ){
    return -1;
  }
  if ( a.points > b.points ){
    return 1;
  }
  return 0;
}

function pointsRanking(nodes_copy){
  nodes_copy.sort( comparePoints );
  nodes_copy.forEach((n) => {
    pnt_rank_id.push(n.id)
  });
};

// DEGREE

var deg_rank_id = [];

function compareDegree( a, b ) {
  if ( a.degree > b.degree ){
    return -1;
  }
  if ( a.degree < b.degree ){
    return 1;
  }
  return 0;
}

function degreeRanking(nodes_copy){
  nodes_copy.sort( compareDegree );
  nodes_copy.forEach((n) => {
    deg_rank_id.push(n.id)
  });
};

// AVERAGE

var avg_rank_id = [];

function averageRanking(nodes_copy){
  nodes_copy.sort( comparePoints );
  nodes_copy.forEach((n) => {
    avg_rank_id.push(n.id)
  });
};

function compareAverage( a, b ) {
  if ( a.average > b.average ){
    return -1;
  }
  if ( a.average < b.average ){
    return 1;
  }
  return 0;
}
