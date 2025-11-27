
import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, Environment } from '@react-three/drei';
import * as THREE from 'three';
import Curtains from './Curtains';
import WindowFrame from './WindowFrame';
import OutsideView from './OutsideView';
import RoomEnvironment from './RoomEnvironment';
import Table from './Table';

const SceneContent: React.FC = () => {
  const scroll = useScroll();
  const { camera } = useThree();
  
  // Refs for animation targeting if needed
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // scroll.offset is a value between 0 and 1
    const r = scroll.offset;

    // Define Camera Keyframes
    // Initial Position (Zoomed in on window): [0, 0, 1.2]
    // Phase 1 (0 to 0.25): Linear Zoom Out.
    // Phase 2 (0.25 to 1.0): Zoom further, Move Down (Pedestal), and Look Down (Tilt).

    // Interpolation Configuration
    const startZ = 1.2;
    const midZ = 3.5;
    const finalZ = 5.5;
    
    const startY = 0;
    const finalY = -1.0; // Move down, but keep some height to look down at table
    
    const startXRot = 0;
    const finalXRot = -0.1; // Rotate x-axis to look down at the table
    
    // Calculate current target position based on scroll
    let targetZ = startZ;
    let targetY = startY;
    let targetXRotation = startXRot;

    if (r <= 0.25) {
      // Phase 1: Linear zoom (0% to 25%)
      const phaseProgress = r / 0.25; 
      targetZ = THREE.MathUtils.lerp(startZ, midZ, phaseProgress);
      targetY = startY;
      targetXRotation = startXRot;
    } else {
      // Phase 2: Pan/Tilt down and Zoom out (25% to 100%)
      const phaseProgress = (r - 0.25) / 0.75;
      
      // Smooth step for nicer ease-in-out feel
      const smoothProgress = phaseProgress * phaseProgress * (3 - 2 * phaseProgress);

      targetZ = THREE.MathUtils.lerp(midZ, finalZ, smoothProgress);
      targetY = THREE.MathUtils.lerp(startY, finalY, smoothProgress);
      targetXRotation = THREE.MathUtils.lerp(startXRot, finalXRot, smoothProgress);
    }

    // --- Parallax Effect ---
    // Only active when we have zoomed out significantly
    const parallaxStrength = 0.05; 
    const parallaxRamp = THREE.MathUtils.smoothstep(r, 0.2, 1.0);
    
    const lookX = -state.pointer.x * parallaxStrength * parallaxRamp;
    const lookY = state.pointer.y * parallaxStrength * parallaxRamp;

    // Smoothly damp the camera position and rotation to the targets
    // We use a lerp factor (dampSpeed)
    const dampSpeed = 3.0;

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * dampSpeed);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, delta * dampSpeed);
    
    // Apply rotation targets plus parallax
    // We target the base rotation + the mouse look offset
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetXRotation + lookY, delta * dampSpeed);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, lookX, delta * dampSpeed);
  });

  return (
    <>
      <color attach="background" args={['#050505']} />
      
      {/* Lighting */}
      <ambientLight intensity={0.1} color="#b0c4de" />
      <pointLight position={[2, 3, 2]} intensity={0.5} color="#ffaa88" distance={10} decay={2} />
      <pointLight position={[-2, 1, 3]} intensity={0.3} color="#ccddff" distance={10} decay={2} />
      
      {/* The Room Group */}
      <group ref={groupRef}>
        <OutsideView />
        <WindowFrame />
        <Curtains />
        <Table />
        <RoomEnvironment />
      </group>

      {/* Environment reflections */}
      <Environment preset="night" />
    </>
  );
};

export default SceneContent;
