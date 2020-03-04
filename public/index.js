const TITLE = d3
  .select("body")
  .append("h1")
  .text("Monthly Global Land-Surface Temperature")
  .attr("id", "title");

const URL =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

d3.json(URL)
  .then(data => {
    console.log(data);
    console.log(data.monthlyVariance);

    const VARIANCE = [];

    data.monthlyVariance.map(d => {
      if (!VARIANCE.includes(d.variance)) {
        VARIANCE.push(d.variance);
      }
    });

    VARIANCE.sort();
    console.log(VARIANCE);
    console.log(VARIANCE.length);
    console.log(VARIANCE.length / 4);
    const VARIANCE_EXTENT = d3.extent(VARIANCE);
    console.log(VARIANCE_EXTENT);

    const YEARS = [];

    data.monthlyVariance.map(d => {
      if (!YEARS.includes(d.year)) {
        YEARS.push(d.year);
      }
    });

    const yearsExtent = d3.extent(YEARS);

    data.monthlyVariance.forEach(d => (d.month -= 1));

    const width = 1200,
      height = 400,
      barWidth = width / data.monthlyVariance.length,
      barHeight = height / 12,
      cols = ["#1b9e77", "#d95f02", "#7570b3", "#e7298a"],
      padding = {
        left: 20,
        right: 20,
        top: 10,
        bottom: 10
      };

    d3.select("body")
      .append("h3")
      .html(
        `${yearsExtent[0]}-${yearsExtent[1]}: base temperature ${data.baseTemperature}&#8451;`
      )
      .attr("id", "description");

    const svg = d3
      .select("body")
      .append("svg")
      .attr("id", "viz")
      .attr("width", width + padding.left + padding.right)
      .attr("height", height + padding.top + padding.bottom);

    const xScale = d3
      .scaleBand()
      .domain(YEARS)
      .range([padding.left * 10, width - padding.right]);

    const xAxis = d3
      .axisBottom(xScale)
      .tickValues(YEARS.filter(year => year % 10 === 0))
      .tickSizeOuter(0);
    svg
      .append("g")
      .attr(
        "transform",
        `translate(${padding.left - 160}, ${height - padding.bottom + 1.725})`
      )
      .attr("id", "x-axis")
      .call(xAxis);

    const yScale = d3
      .scaleBand()
      .domain(data.monthlyVariance.map(d => d.month))
      .range([padding.top, height - padding.bottom]);

    const yAxis = d3
      .axisLeft(yScale)
      .tickSizeOuter(0)
      .tickFormat(month => {
        let format = d3.timeFormat("%B");
        let date = new Date(0);
        date.setUTCMonth(month);
        return format(date);
      });

    svg
      .append("g")
      .attr("transform", `translate(${padding.left * 3}, ${padding.top - 10})`)
      .attr("id", "y-axis")
      .call(yAxis);

    //TOOLTIP
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);

    svg
      .append("g")
      .attr(
        "transform",
        `translate(${padding.left - 159}, ${padding.top - 10})`
      )
      .selectAll("rect")
      .data(data.monthlyVariance)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("data-month", d => d.month)
      .attr("data-year", d => d.year)
      .attr("data-temp", d => d.variance)
      .attr("x", (d, i) => xScale(d.year))
      .attr("y", (d, i) => yScale(d.month))
      .attr("width", barWidth + 3)
      .attr("height", barHeight)
      .attr("fill", d => {
        if (d.variance <= 0) {
          return cols[0];
        } else if (d.variance <= 2) {
          return cols[1];
        } else if (d.variance <= 4) {
          return cols[2];
        } else {
          return cols[3];
        }
      })
      .on("mouseover", (d, i) => {
        function formatTime(month) {
          let format = d3.timeFormat("%B");
          let date = new Date(0);
          date.setUTCMonth(month);
          return format(date);
        }

        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0.9);

        tooltip
          .html(
            `
          <span>${formatTime(d.month)}</span>, <span>${d.year}</span>
          <br/>
          Variance: <span>${d.variance}</span> 
          <br/>
          Temp: <span>${data.baseTemperature +
            d.variance}</span>&#8451;<span></span>
          `
          )
          .attr("data-year", d.year)
          .style("left", `${xScale(d.year) - 70}px`) //`${xScale(d.year)}px
          .style("top", `${yScale(d.month) + 90}px`); //${yScale(d.month)}px
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    //LEGEND

    const legendWidth = 200,
      legendHeight = 100;

    const legendScale = d3
      .scaleBand()
      .domain(["< 0", "<= 2", "<= 4", "=> 4"])
      .range([0, legendWidth]);

    const legendLinear = d3
      .scaleLinear()
      .domain([0, 4])
      .range([0, legendWidth]);

    const legendAxisX = d3.axisBottom(legendScale).tickSizeOuter(0);

    const legendSvg = d3
      .select("body")
      .append("svg")
      .attr("height", legendHeight)
      .attr("width", legendWidth);

    const legendX = legendSvg
      .append("g")
      .attr("transform", `translate(0, 35)`)
      .call(legendAxisX);

    const legend = legendSvg
      .append("g")
      .attr("id", "legend")
      .attr("transform", `translate(0, 10)`)
      .selectAll("rect")
      .data(cols)
      .enter()
      .append("rect")
      .attr("x", (d, i) => legendLinear(i))
      .attr("y", 5)
      .attr("width", 90)
      .attr("height", 20)
      .attr("fill", (d, i) => cols[i]);
  })
  .catch(error => {
    console.error(error);
  });
