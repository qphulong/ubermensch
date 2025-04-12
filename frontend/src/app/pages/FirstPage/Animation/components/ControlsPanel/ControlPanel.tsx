import React from 'react';

interface ControlsPanelProps {
  deltaH: number;
  setDeltaH: (v: number) => void;
  rotationSpeed: number;
  setRotationSpeed: (v: number) => void;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  deltaH,
  setDeltaH,
  rotationSpeed,
  setRotationSpeed,
}) => {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <label>Δh: {deltaH.toFixed(2)}</label>
        <input
          type="range"
          min={0.01}
          max={0.5}
          step={0.01}
          value={deltaH}
          onChange={(e) => setDeltaH(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Rotation Speed: {rotationSpeed.toFixed(2)}</label>
        <input
          type="range"
          min={0}
          max={5}
          step={0.1}
          value={rotationSpeed}
          onChange={(e) => setRotationSpeed(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default ControlsPanel;
