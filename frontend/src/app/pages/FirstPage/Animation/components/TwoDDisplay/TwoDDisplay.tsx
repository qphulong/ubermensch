import React from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';
import styles from './TwoDDisplay.module.css';

interface TwoDDisplayProps {
  deltaH: number;
}

const TwoDDisplay: React.FC<TwoDDisplayProps> = ({ deltaH }) => {
  // Define cone dimensions
  const coneHeight = 2;
  const baseRadius = 1;

  // Canvas dimensions
  const canvasWidth = 300;
  const topMargin = 50;
  const canvasHeight = 300 + topMargin; // 350 pixels to keep triangle height at 300 pixels

  // Mapping functions
  const mapX = (x: number) => ((x + 1) / 2) * canvasWidth; // Unchanged: -1 to 1 maps to 0 to 300
  const mapY = (y: number) => canvasHeight - ((y / coneHeight) * 300); // Maps 0 to 350, 2 to 50

  // Verify mapping
  // y=0: mapY(0) = 350 - 0 = 350 (base)
  // y=2: mapY(2) = 350 - (2/2) * 300 = 350 - 300 = 50 (apex)
  // Height = 350 - 50 = 300 pixels

  // Triangle points
  const trianglePoints = [
    mapX(-baseRadius), mapY(0),    // base left: (0, 350)
    mapX(baseRadius), mapY(0),     // base right: (300, 350)
    mapX(0), mapY(coneHeight),     // apex: (150, 50)
  ];

  // Central axis points
  const axisPoints = [
    mapX(0), mapY(coneHeight),  // apex: (150, 50)
    mapX(0), mapY(0),           // base center: (150, 350)
  ];

  // Compute slices
  const nSlices = Math.floor(coneHeight / deltaH);
  const slices = [];
  for (let i = 0; i < nSlices; i++) {
    const yBottom = i * deltaH;
    let yTop = (i + 1) * deltaH;
    if (yTop > coneHeight) yTop = coneHeight;

    const halfWidthAt = (y: number) => baseRadius * (1 - y / coneHeight);
    const bottomHalf = halfWidthAt(yBottom);
    const topHalf = halfWidthAt(yTop);

    const points = [
      mapX(-bottomHalf), mapY(yBottom), // bottom left
      mapX(bottomHalf), mapY(yBottom),  // bottom right
      mapX(topHalf), mapY(yTop),        // top right
      mapX(-topHalf), mapY(yTop),       // top left
    ].flat();

    slices.push({ points, i });
  }

  return (
    <div className={styles.container}>
      <Stage width={canvasWidth} height={canvasHeight}>
        <Layer>
          {/* Title */}
          <Text
            x={0}
            y={20}
            text="Cone 2D Display"
            fontSize={20}
            align="center"
            width={canvasWidth}
          />
          
          {/* Central axis */}
          <Line points={axisPoints} stroke="black" strokeWidth={1} />
          
          {/* Triangle */}
          <Line points={trianglePoints} stroke="black" strokeWidth={2} closed />
          
          {/* Slices */}
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
    </div>
  );
};

export default TwoDDisplay;