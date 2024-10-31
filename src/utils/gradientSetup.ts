import * as d3 from 'd3';

export const setupGradient = (svg: d3.Selection<SVGGElement, unknown, null, undefined>) => {
  const defs = svg.append("defs");
  const gradient = defs.append("radialGradient")
    .attr("id", "point-gradient")
    .attr("gradientUnits", "objectBoundingBox")
    .attr("cx", "50%")
    .attr("cy", "50%")
    .attr("r", "50%")
    .attr("fx", "50%")
    .attr("fy", "50%");

  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "white")
    .attr("stop-opacity", 0.4);

  gradient.append("stop")
    .attr("offset", "50%")
    .attr("stop-color", "white")
    .attr("stop-opacity", 0.2);

  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "white")
    .attr("stop-opacity", 0);
};