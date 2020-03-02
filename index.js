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

    const YEARS = data.monthlyVariance.map(d => d.year);

    const yearsExtent = d3.extent(YEARS);
    console.log(YEARS);
    console.log(d3.max(YEARS));
    console.log(yearsExtent);

    data.monthlyVariance.forEach(d => (d.month -= 1));

    const width = 900,
      height = 400,
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
      .range([padding.left, width - padding.right]);

    const xAxis = d3
      .axisBottom(xScale)
      .tickValues(xScale.domain().filter(year => year % 10 === 0))
      .tickSizeOuter(0);

    svg
      .append("g")
      .attr(
        "transform",
        `translate(${padding.left}, ${height - padding.bottom})`
      )
      .attr("id", "x-axis")
      .call(xAxis);

    const yScale = d3
      .scaleBand()
      .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
      .rangeRound([padding.top, height - padding.top]);

    const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

    svg
      .append("g")
      .attr("transform", `translate(${padding.left}, ${padding.top})`)
      .attr("id", "y-axis")
      .call(yAxis);
  })
  .catch(error => {
    console.error(error);
  });
