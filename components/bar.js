// set the dimensions and margins of the graph
var margin = { top: 30, right: 30, bottom: 20, left: 50 },
  width = 370 - margin.left - margin.right,
  height = 280 - margin.top - margin.bottom;
const barSvg = d3
  .select("#bar")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("data/barData.csv").then(function (data) {
  // List of subgroups = header of the csv files = soil condition here
  const subgroups = data.columns.slice(1);

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  const groups = Array.from(new Set(data.map((d) => d.group)));

  // Add X axis
  const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
  barSvg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
  const y = d3.scaleLinear().domain([0, 40]).range([height, 0]);
  barSvg.append("g").call(d3.axisLeft(y));

  // Another scale for subgroup position?
  const xSubgroup = d3
    .scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05]);

// Define color range for "male" subgroup
const blueRange = ["#b3cde0", "#8db5cc", "#6497b1"];

// Define color range for "female" subgroup
const redRange = ["#fbb4ae", "#f768a1", "#c51b8a"];

// Define color scale with two ranges
const color = d3.scaleOrdinal()
  .domain(subgroups)
  .range(data.map(d => d.group === "male" ? redRange : blueRange).flat());

// Show the bars with new color scale
barSvg
  .append("g")
  .selectAll("g")
  .data(data)
  .join("g")
  .attr("transform", (d) => `translate(${x(d.group)},0)`)
  .selectAll("rect")
  .data((d) => subgroups.map((key) => ({ key: key, value: d[key] })))
  .join("rect")
  .attr("x", (d) => xSubgroup(d.key))
  .attr("y", (d) => y(d.value))
  .attr("width", xSubgroup.bandwidth())
  .attr("height", (d) => height - y(d.value))
  .attr("fill", (d) => color(d))
});