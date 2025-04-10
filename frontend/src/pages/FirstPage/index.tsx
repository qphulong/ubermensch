import React, { useState, useRef } from "react";
import * as d3 from "d3";
import styles from "./FirstPage.module.css";

const FirstPage: React.FC = () => {
  // SVG dimensions and margins
  const width = 600;
  const height = 600;
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };

  // Define the coordinate domains:
  // x in [-10, 10] and y in [0, 100] (since y=x² and max at x=±10 is 100)
  const xDomain: [number, number] = [-10, 10];
  const yDomain: [number, number] = [0, 100];

  // Create d3 scales for converting between data and screen coordinates.
  const xScale = d3.scaleLinear().domain(xDomain).range([margin.left, width - margin.right]);
  const yScale = d3.scaleLinear().domain(yDomain).range([height - margin.bottom, margin.top]); // y is flipped

  // Initial position on the parabola (x value only, y is computed as x^2)
  const [xVal, setXVal] = useState(2); // initial point: (2, 4)
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // When dragging starts on the circle
  const handleMouseDown = (event: React.MouseEvent) => {
    event.stopPropagation();
    setDragging(true);
  };

  // Handle dragging on the SVG: update the x value according to the mouse X, then calculate y = x².
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!dragging || !svgRef.current) return;

    const { left } = svgRef.current.getBoundingClientRect();
    const mouseX = event.clientX - left;
    // Convert mouse x position to domain value
    let newX = xScale.invert(mouseX);
    // Clamp newX to the x domain.
    newX = Math.max(xDomain[0], Math.min(xDomain[1], newX));
    setXVal(newX);
  };

  // End dragging on mouse up or when leaving the SVG area
  const handleMouseUp = () => {
    setDragging(false);
  };

  // Compute the y value on the parabola.
  const yVal = xVal * xVal;

  // Convert point (xVal, yVal) to SVG coordinates.
  const cx = xScale(xVal);
  const cy = yScale(yVal);

  // Generate the parabola path by sampling many x values in the domain.
  const parabolaData = d3.range(xDomain[0], xDomain[1], 0.1).map(x => [xScale(x), yScale(x * x)]);
  const parabolaPath = "M" + parabolaData.map(p => p.join(",")).join(" L");

  return (
    <div className={styles.container}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className={styles.svg}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* X-axis */}
        <line
          x1={margin.left}
          y1={yScale(0)}
          x2={width - margin.right}
          y2={yScale(0)}
          stroke="black"
        />
        {/* Y-axis */}
        <line
          x1={xScale(0)}
          y1={margin.top}
          x2={xScale(0)}
          y2={height - margin.bottom}
          stroke="black"
        />
        {/* Draw the parabola y = x^2 */}
        <path
          d={parabolaPath}
          fill="none"
          stroke="blue"
          strokeWidth={2}
        />
        {/* Draggable point on the parabola */}
        <circle
          cx={cx}
          cy={cy}
          r={8}
          fill="red"
          stroke="black"
          strokeWidth={1}
          onMouseDown={handleMouseDown}
          style={{ cursor: "grab" }}
        />
        {/* Vertical guide line from the point to the x-axis */}
        <line
          x1={cx}
          y1={cy}
          x2={cx}
          y2={yScale(0)}
          stroke="gray"
          strokeDasharray="5,5"
        />
        {/* Horizontal guide line from the point to the y-axis */}
        <line
          x1={cx}
          y1={cy}
          x2={xScale(0)}
          y2={cy}
          stroke="gray"
          strokeDasharray="5,5"
        />
      </svg>
    </div>
  );
};

export default FirstPage;
