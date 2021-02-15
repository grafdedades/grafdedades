function select_button(id){
  if (document.getElementById(id).classList.contains('btn-primary')){
    document.getElementById(id).classList.add('btn-outline-primary');
    document.getElementById(id).classList.remove('btn-primary');
    document.getElementById(id).style.padding = "14px 0px";
  } else {
    document.getElementById(id).classList.remove('btn-outline-primary');
    document.getElementById(id).classList.add('btn-primary');
    document.getElementById(id).style.padding = "15px 0px";
  }
}

function select_button2(originalid){
  unmark = document.getElementById(originalid).classList.contains('btn-outline-primary');
  node_ids.forEach(function(id){
    document.getElementById(id).classList.add('btn-outline-primary');
    document.getElementById(id).classList.remove('btn-primary');
    document.getElementById(id).style.padding = "14px 0px";
  });
  if (unmark){
    document.getElementById(originalid).classList.remove('btn-outline-primary');
    document.getElementById(originalid).classList.add('btn-primary');
    document.getElementById(originalid).style.padding = "15px 0px";
  }

}

function unselectAllButtons(){
  var ids = edge_ids.concat(node_ids)
  ids.forEach(function(id){
    if (document.getElementById(id).classList.contains('btn-primary')){
      document.getElementById(id).classList.add('btn-outline-primary');
      document.getElementById(id).classList.remove('btn-primary');
      document.getElementById(id).style.padding = "14px 0px";
    }
  });
}
