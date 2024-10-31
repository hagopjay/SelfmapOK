import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { ProcessedIdentityData } from '../types/identity';
import { setupScales, setupGrid, setupAxes } from '../utils/chartSetup';
import { setupGradient } from '../utils/gradientSetup';
import { calculatePosition, calculateSize } from '../utils/calculations';

interface SelfMapChartProps {
  data: ProcessedIdentityData[];
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
}

export const SelfMapChart: React.FC<SelfMapChartProps> = ({
  data,
  width,
  height,
  margin
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Clear existing SVG
    d3.select(chartRef.current).selectAll("*").remove();

    // Create SVG
    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Setup gradient
    setupGradient(svg);

    // Setup scales and axes
    const { xScale, yScale, colorScale } = setupScales(chartWidth, chartHeight);
    setupGrid(svg, xScale, yScale, chartWidth, chartHeight);
    setupAxes(svg, xScale, yScale, chartWidth, chartHeight);

    // Add connecting lines group
    const lineGroup = svg.append("g")
      .attr("class", "connections")
      .style("pointer-events", "none");

    // Add data points
    const points = svg.selectAll(".dot")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "point-group");

    // Add glow effect
    points.append("circle")
      .attr("class", "dot-glow")
      .attr("r", d => calculateSize(d.strength, chartWidth) * 2)
      .attr("cx", d => calculatePosition(d.strength, xScale))
      .attr("cy", d => calculatePosition(d.strength, yScale))
      .style("fill", "url(#point-gradient)")
      .style("opacity", 0)
      .transition()
      .duration(800)
      .style("opacity", 1);

    // Add main points
    points.append("circle")
      .attr("class", "dot")
      .attr("r", 0)
      .attr("cx", d => calculatePosition(d.strength, xScale))
      .attr("cy", d => calculatePosition(d.strength, yScale))
      .style("fill", d => colorScale(d.name))
      .style("stroke", "white")
      .style("stroke-width", "2px")
      .style("cursor", "pointer")
      .transition()
      .duration(800)
      .attr("r", d => calculateSize(d.strength, chartWidth));

    // Add interactions
    points.selectAll(".dot")
      .on("mouseover", function(event, d) {
        const tooltip = d3.select("body")
          .append("div")
          .attr("class", "fixed bg-gray-900 text-white p-4 rounded-lg shadow-xl pointer-events-none opacity-0 transition-opacity duration-300 text-sm max-w-xs z-50")
          .style("backdrop-filter", "blur(8px)");

        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", calculateSize(d.strength, chartWidth) * 1.2)
          .style("filter", "drop-shadow(0 0 8px rgba(255,255,255,0.5))");

        const centerX = calculatePosition(d.strength, xScale);
        const centerY = calculatePosition(d.strength, yScale);
        
        lineGroup.selectAll(".connection-line")
          .data(data.filter(item => item !== d))
          .join("line")
          .attr("class", "connection-line")
          .attr("x1", centerX)
          .attr("y1", centerY)
          .attr("x2", item => calculatePosition(item.strength, xScale))
          .attr("y2", item => calculatePosition(item.strength, yScale))
          .style("stroke", colorScale(d.name))
          .style("stroke-width", "1.5px")
          .style("stroke-dasharray", "4,4")
          .style("stroke-opacity", 0)
          .transition()
          .duration(300)
          .style("stroke-opacity", 0.3);

        tooltip.transition()
          .duration(200)
          .style("opacity", 1);
        
        tooltip.html(`
          <div class="space-y-2">
            <h3 class="font-bold text-base">${d.name}</h3>
            <div class="space-y-1">
              <p class="text-blue-300">Strength: ${d.strength}/10</p>
              ${d.details.Title ? `<p class="text-gray-300">Role: ${d.details.Title}</p>` : ''}
              ${d.details.Beliefs ? `<p class="text-gray-300">Beliefs: ${d.details.Beliefs}</p>` : ''}
              ${d.details.Style ? `<p class="text-gray-300">Style: ${d.details.Style}</p>` : ''}
            </div>
          </div>
        `)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`);
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", d => calculateSize(d.strength, chartWidth))
          .style("filter", null);

        lineGroup.selectAll(".connection-line")
          .transition()
          .duration(200)
          .style("stroke-opacity", 0)
          .remove();

        d3.selectAll(".fixed").remove();
      });

    // Add legend
    const legend = svg.append("g")
      .attr("transform", `translate(${chartWidth + 20}, 20)`);

    const legendItems = legend.selectAll(".legend-item")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "legend-item cursor-pointer")
      .attr("transform", (_, i) => `translate(0, ${i * 25})`);

    legendItems.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("rx", 4)
      .style("fill", d => colorScale(d.name))
      .style("opacity", 0)
      .transition()
      .duration(800)
      .style("opacity", 1);

    legendItems.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("fill", "#475569")
      .style("font-size", "12px")
      .style("opacity", 0)
      .text(d => d.name)
      .transition()
      .duration(800)
      .style("opacity", 1);

  }, [data, width, height, margin]);

  return <div ref={chartRef} className="w-full h-full" />;
};

export default SelfMapChart;