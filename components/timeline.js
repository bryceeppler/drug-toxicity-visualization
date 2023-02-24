// https://gist.github.com/officeofjane/47d2b0bfeecfcb41d2212d06d095c763
const formatDateIntoYear = d3.timeFormat("%Y");
const formatDate = d3.timeFormat("%b %Y");
const parseDate = d3.timeParse("%m/%d/%y");

const startDate = new Date("2016-02-01");
const endDate = new Date("2022-04-01");
var selectedDate = "2020-01"
const timelineMargin = { top: 0, right: 50, bottom: 0, left: 50 };
const timelineWidth = 400 - timelineMargin.left - timelineMargin.right;
const timelineHeight = 200 - timelineMargin.top - timelineMargin.bottom;

const svg = d3
  .select("#vis")
  .append("svg")
  .attr("width", timelineWidth + timelineMargin.left + timelineMargin.right)
  .attr("height", timelineHeight + timelineMargin.top + timelineMargin.bottom);

////////// slider //////////

var moving = false;
var currentValue = 0;
var targetValue = timelineWidth;
var playButton = d3.select("#play-button");

var x = d3
  .scaleTime()
  .domain([startDate, endDate])
  .range([0, targetValue])
  .clamp(true);

var slider = svg
  .append("g")
  .attr("class", "slider")
  .attr(
    "transform",
    "translate(" + timelineMargin.left + "," + timelineHeight / 5 + ")"
  );

slider
  .append("line")
  .attr("class", "track")
  .attr("x1", x.range()[0])
  .attr("x2", x.range()[1])
  .select(function () {
    return this.parentNode.appendChild(this.cloneNode(true));
  })
  .attr("class", "track-inset")
  .select(function () {
    return this.parentNode.appendChild(this.cloneNode(true));
  })
  .attr("class", "track-overlay")
  .call(
    d3
      .drag()
      .on("start.interrupt", function () {
        slider.interrupt();
      })
      .on("start drag", function (event) {
        currentValue = d3.pointer(event)[0];
        update(x.invert(currentValue - 190));
      })
  );

slider
  .insert("g", ".track-overlay")
  .attr("class", "ticks")
  .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
  .data(x.ticks(10))
  .enter()
  .append("text")
  .attr("x", x)
  .attr("y", 10)
  .attr("text-anchor", "middle")
  .text(function (d) {
    return formatDateIntoYear(d);
  });

var handle = slider
  .insert("circle", ".track-overlay")
  .attr("class", "handle")
  .attr("r", 9);

var label = slider
  .append("text")
  .attr("class", "label")
  .attr("text-anchor", "middle")
  .text(formatDate(startDate))
  .attr("transform", "translate(0," + -25 + ")");

////////// plot //////////

var dataset;

var plot = svg
  .append("g")
  .attr("class", "plot")
  .attr(
    "transform",
    "translate(" + timelineMargin.left + "," + timelineMargin.top + ")"
  );

d3.csv("data/timelinedata.csv", prepare).then(function (data) {
  dataset = data;
  drawPlot(dataset);

  playButton.on("click", function () {
    var button = d3.select(this);
    if (button.text() == "Pause") {
      moving = false;
      clearInterval(timer);
      // timer = 0;
      button.text("Play");
    } else {
      moving = true;
      timer = setInterval(step, 50);
      button.text("Pause");
    }
  });
});

function prepare(d) {
  d.id = d.id;
  d.date = parseDate(d.date);
  return d;
}

function step() {
  update(x.invert(currentValue));
  currentValue = currentValue + targetValue / 151;
  if (currentValue > targetValue) {
    moving = false;
    currentValue = 0;
    clearInterval(timer);
    // timer = 0;
    playButton.text("Play");
  }
}

function drawPlot(data) {
  var locations = plot.selectAll(".location").data(data);
  var colorScale = d3
    .scaleLinear()
    .domain([600, 2400])
    .range(["#F6EBEB", "#e00000"]);
  // if filtered dataset has more circles than already existing, transition new ones in
  locations
    .enter()
    .append("circle")
    .attr("class", "location")
    .attr("cx", function (d) {
      return x(d.date);
    })
    .attr("cy", height / 2)
    .style("fill", function (d) {
      return d3.hsl(colorScale(d.val));
    })
    .style("stroke", function (d) {
      return d3.hsl(colorScale(d.val));
    })
    .style("opacity", 0.5)
    .attr("r", 8)
    .transition()
    .duration(400)
    .attr("r", 25)
    .transition()
    .attr("r", 8);

  // if filtered dataset has less circles than already existing, remove excess
  locations.exit().remove();
}

function update(h) {
  // TODO update all the things
  // DRAW MAP
  // console.log(h)
  let tempYear = h.getFullYear();
  let tempMonth = h.getMonth();
  // if temp month in is the first quarter, set it to 1
  if (tempMonth < 3) {
    tempMonth = 1;
  } else if (tempMonth < 6) {
    tempMonth = 4;
  } else if (tempMonth < 9) {
    tempMonth = 7;
  } else {
    tempMonth = 10;
  }
  // temp month must have a leading 0 if it is less than 10
  let tempYearMonth = tempYear + "-" + (tempMonth < 10 ? "0" : "") + tempMonth;
  
  selectedDate = tempYearMonth;
  drawMap(selectedDate);
  // DRAW BAR CHART
  drawBar(selectedDate, "Canada")
  // DRAW TREEMAP

  // update position and text of label according to slider scale
  handle.attr("cx", x(h));
  label.attr("x", x(h)).text(formatDate(h));

  // filter data set and redraw plot
  var newData = dataset.filter(function (d) {
    return d.date < h;
  });
  drawPlot(newData);
}
