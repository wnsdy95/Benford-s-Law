import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./Histogram.css";

const Histogram = ({ data }) => {
  const [distribution, setDistribution] = useState([]);
  const svgRef = useRef(null);

  const width = 500;
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };

  const colorScale = d3.scaleLinear()
    .domain([1, 9])  // Assuming you have 9 categories
    .range(["#ff0000", "#0000ff"]);

  const y = d3
    .scaleBand()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9]) // Leading digits 1-9
    .range([margin.top, height - margin.bottom]) // Adjusted the range
    .padding(0.1);

  const x = d3
    .scaleLinear()
    .domain([0, d3.max(distribution)])
    .nice()
    .rangeRound([margin.left, width - margin.right]);

  function computeBenfordDistribution(data) {
    const totalCount = data.length;
    const distribution = Array(9).fill(0);

    data.forEach((value) => {
      const leadingDigit = parseInt(String(value)[0]);
      if (leadingDigit > 0) {
        distribution[leadingDigit - 1] += 1;
      }
    });

    return distribution.map((count) => count / totalCount);
  }

  function idealBenfordDistribution() {
    return [0.301, 0.176, 0.125, 0.097, 0.079, 0.067, 0.058, 0.051, 0.046];
  }

  useEffect(() => {
    if (data.length) {
      const benfordDistribution = computeBenfordDistribution(data);
      setDistribution(benfordDistribution);
    }
  }, [data]);

  useEffect(() => {
    if (distribution.length) {
      const svg = d3.select(svgRef.current);

      svg.selectAll("*").remove(); // Clear previous rendering

      svg.attr("width", width).attr("height", height);

      // Bars with animation
      svg
        .selectAll("rect")
        .data(distribution)
        .enter()
        .append("rect")
        .attr("x", margin.left)
        .attr("y", (d, i) => y(i + 1))
        .attr("width", (d) => 0) // Initial width set to 0 for animation
        .attr("height", y.bandwidth())
        .attr("fill", (_, i) => `url(#grad${i})`)
        .transition() // Apply animation to bars
        .duration(1000) // Duration of the animation (in milliseconds)
        .attr("width", (d) => x(d) - margin.left);

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

        grad
          .append("stop")
          .attr("offset", "100%")
          .style("stop-color", "#ffffff"); // Use a light color as the end of the gradient
      });

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
        .attr("fill", "orange");

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

  return <svg ref={svgRef}></svg>;
};

export default Histogram;
