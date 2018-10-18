
var width = 650,
height = 650;
var svg = d3.select(".force").append("svg")
    .attr("width", width)
    .attr("height", height);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(function(d) { return ((1000/d.value));}))
    .force("charge", d3.forceManyBody())
    .force("collide", d3.forceCollide(50))
    .force("center", d3.forceCenter(width / 2, height / 2));

d3.json("graph_ip.json", function(error, graph) {
  if (error) throw error;
  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line");
  link.append("title")
    .text(function(d) {return d.value})

  var node = svg.selectAll(".nodes")
    .data(graph.nodes)
    .enter().append("g")
    .attr("class", "nodes")
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
  node.append("circle")
      .attr("r", function(d) {return Math.sqrt(d.size)/5});      
  node.append("text")
    .text(function(d) { return d.id; });
  node.append("title")
      .html(function(d) { return "Num repositories" + "<br>" +  d.size.toString(); });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
         .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });;
  }
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
