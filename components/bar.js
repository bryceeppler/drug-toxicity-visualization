var testyy = "testyy";
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

var jsonbarData;
var selectedBarData;
d3.json("data/barData.json")
  .then(function (data) {
    jsonbarData = data;
    console.log("jsonbarData", jsonbarData);
    selectedBarData = jsonbarData["2020-01"]["Alberta"];
    console.log("selectedBarData", selectedBarData);
  })
  .then(function () {
    drawBar();
  });

function drawBar() {
  const subgroups = [
    "0 to 19 years",
    "20 to 29 years",
    "30 to 39 years",
    "40 to 49 years",
    "50 to 59 years",
    "60 years or more",
  ];
  const groups = ["female", "male"];
  // Add X axis
  const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
  barSvg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
  const y = d3.scaleLinear().domain([0, 280]).range([height, 0]);
  barSvg.append("g").call(d3.axisLeft(y));

  // Another scale for subgroup position?
  const xSubgroup = d3
    .scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05]);

  // Define color range for "male" subgroup
  const blueRange = [
    "#b3cde0",
    "#a1b8d6",
    "#8db5cc",
    "#779cc1",
    "#5d85b0",
    "#416b9e",
  ];

  // Define color range for "female" subgroup
  const redRange = [
    "#fbb4ae",
    "#f8a2a7",
    "#f68e9f",
    "#f47997",
    "#f2658e",
    "#c51b8a",
  ];

  // Define color scale with two ranges
  const color = d3
    .scaleOrdinal()
    .domain(subgroups)
    .range(
      selectedBarData
        .map((d) => {
          // console.log(d);
          return d.group === "male" ? redRange : blueRange;
        })
        .flat()
    );

  // Show the bars with new color scale
  barSvg
    .append("g")
    .selectAll("g")
    .data(selectedBarData)
    .join("g")
    .attr("transform", (d) => `translate(${x(d.group)},0)`)
    .selectAll("rect")
    .data((d) => subgroups.map((key) => ({ key: key, value: d[key] })))
    .join("rect")
    .attr("x", (d) => xSubgroup(d.key))
    .attr("y", (d) => y(d.value))
    .attr("width", xSubgroup.bandwidth())
    .attr("height", (d) => height - y(d.value))
    .attr("fill", (d) => color(d));
}
