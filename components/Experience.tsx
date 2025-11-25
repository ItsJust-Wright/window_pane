import React from 'react';
import { ScrollControls } from '@react-three/drei';
import SceneContent from './SceneContent';

const Experience: React.FC = () => {
  return (
    <ScrollControls pages={4} damping={0.2}>
      {/* 
        ScrollControls creates a virtual scroll container. 
        'pages' determines how much scroll distance is available.
        'damping' adds physics-based smoothing to the scroll value.
      */}
      <SceneContent />
    </ScrollControls>
  );
};

export default Experience;