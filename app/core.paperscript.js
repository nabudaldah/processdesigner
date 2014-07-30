  
function drawMap(mercator, mapdata){
  
  var group = new Group();
  
  for(var i = 0; i < mapdata.length; i++){
    var path = new Path();
    path.strokeColor = 'black';
    path.fillColor   = '#eeeeee';
 
    for(var j = 0; j < mapdata[i].length; j++){
      path.add(new Point(mercator.x(mapdata[i][j][1]), mercator.y(mapdata[i][j][0])));
    }
    
    group.addChild(path);
  }
  
  return group;
}

function drawCircles(mercator, metadata){

  var current = [];
  for ( meter in meters ){
    current.push([meters[meter], timeseries[window.index][meter]]);
  }   
  
  current.sort(function(a,b){ return Math.abs(a[1]) < Math.abs(b[1]) ? 1 : (Math.abs(a[1]) > Math.abs(b[1]) ? -1 : 0); });

  var group = new Group();
  for (var pair in current){
    var meter = current[pair][0];
    //var value = current[pair][1];
    var lat = metadata[meter].lat;
    var lon = metadata[meter].lon;
    var val = timeseries[window.index][meters.indexOf(meter)];
    var rad = Math.sqrt(Math.abs(val)/ Math.PI) * 0.025;
    
    // export, entry, berging
    if(metadata[meter].tags.indexOf("berging") != -1){ continue; }
    
    var circle = new Path.Circle(new Point(window.mercator.x(lon), window.mercator.y(lat)), rad);
    circle.opacity = 0.9;

    circle.fillColor = val > 0?new Color(1,0,0):new Color(0,1,0);
    circle.meterID = meter;
    circle.strokeColor = 'black';
    circle.strokeWidth = 1;
    
    circle.onClick = function(event) { drawGraph(this.meterID); };
    
    group.addChild(circle);
  }
  return group;
}
    
window.mercator.width  = view.size.width;
window.mercator.height = view.size.height;

window.mercator.reset();
window.mercator.box.north = 53.554516;
window.mercator.box.east  =  7.29271;
window.mercator.box.south = 50.755173;
window.mercator.box.west  =  3.3718216;
window.mercator.viewbox();

var map     = drawMap(window.mercator, mapdata);
var circles = drawCircles(window.mercator, metadata);

function onMouseDrag(event) {
  window.mercator.offset.x += event.delta.x;
  window.mercator.offset.y += event.delta.y;
  map.position     += event.delta;
  circles.position += event.delta;
}

$('#papercanvas')
    .mousewheel(function(event, delta) {
        var factor = 1 + (delta / 10);
        var sign   = factor > 0 ? 1 : -1;
        window.mercator.zoom(factor, event.offsetX * sign, event.offsetY * sign);
        window.redraw = true;
        return false;
    });

function onFrame(event) {

  if(window.loop){
    showNextIndex();
  }
  
  if(window.redraw){
    window.mercator.width  = view.viewSize.width; 
    window.mercator.height = view.viewSize.height; 
    map.remove();
    map = drawMap(window.mercator, mapdata);
    circles.remove();
    circles = drawCircles(window.mercator, metadata);
    window.redraw = false;
  }
}

// Once pressed
function onKeyUp(event) {
  switch(event.key) {
    case '0': window.mercator.viewbox(); window.redraw = true; break;
    case 'space': window.loop = !window.loop; break;
  }      
}

// Pressed and hold down
function onKeyDown(event) {
  switch(event.key) {
    case '-': window.mercator.zoomcenter(0.9); window.redraw = true; break;
    case '=': window.mercator.zoomcenter(1.1); window.redraw = true; break;
  }      
}

function onResize(event) {
  window.mercator.width  = view.size.width;
  window.mercator.height = view.size.height;
  window.mercator.viewbox(); window.redraw = true;
}

