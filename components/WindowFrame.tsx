import React from 'react';
import * as THREE from 'three';

const WindowFrame: React.FC = () => {
  // Simple geometry composition for a window frame
  const frameColor = "#1a1a1a";
  const frameMaterial = new THREE.MeshStandardMaterial({ 
    color: frameColor, 
    roughness: 0.8,
    metalness: 0.2
  });

  return (
    <group>
      {/* Top Frame */}
      <mesh position={[0, 1.55, 0]} castShadow receiveShadow material={frameMaterial}>
        <boxGeometry args={[2.2, 0.1, 0.2]} />
      </mesh>
      
      {/* Bottom Frame / Sill */}
      <mesh position={[0, -1.55, 0.05]} castShadow receiveShadow material={frameMaterial}>
        <boxGeometry args={[2.4, 0.15, 0.4]} />
      </mesh>

      {/* Left Frame */}
      <mesh position={[-1.05, 0, 0]} castShadow receiveShadow material={frameMaterial}>
        <boxGeometry args={[0.1, 3, 0.2]} />
      </mesh>

      {/* Right Frame */}
      <mesh position={[1.05, 0, 0]} castShadow receiveShadow material={frameMaterial}>
        <boxGeometry args={[0.1, 3, 0.2]} />
      </mesh>

      {/* Glass (Slightly reflective) */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[2, 3]} />
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