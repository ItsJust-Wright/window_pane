import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import Curtains from './Curtains';
import WindowFrame from './WindowFrame';
import OutsideView from './OutsideView';
import RoomEnvironment from './RoomEnvironment';

const SceneContent: React.FC = () => {
  const scroll = useScroll();
  const { camera } = useThree();
  
  // Refs for animation targeting if needed
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // scroll.offset is a value between 0 and 1
    const r = scroll.offset;

    // Define Camera Keyframes
    // Initial Position (Zoomed in on window): [0, 0, 1.5]
    // Phase 1 (0 to 0.25): Linear Zoom Out to reveal curtains. Target Z: 5
    // Phase 2 (0.25 to 1.0): Pan Down and Zoom further back. Target Y: -2, Target Z: 8

    // Interpolation Logic
    const startZ = 1.2;
    const midZ = 4.5;
    const finalZ = 7.0;
    
    const startY = 0;
    const finalY = -1.5; // Pan down to show floor/rug
    
    // Calculate current target position based on scroll
    let targetZ = startZ;
    let targetY = startY;
    let targetXRotation = 0;

    if (r <= 0.25) {
      // Linear zoom phase (0% to 25%)
      // Normalize r to 0-1 for this phase
      const phaseProgress = r / 0.25; 
      targetZ = THREE.MathUtils.lerp(startZ, midZ, phaseProgress);
      targetY = startY; // Stay centered
    } else {
      // Pan down phase (25% to 100%)
      const phaseProgress = (r - 0.25) / 0.75;
      
      // Smooth step for nicer ease-in-out feel on the second phase
      const smoothProgress = phaseProgress * phaseProgress * (3 - 2 * phaseProgress);

      targetZ = THREE.MathUtils.lerp(midZ, finalZ, smoothProgress);
      targetY = THREE.MathUtils.lerp(startY, finalY, smoothProgress);
    }

    // --- Parallax Effect ---
    // Only active when we have zoomed out significantly to avoid disorientation close up
    const parallaxStrength = 0.05; // Maximum rotation in radians
    const parallaxRamp = THREE.MathUtils.smoothstep(r, 0.2, 1.0); // Ramp up effect as we zoom out
    
    // state.pointer gives normalized coordinates (-1 to 1)
    const lookX = -state.pointer.x * parallaxStrength * parallaxRamp;
    const lookY = state.pointer.y * parallaxStrength * parallaxRamp;

    // Smoothly damp the camera position to the target for extra buttery feel
    camera.position.z = targetZ;
    camera.position.y = targetY;
    
    // Apply rotation with parallax
    // Note: We add parallax to the base rotation (which is currently 0)
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, lookX, delta * 2);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetXRotation + lookY, delta * 2);

    // Subtle floating effect for the whole room to make it feel "dreamy" 
    // We apply this to the group, but very subtly inversely to scroll to ground it when zoomed out?
    // Actually, let's keep it static for stability, Float component handles objects.
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
        
        {/* The Outside View (Sky/City) */}
        <OutsideView />

        {/* The Window Frame */}
        <WindowFrame />

        {/* The Curtains */}
        <Curtains />

        {/* The Room Walls/Floor */}
        <RoomEnvironment />

      </group>

      {/* Environment reflections for shiny objects */}
      <Environment preset="night" />
    </>
  );
};

export default SceneContent;