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
  })
  .then(function () {
    drawBar("2020-01", "Canada");
  });

function drawBar(date, province) {
  var tempYear = date.split("-")[0]
  
  // If there is no data for this year, show nothing
  // we only have 2018 - 2022
  if (tempYear < 2018 || tempYear > 2022) {
    return;
  }
  var tempDate = tempYear + "-01";

  // if selectedBarData isn't going to change, return from the function
  if (selectedBarData === jsonbarData[tempDate][province]) {
    return;
  }
  selectedBarData = jsonbarData[tempDate][province];
  // remove previous bar chart
  barSvg.selectAll("*").remove();
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

  var maxVal = 0;
  for (let i = 0; i < selectedBarData.length; i++) {
    for (let j = 0; j < subgroups.length; j++) {
      console.log("subgroups[j]", subgroups[j])
      if (parseInt(selectedBarData[i][subgroups[j]]) > maxVal) {
        maxVal = selectedBarData[i][subgroups[j]];
      }
    }
  }


  maxVal = parseInt(maxVal);
  maxVal=2000
  const y = d3.scaleLinear().domain([0, maxVal]).range([height, 0]);
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
const bars = barSvg
  .append("g")
  .selectAll("g")
  .data(selectedBarData)
  .join("g")
  .attr("transform", (d) => `translate(${x(d.group)},0)`);

bars
  .selectAll("rect")
  .data((d) => subgroups.map((key) => ({ key: key, value: d[key] })))
  .join("rect")
  .attr("x", (d) => xSubgroup(d.key))
  .attr("height", d => height - y(0)) // always equal to 0
  .attr("y", d => y(0))  .attr("width", xSubgroup.bandwidth())
  .attr("fill", (d) => color(d))

bars.selectAll("rect").transition().duration(300)
.attr("y", (d) => y(d.value))
.attr("height", (d) => height - y(d.value))
// .delay((d,i) => {console.log(i); return 10})
}

