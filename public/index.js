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
      cols = ["#fee5d9", "#fcae91", "#fb6a4a", "#cb181d"],
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
        `translate(${padding.left + 30}, ${height - padding.bottom})`
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
      .attr(
        "transform",
        `translate(${padding.left * 12.5}, ${padding.top - 10})`
      )
      .attr("id", "y-axis")
      .call(yAxis);

    svg
      .append("g")
      .attr("transform", `translate(${padding.left + 30}, ${padding.top - 11})`)
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
      .attr("width", barWidth)
      .attr("height", barHeight)
      .attr("fill", "green");
  })
  .catch(error => {
    console.error(error);
  });
