// Create the SVG in the "map" div
var svg = d3.select("#map")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%");

// Define the map projection
var projection = d3.geoMercator()
  .scale(200) // You may need to adjust this
  .center([20, 0]); // Center the map around Africa

// Define the path generator using the projection
var path = d3.geoPath()
  .projection(projection);

// Define zoom behaviour
var zoom = d3.zoom()
  .scaleExtent([1, 8])
  .on('zoom', zoomed);

// Group to hold the map features and apply the zoom
var g = svg.append('g');

svg.call(zoom);

function zoomed() {
  g.attr('transform', d3.event.transform);
}

// Load and draw the map
d3.json("/africa.json").then(function(topology) {
  // Convert the TopoJSON to GeoJSON
  var geojson = topojson.feature(topology, topology.objects.continent_Africa_subunits);

  // Draw the countries on the map
  g.selectAll("path")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", "#ccc") // Change the color as you like
    .style("stroke", "#333"); // Change the color as you like
});
