// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 20, left: 50},
    width = 370 - margin.left - margin.right,
    height = 280 - margin.top - margin.bottom;
// append the svg object to the body of the page
var barSvg = d3.select("#bar")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// // append the svg object to the body of the page
// var barSvg = d3.select("#bar"),
// width = +barSvg.attr("width"),
// height = +barSvg.attr("height");
// Parse the Data
const data_json = [
    {
        "group": "banana",
        "Nitrogen": "12",
        "normal": "1",
        "stress": "13"
    },
    {
        "group": "poacee",
        "Nitrogen": "6",
        "normal": "6",
        "stress": "33"
    },
    {
        "group": "sorgho",
        "Nitrogen": "11",
        "normal": "28",
        "stress": "12"
    },
    {
        "group": "triticum",
        "Nitrogen": "19",
        "normal": "6",
        "stress": "1"
    }
]

d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv", function(data) {
    
  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function(d){return(d.group)}).keys()

  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  barSvg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 40])
    .range([ height, 0 ]);
  barSvg.append("g")
    .call(d3.axisLeft(y));

  // Another scale for subgroup position?
  var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#e41a1c','#377eb8','#4daf4a'])

  // Show the bars
  barSvg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
      .attr("transform", function(d) { return "translate(" + x(d.group) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return color(d.key); });

})
