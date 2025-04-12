import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import ConeScene from './components/ConeScene/ConeScene';
import ControlsPanel from './components/ControlsPanel/ControlPanel';
import SliceDisplay from './components/SliceDisplay/SliceDisplay';

const Animation: React.FC = () => {
  const [deltaH, setDeltaH] = useState(0.1);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [rotationAngle, setRotationAngle] = useState(0);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left Section: 3D Cone */}
      <div style={{ flex: 1 }}>
        <Canvas>
          <ConeScene
            deltaH={deltaH}
            rotationSpeed={rotationSpeed}
            setRotationAngle={setRotationAngle}
          />
        </Canvas>
      </div>

      {/* Right Section: Controls (top) and 2D Slice Display (bottom) */}
      <div style={{ width: 300, display: 'flex', flexDirection: 'column' }}>
        <ControlsPanel
          deltaH={deltaH}
          setDeltaH={setDeltaH}
          rotationSpeed={rotationSpeed}
          setRotationSpeed={setRotationSpeed}
        />
        <SliceDisplay deltaH={deltaH} />
      </div>
    </div>
  );
};

export default Animation;
