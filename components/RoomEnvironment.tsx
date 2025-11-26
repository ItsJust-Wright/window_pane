
import React from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const RoomEnvironment: React.FC = () => {
  // Simple materials for the room
  const wallMaterial = new THREE.MeshStandardMaterial({ color: '#1a1a20' });
  const floorMaterial = new THREE.MeshStandardMaterial({ color: '#2a2a35' });

  // Window frame dimensions calculations
  const windowWidth = 2.25;
  const frameThickness = 0.1;
  const totalWindowWidth = windowWidth + (frameThickness * 2); // ~2.45
  const halfWindowWidth = totalWindowWidth / 2; // ~1.225

  return (
    <group>
      {/* Wall containing the window */}
      
      {/* Left side of window */}
      {/* Positioned so right edge touches window frame */}
      {/* Plane width 5. Center = -(halfWindow + 2.5) */}
      <mesh position={[-(halfWindowWidth + 2.5), 0, -0.1]} receiveShadow material={wallMaterial}>
        <planeGeometry args={[5, 6]} />
      </mesh>
      
      {/* Right side of window */}
      <mesh position={[(halfWindowWidth + 2.5), 0, -0.1]} receiveShadow material={wallMaterial}>
        <planeGeometry args={[5, 6]} />
      </mesh>
      
      {/* Top of window */}
      <mesh position={[0, 3.05, -0.1]} receiveShadow material={wallMaterial}>
        <planeGeometry args={[totalWindowWidth, 3]} />
      </mesh>
      
      {/* Bottom of window (wall below sill) */}
      <mesh position={[0, -3.05, -0.1]} receiveShadow material={wallMaterial}>
        <planeGeometry args={[totalWindowWidth, 3]} />
      </mesh>

      {/* Floor */}
      <mesh position={[0, -3, 5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={floorMaterial}>
        <planeGeometry args={[20, 20]} />
      </mesh>

      {/* Rug (Decorative) */}
      <mesh position={[0, -2.99, 4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial color="#4a3b3b" roughness={1} />
      </mesh>
      
      {/* Side Walls to enclose the space somewhat */}
      <mesh position={[-6, 0, 5]} rotation={[0, Math.PI / 2, 0]} material={wallMaterial}>
        <planeGeometry args={[20, 10]} />
      </mesh>
       <mesh position={[6, 0, 5]} rotation={[0, -Math.PI / 2, 0]} material={wallMaterial}>
        <planeGeometry args={[20, 10]} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 5, 5]} rotation={[Math.PI / 2, 0, 0]} material={wallMaterial}>
         <planeGeometry args={[20, 20]} />
      </mesh>
    </group>
  );
};

export default RoomEnvironment;
