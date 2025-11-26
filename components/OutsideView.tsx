import React from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const OutsideView: React.FC = () => {
  // Using the raw GitHub URL for your Laguna image
  const texture = useTexture(
    'https://raw.githubusercontent.com/ItsJust-Wright/window_pane/main/window_pane/Laguna.jpg'
  );

  return (
    <group position={[0, 0, -2]}>
      <mesh>
        <planeGeometry args={[8, 12]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[8, 12]} />
        <meshBasicMaterial 
          color="#000010" 
          transparent 
          opacity={0.3} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>
    </group>
  );
};

export default OutsideView;
