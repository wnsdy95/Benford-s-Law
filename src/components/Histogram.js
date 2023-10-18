import React, { useState, useEffect, useRef } from "react";

import * as d3 from "d3";

const Histogram = ({ data }) => {
  const [distribution, setDistribution] = useState([]);
  const svgRef = useRef(null);

  const width = 500;
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };

  const x = d3
    .scaleBand()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9]) // Leading digits 1-9
    .rangeRound([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(distribution)])
    .nice()
    .rangeRound([height - margin.bottom, margin.top]);

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

  useEffect(() => {
    if (data.length) {
      const benfordDistribution = computeBenfordDistribution(data);
      setDistribution(benfordDistribution);
    }
  }, [data]);

  useEffect(() => {
    console.log(data);
    if (distribution.length) {
      const svg = d3.select(svgRef.current);

      svg.selectAll("*").remove(); // Clear previous rendering

      svg.attr("width", width).attr("height", height);

      // Bars
      svg
        .selectAll("rect")
        .data(distribution)
        .enter()
        .append("rect")
        .attr("x", (d, i) => x(i + 1))
        .attr("y", (d) => y(d))
        .attr("width", x.bandwidth())
        .attr("height", (d) => y(0) - y(d))
        .attr("fill", "steelblue");

      // X-axis
      svg
        .append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

      // Y-axis
      svg
        .append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).ticks(10, "%"));
    }
  }, [distribution]);

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

  return <svg ref={svgRef}></svg>;
};

export default Histogram;
