const provinceDataForMap2 = new Map(
  Object.entries({
    "British Columbia": 10000,
    Alberta: 2000,
    Saskatchewan: 4000,
    Manitoba: 5000,
    Ontario: 1000,
    Quebec: 1500,
    "Newfoundland and Labrador": 3000,
    "Prince Edward Island": 5000,
    "Yukon Territory": 5600,
    "Northwest Territories": 3000,
    Nunavut: 2000,
    "New Brunswick": 1000,
    "Nova Scotia": 500,
  })
);
const provinceDataForMap3 = new Map(
  Object.entries({
    "British Columbia": 100,
    Alberta: 2000,
    Saskatchewan: 9000,
    Manitoba: 2000,
    Ontario: 4000,
    Quebec: 4500,
    "Newfoundland and Labrador": 3000,
    "Prince Edward Island": 5000,
    "Yukon Territory": 1600,
    "Northwest Territories": 3000,
    Nunavut: 2000,
    "New Brunswick": 2000,
    "Nova Scotia": 9000,
  })
);
var provinceDataForMap = provinceDataForMap2;
// The svg has id map
var mapSvg = d3.select("#map"),
  width = +mapSvg.attr("width"),
  height = +mapSvg.attr("height");

// Map and projection
var path = d3.geoPath();
var projection = d3
  .geoMercator()
  .scale(200)
  .center([-98.5, 61.5])
  .translate([width / 2, height / 2]);

// Data and color scale
var data = new Map();
var colorScale = d3
  .scaleThreshold()
  .domain([500, 1000, 2500, 5000, 7500, 10000])
  .range(d3.schemeBlues[7]);

// Load external data and boot
Promise.all([
  d3.json(
    "https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/canada.geojson"
  ),
  // d3.csv("data/mapData.csv").then(function (d) {
  //   d.forEach(function (row) {
  //     data.set(row.name, +row.val);
  //   });
  // }),
]).then(ready);

function ready([topo]) {
  let mouseOver = function (d) {
    d3.selectAll(".Province").transition().duration(200).style("opacity", 0.5);
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black");
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
  };

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
      return colorScale(d.total);
    })
    .style("stroke", "transparent")
    .attr("class", function (d) {
      return "Province";
    })
    .style("opacity", 0.8)
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave)
    .on("mouseout", mouseOut);
}

function drawMap(year) {
    // Update the province data based on the year
    if (year >= 2016 && year <= 2018) {
      provinceDataForMap = provinceDataForMap2;
    } else if (year >= 2019 && year <= 2022) {
      provinceDataForMap = provinceDataForMap3;
    }
  
    // Clear the existing map
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
        return colorScale(d.total);
      })
      .style("stroke", "transparent")
      .attr("class", function (d) {
        return "Province";
      })
      .style("opacity", 0.8)
      .on("mouseover", mouseOver)
      .on("mouseleave", mouseLeave)
      .on("mouseout", mouseOut);
}
