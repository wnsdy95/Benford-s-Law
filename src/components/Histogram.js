import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./Histogram.css";

const Histogram = ({ data }) => {
  const [distribution, setDistribution] = useState([]);
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  const width = 600;
  const height = 450;
  const margin = { top: 20, right: 150, bottom: 30, left: 40 };

  const colorScale = d3
    .scaleLinear()
    .domain([1, 9]) // Assuming you have 9 categories
    .range(["#2BE19F", "#2BE19F"]); // 히스토그램 바 1-9 까지 컬러스케일 (같은 색으로 넣어주면 모든 바 가 같은색)

  const y = d3
    .scaleBand()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9]) // Leading digits 1-9
    .range([margin.top, height - margin.bottom]) // Adjusted the range
    .padding(0.1);

  let x = d3
    .scaleLinear()
      .domain([0, d3.max(distribution) > 0.3 ? d3.max(distribution) : 0.3])
    .nice()
    .rangeRound([margin.left, width - margin.right]);

  const counts = Array(9).fill(0);
  const percentages = Array(9).fill(0);

  function computeBenfordDistribution(data) {
    const distribution = Array(9).fill(0);

    data.forEach((value) => {
      var numf = parseFloat(value);
      if (numf >= 1) {
        const leadingDigit = parseInt(String(value)[0]);
        if (leadingDigit > 0) {
          distribution[leadingDigit - 1] += 1;
        }
      } else if (numf > 0 && 1 > numf) {
        var i;

        for (i = 1; ; i++) {
          numf = numf * 10 ** i;
          if (numf >= 1) {
            distribution[parseInt(String(numf)[0]) - 1] += 1;
            break;
          }
        }
      }
    });

    const totalCount = distribution.reduce((acc, count) => acc + count, 0);

    const percentages = distribution.map((count) => count / totalCount);

    for (let i = 0; i < counts.length; i++) {
      percentages[i] = counts[i] / totalCount;
    }

    return distribution.map((count) => count / totalCount);
  }

  function idealBenfordDistribution() {
    return [0.301, 0.176, 0.125, 0.097, 0.079, 0.067, 0.058, 0.051, 0.046];
  }

  useEffect(() => {
    if (data.length) {
      const benfordDistribution = computeBenfordDistribution(data);
      setDistribution(benfordDistribution);

    } else {
      // Data is empty, so set distribution to a default value to allow axis drawing
      setDistribution(Array(9).fill(0));
      // Keep the x domain at its default setting
    }
  }, [data]);

  useEffect(() => {
    if (distribution.length) {
      const svg = d3.select(svgRef.current);

      svg.selectAll("*").remove(); // Clear previous rendering

      svg.attr("width", width).attr("height", height);

      const tooltipDiv = d3.select(tooltipRef.current);

      // Compute the Benford values in terms of the scale
      const benfordValues = idealBenfordDistribution().map((val) => x(val));

      // Create a line generator
      const lineGenerator = d3
        .line()
        .x((d) => d) // d is already scaled
        .y((_, i) => y(i + 1) + y.bandwidth() / 2) // Center the line in the middle of each band
        .curve(d3.curveMonotoneX);

      svg
        .selectAll("rect")
        .data(distribution)
        .enter()
        .append("rect")
        .attr("x", margin.left)
        .attr("y", (d, i) => y(i + 1) + 5)
        .attr("width", (d) => 0) // Initial width set to 0 for animation
        .attr("height", y.bandwidth() - 10)
        .attr("fill", (_, i) => `url(#grad${i})`)
        .transition() // Apply animation to bars
        .duration(1000) // Duration of the animation (in milliseconds)
        .attr("id", (d, i) => `bar-${i}`)
        .attr("width", (d) => x(d) - margin.left);


      // Draw the Benford's Law line
      svg
        .append("path")
        .datum(benfordValues)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5") // This creates the dotted effect
        .attr("d", lineGenerator);

      svg
        .selectAll("rect, circle")
        .on("mouseover", function (event) {
          const id = d3.select(this).attr('id');
          const index = parseInt(id.split('-')[1]);
          const dataValue = distribution[index];
          tooltipDiv
              .html(
                  `
        <div class="tooltip-content">
          <div><strong>Digit: ${index + 1}</strong></div>
          <div>Number of data: ${dataValue * data.length}</div>
          <div style="color: #2BE19F;">Data Distribution: ${d3.format(".1%")(
                      dataValue
                  )}</div>
          <div style="color: #E3E06D;">Standard Benford's Distribution: ${d3.format(
                      ".1%"
                  )(idealBenfordDistribution()[index])}</div>
        </div>
        `
              )
              .style("left", event.pageX + "px")
              .style("top", event.pageY - 28 + "px")
              .style("opacity", 1); // Make sure the tooltip is visible
        })
          .on("mouseout", function () {
            tooltipDiv.style("opacity", 0);
          });

      distribution.forEach((_, i) => {
        const grad = svg
          .append("defs")
          .append("linearGradient")
          .attr("id", `grad${i}`)
          .attr("x1", "100%")
          .attr("y1", "0%")
          .attr("x2", "0%")
          .attr("y2", "0%");

        grad
          .append("stop")
          .attr("offset", "0%")
          .style("stop-color", colorScale(i + 1));

        // grad.append("stop").attr("offset", "100%").style("stop-color", "black"); // Use a light color as the end of the gradient
      });
      // Add dots to Benford's Law line
      svg
        .selectAll(".benford-dot")
        .data(idealBenfordDistribution())
        .enter()
        .append("circle")
        .attr("class", "benford-dot")
        .attr("cx", (d) => x(d))
        .attr("cy", (d, i) => y(i + 1) + y.bandwidth() / 2)
        .attr("r", 3)
        .attr("fill", "#E3E06D");
      // Add percentages to the right of each bar
      svg
        .selectAll(".percentage-label")
        .data(distribution)
        .enter()
        .append("text")
        .attr("class", "percentage-label")
        .attr("x", (d) => x(d) + 5) // Adjust position as needed
        .attr("y", (d, i) => y(i + 1) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .style("text-anchor", "start")
        .text((d) => d3.format(".1%")(d));

      // Add numbers on the left of each bar
      svg
        .selectAll(".bar-label")
        .data(distribution)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", margin.left - 5) // Adjust position as needed
        .attr("y", (d, i) => y(i + 1) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .style("text-anchor", "end")
        .text((d, i) => i + 1); // Display the numbers 1 to 9

      // X-axis
      svg
        .append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(10, "%"))
        .call(d3.axisLeft(x).tickSize(0));
    }
  }, [distribution]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove(); // Clear previous rendering

    svg.attr("width", width).attr("height", height);

    // X-axis (empty)
    // svg
    //   .append("g")
    //   .attr("transform", `translate(0, ${height - margin.bottom})`)
    //   .call(d3.axisBottom(x).ticks(10, "%"))
    //   .call(d3.axisLeft(x).tickSize(0));
  }, []);

  return (
    <>
      <svg className="graph" ref={svgRef}></svg>
      <div className="tooltip" ref={tooltipRef}></div>
    </>
  );
};

export default Histogram;
