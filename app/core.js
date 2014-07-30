$(function() {
  window.mercator = new Mercator();
  window.index = 1;
  window.redraw = true;
  window.loop   = false;
});

function updateDateTime(){
  var mm = moment(indices[window.index]);
  var ts = mm.format("YYYY-MM-DDTHH:mmZ");
  $('#time').text(mm.format("HH:mm"));
  $('#date').text(mm.format("DD-MM-YYYY"));
}

function showIndex(time){
  var mm = moment(time);
  var ts = mm.format("YYYY-MM-DDTHH:mmZ");
  var i = indices.indexOf(ts);
  window.index = i;
  window.redraw = true;
  updateDateTime();
}

function showNextIndex(){
  window.index = ( window.index == indices.length ) ? 0 : window.index + 1;
  window.redraw = true;
  updateDateTime();
}

function showPreviousIndex(){
  window.index = ( window.index == indices.length ) ? 0 : window.index - 1;
  window.redraw = true;
  updateDateTime();
}

function drawGraph(meter){
  $('graph').show();
}

function drawGraph(meter) {
  var graphData = [];
  var graphColors = [];
  
  for(var i in indices){
    var time  = (new Date(indices[i])).getTime();
    var value = timeseries[i][meters.indexOf(meter)];
    graphData.push([time, Math.abs(value)]);
    var color = (value == 0) ? ( '#eeeeee' ) : (value>0?'#ff0000':'#00ff00');
    graphColors.push(color);
  }
  
  $('#graph').highcharts({
    chart: { type: 'column', zoomType: "x", borderRadius: 0 },
    plotOptions: { column: { animation: false, colorByPoint: true, colors: graphColors, groupPadding: 0 } },
    credits: { enabled: false },
    legend: { enabled: false },    
    title: { text: null,},
    subtitle: { text: null },
    //xAxis: { type: 'datetime', title: { text: null }, labels: { enabled: false},  gridLineWidth: 0},
    //yAxis: { title: { text: null }, labels: { enabled: false}, gridLineWidth: 0 },
    xAxis: { type: 'datetime', title: { text: null }, labels: { enabled: false},  gridLineWidth: 0},
    yAxis: { title: { text: null }, labels: { enabled: true }, gridLineWidth: 1 },
    series: [{ data: graphData, point: { events: { mouseOver: function() { showIndex(this.x) } } } }],
    tooltip: { animation: false, enabled: false}
  });
};
