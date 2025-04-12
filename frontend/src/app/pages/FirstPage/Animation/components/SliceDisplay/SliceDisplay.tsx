import React from 'react';
import { Stage, Layer, Line } from 'react-konva';

interface SliceDisplayProps {
  deltaH: number;
}

const SliceDisplay: React.FC<SliceDisplayProps> = ({ deltaH }) => {
  // Define cone dimensions.
  const coneHeight = 2;
  const baseRadius = 1;

  // Canvas size.
  const canvasWidth = 300;
  const canvasHeight = 300;

  // Mapping functions from cone coordinates (x ∈ [-1, 1], y ∈ [0, 2]) to canvas coordinates.
  // The base (y=0) is at the bottom and the apex (y=2) is at the top.
  const mapX = (x: number) => ((x + 1) / 2) * canvasWidth;
  const mapY = (y: number) => canvasHeight - (y / coneHeight) * canvasHeight;

  // Triangle for the vertical cross-section:
  const trianglePoints = [
    mapX(-baseRadius), mapY(0),    // base left
    mapX(baseRadius), mapY(0),     // base right
    mapX(0), mapY(coneHeight),     // apex
  ];

  // Compute the number of slices.
  const nSlices = Math.floor(coneHeight / deltaH);

  // Compute points for each slice (drawn as trapezoids).
  const slices = [];
  for (let i = 0; i < nSlices; i++) {
    const yBottom = i * deltaH;
    let yTop = (i + 1) * deltaH;
    if (yTop > coneHeight) yTop = coneHeight;

    // Calculate half-width at a given height (linear interpolation).
    const halfWidthAt = (y: number) => baseRadius * (1 - y / coneHeight);
    const bottomHalf = halfWidthAt(yBottom);
    const topHalf = halfWidthAt(yTop);

    const p1 = [mapX(-bottomHalf), mapY(yBottom)]; // bottom left
    const p2 = [mapX(bottomHalf), mapY(yBottom)];  // bottom right
    const p3 = [mapX(topHalf), mapY(yTop)];          // top right
    const p4 = [mapX(-topHalf), mapY(yTop)];         // top left

    // Concat points into a flat array.
    const points = [...p1, ...p2, ...p3, ...p4];

    slices.push({ points, i });
  }

  return (
    <Stage width={canvasWidth} height={canvasHeight}>
      <Layer>
        {/* Draw the cone's cross-sectional triangle */}
        <Line points={trianglePoints} stroke="black" strokeWidth={2} closed />
        {/* Draw the slices */}
        {slices.map(({ points, i }) => (
          <Line
            key={i}
            points={points}
            closed
            stroke="gray"
            strokeWidth={1}
            fill="#ddd"
            opacity={0.6}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default SliceDisplay;
