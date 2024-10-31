import * as d3 from 'd3';

export const setupScales = (width: number, height: number) => {
  const xScale = d3.scaleLinear()
    .domain([-10, 10])
    .range([0, width])
    .nice();

  const yScale = d3.scaleLinear()
    .domain([-10, 10])
    .range([height, 0])
    .nice();

  const colorScale = d3.scaleOrdinal<string>()
    .range([
      '#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea',
      '#0891b2', '#be185d', '#15803d', '#b91c1c', '#7c3aed'
    ]);

  return { xScale, yScale, colorScale };
};

export const setupGrid = (
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  width: number,
  height: number
) => {
  const gridColor = '#e5e7eb';

  svg.append("g")
    .attr("class", "grid horizontal")
    .attr("transform", `translate(0, ${height/2})`)
    .call(d3.axisBottom(xScale)
      .ticks(10)
      .tickSize(-height)
      .tickFormat(() => '')
    )
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line")
      .attr("stroke", gridColor)
      .attr("stroke-opacity", 0.5)
    );

  svg.append("g")
    .attr("class", "grid vertical")
    .attr("transform", `translate(${width/2}, 0)`)
    .call(d3.axisLeft(yScale)
      .ticks(10)
      .tickSize(-width)
      .tickFormat(() => '')
    )
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line")
      .attr("stroke", gridColor)
      .attr("stroke-opacity", 0.5)
    );
};

export const setupAxes = (
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  width: number,
  height: number
) => {
  const xAxis = d3.axisBottom(xScale)
    .tickSize(-5)
    .tickPadding(10)
    .ticks(5);

  const yAxis = d3.axisLeft(yScale)
    .tickSize(-5)
    .tickPadding(10)
    .ticks(5);

  svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${height/2})`)
    .call(xAxis)
    .call(g => g.select(".domain").attr("stroke", "#94a3b8"))
    .call(g => g.selectAll(".tick text")
      .attr("fill", "#64748b")
      .style("font-size", "12px")
    );

  svg.append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${width/2}, 0)`)
    .call(yAxis)
    .call(g => g.select(".domain").attr("stroke", "#94a3b8"))
    .call(g => g.selectAll(".tick text")
      .attr("fill", "#64748b")
      .style("font-size", "12px")
    );
};