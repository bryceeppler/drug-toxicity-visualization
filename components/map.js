var provinceDataForMap = new Map(
  Object.entries({
    "British Columbia": 169,
    "Alberta": 118,
    "Saskatchewan": 25,
    "Manitoba": 11,
    "Ontario": 174,
    "Quebec": 52,
    "New Brunswick": 11,
    "Nova Scotia": 14,
    "Prince Edward Island": -2,
    "Newfoundland and Labrador": -1,
    "Yukon": 0,
    "Northwest Territories": 1,
    "Nunavut": -1,
  })
);
// The svg has id map
var mapSvg = d3.select("#map"),
  width = +mapSvg.attr("width"),
  height = +mapSvg.attr("height");

const mapTooltip = d3.select("body")
  .append("div")
  .attr("class", "mapTooltip")
  .style("opacity", 0)
  .style("position", "absolute")
  .style("background-color", "#f9f9f9")
  .style("border", "1px solid #d3d3d3")
  .style("border-radius", "4px")
  .style("padding", "4px")
  .style("font-size", "12px")
  .style("pointer-events", "none");

  function showMapTooltip(event, d) {
    mapTooltip
      .style("opacity", 1)
      .html(`Province: ${d.properties.name}<br/>Value: ${d.total}`)
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 15 + "px");
  }
  
  function hideMapTooltip() {
    mapTooltip.style("opacity", 0);
  }

// Map and projection
var path = d3.geoPath();
var projection = d3
  .geoMercator()
  .scale(250)
  .center([-98.5, 61.5])
  .translate([width / 2, height / 2]);

// Data and color scale
var data = new Map();
var colorScale = d3
  .scaleThreshold()
  .domain([20, 90, 150, 200, 300, 500])
  .range(d3.schemeBlues[7]);

var topo;
var mapJsonData;
Promise.all([
  d3.json(
    "https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/canada.geojson"
  ),
  d3.json("data/mapData.json").then(function (d) {
    // save as mapJsonData
    mapJsonData = d;
  }),
]).then(function ([topoData]) {
  topo = topoData;
  ready();
});
let mouseOver = function (d) {
  d3.selectAll(".Province").transition().duration(200).style("opacity", 0.5);
  d3.select(this)
    .transition()
    .duration(200)
    .style("opacity", 1)
    .style("stroke", "black");
    showMapTooltip(d3.event, d);

};

let mouseOut = function (d) {
  d3.select(this).style("stroke", "transparent");
};

let mouseLeave = function (d) {
  d3.selectAll(".Province")
    .transition()
    .duration(200)
    .style("opacity", 0.8)
    .style("stroke", "transparent");
  d3.select(this).transition().duration(200).style("stroke", "transparent");
  hideMapTooltip();

};
function ready() {
  // Draw the map
  mapSvg
    .append("g")
    .selectAll("path")
    .data(topo.features)
    .join("path")
    .attr("d", path.projection(projection))
    // set the color of each Province
    .attr("fill", function (d) {
      d.total = provinceDataForMap.get(d.properties.name) || 0;
      return d.total < 0 ? "lightcoral" : colorScale(d.total);
    })
    
    .style("stroke", "transparent")
    .attr("class", function (d) {
      return "Province";
    })
    .style("opacity", 0.8)
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave)
    .on("mouseout", mouseOut);

    mapSvg.selectAll(".Province")
    .on("mouseover", mouseOver)
    .on("mousemove", showMapTooltip)
    .on("mouseleave", mouseLeave);
}

function drawMap(date) {
  let selectedJsonData = mapJsonData[date];
  provinceDataForMap = new Map(Object.entries(selectedJsonData));
  mapSvg.selectAll("path").remove();

  // Draw the updated map
  mapSvg
    .append("g")
    .selectAll("path")
    .data(topo.features)
    .join("path")
    .attr("d", path.projection(projection))
    // set the color of each Province
    .attr("fill", function (d) {
      d.total = provinceDataForMap.get(d.properties.name) || 0;
      return d.total < 0 ? "lightcoral" : colorScale(d.total);
    })
    
    .style("stroke", "transparent")
    .attr("class", function (d) {
      return "Province";
    })
    .style("opacity", 0.8);

  mapSvg
    .selectAll(".Province")
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave)
    .on("mouseout", mouseOut)
    .on("mousemove", showMapTooltip);
}
function createMapLegend() {
  const legendSvg = d3
    .select("#mapLegend")
    .append("svg")
    .attr("width", 300)
    .attr("height", 200);

  const colorDomain = [0, 20, 90, 150, 200, 300, 500];
  const legendLabels = [
    "0 - 19",
    "20 - 89",
    "90 - 149",
    "150 - 199",
    "200 - 299",
    "300 - 499",
    "500+",
    "No data",
  ];

  const legendColors = colorScale.range().concat("lightcoral");

  const legend = legendSvg
    .selectAll(".legend")
    .data(legendColors)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  legend
    .append("rect")
    .attr("x", 20)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", (d) => d);

  legend
    .append("text")
    .attr("x", 45)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text((d, i) => legendLabels[i]);
}

createMapLegend();
