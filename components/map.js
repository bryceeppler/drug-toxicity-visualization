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

function drawMap(date) {
  // Update the province data based on the year
  // if (year >= 2016 && year <= 2018) {
  //   provinceDataForMap = provinceDataForMap2;
  // } else if (year >= 2019 && year <= 2022) {
  //   provinceDataForMap = provinceDataForMap3;
  // }
  // convert date to 2014-01-01
  // let tempYear = date.getFullYear();
  // let tempMonth = date.getMonth();
  // // if temp month in is the first quarter, set it to 1
  // if (tempMonth < 3) {
  //   tempMonth = 1;
  // } else if (tempMonth < 6) {
  //   tempMonth = 4;
  // } else if (tempMonth < 9) {
  //   tempMonth = 7;
  // } else {
  //   tempMonth = 10;
  // }
  // // temp month must have a leading 0 if it is less than 10
  // let tempYearMonth = tempYear + "-" + (tempMonth < 10 ? "0" : "") + tempMonth;
  // provinceDataForMap = mapJsonData[date]
  let selectedJsonData = mapJsonData[date];
  // convert the json data to a map
  provinceDataForMap = new Map(Object.entries(selectedJsonData));
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
    .style("opacity", 0.8);

  mapSvg
    .selectAll(".Province")
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave)
    .on("mouseout", mouseOut);
}
