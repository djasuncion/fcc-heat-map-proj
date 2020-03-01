const TITLE = d3
  .select("body")
  .append("h1")
  .text(`I'm your Title`)
  .attr("id", "title");

const URL =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

d3.json(URL)
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
