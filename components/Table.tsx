import React from 'react';
import * as THREE from 'three';

const Table: React.FC = () => {
  // Rich dark wood material
  const woodMaterial = new THREE.MeshStandardMaterial({ 
    color: '#5c4033', 
    roughness: 0.6,
    metalness: 0.1 
  });
  
  // Dimensions
  const windowWidth = 2.2;
  const tableWidth = windowWidth * 2; // Twice the window length (width)
  const tableDepth = 1.2;
  
  // Vertical positioning
  // Floor is at Y = -3
  // Window bottom was roughly Y = -1.5
  // We want the table top slightly below that, say Y = -1.8
  const tableTopY = -1.8;
  const tableHeightFromFloor = tableTopY - (-3); // ~1.2 units high
  const topThickness = 0.08;
  
  // Z Positioning
  // Window wall is Z = -0.1
  // Curtains are Z = 0.35
  // We place the table in front of curtains so they hang behind it
  // Table Back Edge at Z = 0.4
  // Table Center Z = 0.4 + (Depth/2) = 1.0
  const zPosition = 1.0;

  return (
    <group position={[0, -3, zPosition]}>
      {/* Table Top */}
      <mesh 
        position={[0, tableHeightFromFloor - topThickness/2, 0]} 
        castShadow 
        receiveShadow 
        material={woodMaterial}
      >
        <boxGeometry args={[tableWidth, topThickness, tableDepth]} />
      </mesh>

      {/* Legs */}
      <group position={[0, (tableHeightFromFloor - topThickness)/2, 0]}>
         {/* Front Left */}
         <mesh position={[-tableWidth/2 + 0.2, 0, tableDepth/2 - 0.2]} castShadow receiveShadow material={woodMaterial}>
            <boxGeometry args={[0.08, tableHeightFromFloor - topThickness, 0.08]} />
         </mesh>
         
         {/* Front Right */}
         <mesh position={[tableWidth/2 - 0.2, 0, tableDepth/2 - 0.2]} castShadow receiveShadow material={woodMaterial}>
            <boxGeometry args={[0.08, tableHeightFromFloor - topThickness, 0.08]} />
         </mesh>

         {/* Back Left */}
         <mesh position={[-tableWidth/2 + 0.2, 0, -tableDepth/2 + 0.2]} castShadow receiveShadow material={woodMaterial}>
            <boxGeometry args={[0.08, tableHeightFromFloor - topThickness, 0.08]} />
         </mesh>

         {/* Back Right */}
         <mesh position={[tableWidth/2 - 0.2, 0, -tableDepth/2 + 0.2]} castShadow receiveShadow material={woodMaterial}>
            <boxGeometry args={[0.08, tableHeightFromFloor - topThickness, 0.08]} />
         </mesh>
      </group>
    </group>
  );
};

export default Table;