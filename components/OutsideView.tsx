import React from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const OutsideView: React.FC = () => {
  // Using a reliable unsplash source for a night city view
  // ID: 1519501025264-65ba15a82390 is a nice rainy night city
  const texture = useTexture('https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80');

  return (
    <group position={[0, 0, -2]}>
      {/* 
        The view plane. 
        Placed behind the window. 
        Scaled up to cover the parallax movement angles.
      */}
      <mesh>
        <planeGeometry args={[8, 12]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      
      {/* Distant fog/glow to blend edges if needed */}
      <mesh position={[0, 0, 0.1]}>
         <planeGeometry args={[8, 12]} />
         <meshBasicMaterial color="#000010" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

export default OutsideView;