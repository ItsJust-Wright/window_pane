
import React from 'react';
import * as THREE from 'three';

const WindowFrame: React.FC = () => {
  // Simple geometry composition for a window frame
  // Aspect Ratio 3:4 (e.g. 2.25 width, 3 height)
  const frameColor = "#1a1a1a";
  const frameMaterial = new THREE.MeshStandardMaterial({ 
    color: frameColor, 
    roughness: 0.8,
    metalness: 0.2
  });

  const glassWidth = 2.25;
  const glassHeight = 3;
  const frameThickness = 0.1;
  const frameDepth = 0.2;

  const sideFramePos = (glassWidth / 2) + (frameThickness / 2);
  const topFrameWidth = glassWidth + (frameThickness * 2);

  return (
    <group>
      {/* Top Frame */}
      <mesh position={[0, (glassHeight / 2) + (frameThickness / 2), 0]} castShadow receiveShadow material={frameMaterial}>
        <boxGeometry args={[topFrameWidth, frameThickness, frameDepth]} />
      </mesh>
      
      {/* Left Frame */}
      <mesh position={[-sideFramePos, 0, 0]} castShadow receiveShadow material={frameMaterial}>
        <boxGeometry args={[frameThickness, glassHeight, frameDepth]} />
      </mesh>

      {/* Right Frame */}
      <mesh position={[sideFramePos, 0, 0]} castShadow receiveShadow material={frameMaterial}>
        <boxGeometry args={[frameThickness, glassHeight, frameDepth]} />
      </mesh>

      {/* Glass (Slightly reflective) */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[glassWidth, glassHeight]} />
        <meshPhysicalMaterial 
          color="#88ccff" 
          transmission={0.2} 
          opacity={0.1} 
          metalness={0.1} 
          roughness={0} 
          transparent 
        />
      </mesh>
    </group>
  );
};

export default WindowFrame;
