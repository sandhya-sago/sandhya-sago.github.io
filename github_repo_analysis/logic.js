
//https://bl.ocks.org/mbostock/4062006
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    outerRadius = Math.min(width, height) * 0.5 - 40,
    innerRadius = outerRadius - 30;

var formatValue = d3.formatPrefix(",.0", 1e3);

var chord = d3.chord()
    .padAngle(0.05);

var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

var ribbon = d3.ribbon()
    .radius(innerRadius);

var color = d3.scaleOrdinal()
    .domain(d3.range(20))
    .range(colors);

var g = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .datum(chord(matrix));

console.log(chord(matrix))
var group = g.append("g")
    .attr("class", "groups")
  .selectAll("g")
  .data(function(chords) { return chords.groups; })
  .enter().append("g");

var groupPath = group.append("path")
    .attr("id", function(d,i) { return "langArc_"+i; }) //Unique id for each slice
    .style("fill", function(d) { return color(d.index); })
    .style("stroke", function(d) { return d3.rgb(color(d.index)).darker(); })
    .attr("d", arc)
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)


// Put text labels
group.append("text")
.attr("x", function(d) {return getXoffset(d); })   //Move the text from the start angle of the arc
    .attr("dy", -28) //Move the text down
    .attr("text-anchor", "middle")  
    .style("font-size", "18px")
    .style('fill', 'darkOrange')
    .append("textPath")
    .attr("xlink:href",function(d,i){return "#langArc_"+i;})
    .text(function(d) {return top_20_popular_languages[d.index]; });

var groupTick = group.selectAll(".group-tick")
  .data(function(d) { return groupTicks(d, 1e3); })
  .enter().append("g")
    .attr("class", "group-tick")
    .attr("transform", function(d) { return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + outerRadius + ",0)"; });

groupTick.append("line")
    .attr("x2", 6);

groupTick
  .filter(function(d) { return d.value % 5e3 === 0; })
  .append("text")
    .attr("x", 8)
    .attr("dy", ".35em")
    .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180) translate(-16)" : null; })
    .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
    .text(function(d) { return formatValue(d.value); });

var ribbons = g.append("g")
    .attr("class", "ribbons")
    .selectAll("path")
    .data(function(chords) { return chords; })
    .enter().append("path")
    .attr("d", ribbon)
    .style("fill", function(d) { return color(d.source.index); })
    .style("stroke", function(d) { return d3.rgb(color(d.source.index)).darker(); });

function getXoffset(d){
    if (d.endAngle - d.startAngle < 0.15){
        return 15;
    } else {
        return 45;
    }
}

// Returns an array of tick angles and values for a given group and step.
function groupTicks(d, step) {
  var k = (d.endAngle - d.startAngle) / d.value;
  console.log(d.index, d.value)
  return d3.range(0, d.value, step).map(function(value) {
    return {value: value, angle: value * k + d.startAngle};
  });
}

function mouseover(d, i) {
    ribbons.classed("fade", function(p) {
    return p.source.index != i && p.target.index != i;
    });
}
function mouseout() {
    ribbons.classed("fade", false);
}
