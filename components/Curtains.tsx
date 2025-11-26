
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Vertex Shader: Creates a wind ripple effect
const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uSide; // 1.0 for right, -1.0 for left

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Calculate movement intensity based on vertical position
    // 1.0 at the bottom (uv.y = 0), 0.0 at the top (uv.y = 1)
    // This pins the top vertices in place to prevent clipping into the frame/ceiling
    float movementIntensity = smoothstep(0.0, 1.0, 1.0 - uv.y);

    // Add gentle wind movement
    // Higher frequency on Y, lower amplitude
    float wave1 = sin(uv.y * 5.0 - uTime * 0.8) * 0.1;
    float wave2 = cos(uv.y * 12.0 - uTime * 1.5) * 0.02;
    
    // Displacement primarily on Z axis to simulate cloth billowing
    pos.z += (wave1 + wave2) * movementIntensity; 
    
    // Slight X movement
    pos.x += sin(uv.y * 3.0 - uTime * 0.5) * 0.05 * uSide * movementIntensity;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Fragment Shader: Silk-like material
const fragmentShader = `
  varying vec2 vUv;
  
  void main() {
    // Simple white silk with slight opacity gradient
    float opacity = 0.9 + 0.1 * sin(vUv.y * 20.0);
    
    // Add a fake fold shadow based on UV
    float fold = sin(vUv.x * 20.0) * 0.1;
    vec3 color = vec3(0.95, 0.95, 1.0) - vec3(fold);
    
    gl_FragColor = vec4(color, 0.9); // Slight transparency
  }
`;

const CurtainSide: React.FC<{ side: 'left' | 'right'; position: [number, number, number] }> = ({ side, position }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSide: { value: side === 'right' ? 1.0 : -1.0 }
  }), [side]);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[0, side === 'right' ? -0.1 : 0.1, 0]}>
      {/* High segment count for smooth vertex displacement */}
      <planeGeometry args={[1.3, 3.5, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const Curtains: React.FC = () => {
  return (
    // Z moved to 0.35 to clear the window frame and sill
    // Y moved to -0.15 to align top of curtains with the top frame
    <group position={[0, -0.15, 0.35]}>
      {/* Left Curtain - Moved further left for wider window */}
      <CurtainSide side="left" position={[-1.35, 0, 0]} />
      
      {/* Right Curtain - Moved further right for wider window */}
      <CurtainSide side="right" position={[1.35, 0, 0]} />
    </group>
  );
};

export default Curtains;
