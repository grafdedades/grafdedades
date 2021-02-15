// ### GRAPH ###

// Map of node info throw its label
var nodeHash = {};

// Lists of nodes and edges (only important info for the network construction)
var nodes = [];
var edges = [];

var darkmode = false;

var color_t = "#000000"
var color_n = "black"

// ### COLORS ###

var colors = {"2017" : "#E57373", "2018" : "#66BB6A", "2019" : "#42A5F5",
              "2020" : "#FFFF99", "2021" : "#CC9999", "2022" : "#666633",
              "2023" : "#993300", "2024" : "#999966", "OTHER": "#660000"};

// ### RANKINGS ###

var avg_rank_id = [];
var pnt_rank_id = [];
var deg_rank_id = [];

// ### MAX DEGREE ###

var max_degree = [];

var node_ids = ["n2017", "n2018", "n2019", "n2020"]
var edge_ids = ["e2018", "e2019", "e2020", "e2021"]

var unmark = false;
