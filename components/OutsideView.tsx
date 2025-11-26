import React, { useRef } from 'react';
import { useTexture, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const OutsideView: React.FC = () => {
  // Load texture directly from root using string path to avoid module resolution issues
  // Since Laguna.jpg is in the same directory as index.html (root), this path resolves correctly at runtime
  const texture = useTexture('./Laguna.jpg');
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const scroll = useScroll();

  useFrame(() => {
    if (materialRef.current) {
      // Dim the image brightness by 10% as we zoom out (scroll offset 0 -> 1)
      // 1.0 = full brightness, 0.9 = 90% brightness
      const brightness = 1.0 - (scroll.offset * 0.1);
      materialRef.current.color.setScalar(brightness);
    }
  });

  return (
    <group position={[0, 0, -2]}>
      {/* 
        The view plane. 
        Placed behind the window. 
        Scaled up to cover the parallax movement angles.
      */}
      <mesh>
        <planeGeometry args={[8, 12]} />
        <meshBasicMaterial 
          ref={materialRef}
          map={texture} 
          toneMapped={false} 
        />
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