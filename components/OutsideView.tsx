
import React, { useRef } from 'react';
import { useTexture, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const OutsideView: React.FC = () => {
  // Use the Raw GitHub URL to load the image reliably across environments
  // This bypasses local file path resolution issues
  const textureUrl = 'https://raw.githubusercontent.com/ItsJust-Wright/window_pane/main/public/Laguna.jpg';
  
  const texture = useTexture(textureUrl);
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
        Scaled to 9x12 (Ratio 0.75 or 3:4) to match the Laguna.jpg dimensions (3024x4032).
        This prevents distortion and cropping.
      */}
      <mesh>
        <planeGeometry args={[9, 12]} />
        <meshBasicMaterial 
          ref={materialRef}
          map={texture} 
          toneMapped={false} 
        />
      </mesh>
      
      {/* Distant fog/glow to blend edges if needed */}
      <mesh position={[0, 0, 0.1]}>
         <planeGeometry args={[9, 12]} />
         <meshBasicMaterial color="#000010" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

export default OutsideView;
