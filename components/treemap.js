const treemapWidth = 960;
const treemapHeight = 600;
const format = d3.format(",d");
const color = d3.scaleOrdinal(d3.schemeCategory10);

const treemap = (data) =>
  d3.treemap().size([treemapWidth, treemapHeight]).padding(1).round(true)(
    d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)
  );

const treemapSvg = d3
  .select("#treemap")
  .attr("viewBox", [0, 0, treemapWidth, treemapHeight]);

const treemapTooltip = d3
  .select("body")
  .append("div")
  .attr("class", "treemapTooltip")
  .style("opacity", 0);

function drawTreemap(date) {
  const root = treemap(treemapData[date]);

  const cell = treemapSvg
    .selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  cell
    .append("rect")
    .attr("class", "tile")
    .attr("fill", (d) =>
      d.parent === root ? color(d.data.name) : color(d.parent.data.name)
    )
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .on("mouseover", (event, d) => {
      treemapTooltip.transition().duration(200).style("opacity", 0.9);
      treemapTooltip
        .html(`${d.parent.data.name} - ${d.data.name}: ${format(d.value)}`)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", (event, d) => {
      treemapTooltip.transition().duration(500).style("opacity", 0);
    });

  cell
    .append("text")
    .attr("class", "label")
    .attr("x", 5)
    .attr("y", 20)
    // if the deaths are less than 70, don't show the label
    .text((d) => (d.value < 70 ? "" : d.data.name));
}
let treemapData;
d3.json("data/treemapData.json").then((data) => {
  treemapData = data;
  drawTreemap('2016-01');
});
