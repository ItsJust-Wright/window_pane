
import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

// Props interface including new interactive props
interface PhotoFrameProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  texture?: THREE.Texture | null;
  onClick?: () => void;
  children?: React.ReactNode;
}

const PhotoFrame: React.FC<PhotoFrameProps> = ({ 
  position, 
  rotation = [0, 0, 0], 
  scale = 1,
  texture,
  onClick,
  children
}) => {
  const frameMaterial = new THREE.MeshStandardMaterial({ 
    color: '#1a1a1a', 
    roughness: 0.4,
    metalness: 0.6
  });
  
  // Base photo material (placeholder)
  const defaultPhotoMaterial = new THREE.MeshStandardMaterial({ 
    color: '#e0e0e0', 
    roughness: 0.2 
  });

  const backStandMaterial = new THREE.MeshStandardMaterial({
    color: '#0a0a0a',
    roughness: 0.8
  });

  // If a texture is provided, creating a material for it
  const photoMaterial = texture 
    ? new THREE.MeshBasicMaterial({ map: texture }) 
    : defaultPhotoMaterial;

  const [hovered, setHovered] = useState(false);

  return (
    <group 
      position={position} 
      rotation={rotation} 
      scale={scale}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      onPointerOver={() => onClick && setHovered(true)}
      onPointerOut={() => onClick && setHovered(false)}
    >
      {/* Main Frame */}
      <mesh castShadow receiveShadow material={frameMaterial}>
        <boxGeometry args={[0.35, 0.45, 0.03]} />
      </mesh>

      {/* Photo Surface */}
      <mesh position={[0, 0, 0.016]} material={photoMaterial}>
        <planeGeometry args={[0.28, 0.38]} />
      </mesh>

      {/* Back Support Leg */}
      <mesh position={[0, -0.05, -0.1]} rotation={[-0.3, 0, 0]} castShadow material={backStandMaterial}>
        <boxGeometry args={[0.1, 0.3, 0.02]} />
      </mesh>

      {/* Cursor feedback for interactive frame */}
      {hovered && (
         <pointLight position={[0, 0, 0.2]} intensity={0.5} color="white" distance={0.5} />
      )}

      {/* Children (Countdown Text) */}
      {children}
    </group>
  );
};

interface CakeProps {
  position: [number, number, number];
  isOpen: boolean;
}

const Cake: React.FC<CakeProps> = ({ position, isOpen }) => {
  const lidGroupRef = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Animate Lid Opening
    if (lidGroupRef.current) {
      const targetRotation = isOpen ? -Math.PI / 1.8 : 0;
      lidGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        lidGroupRef.current.rotation.x,
        targetRotation,
        delta * 2
      );
    }

    // Animate Text Rising
    if (textRef.current) {
      const targetY = isOpen ? 0.6 : 0.1;
      const targetScale = isOpen ? 1 : 0;
      
      textRef.current.position.y = THREE.MathUtils.lerp(textRef.current.position.y, targetY, delta * 2);
      
      const currentScale = textRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 2);
      textRef.current.scale.set(newScale, newScale, newScale);
    }
  });

  return (
    <group position={position}>
      {/* Cake Base - Sponge (Main Body) */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#f2d2bd" roughness={0.4} />
      </mesh>

      {/* Hidden Message inside the cake */}
      <group ref={textRef} position={[0, 0.1, 0]} scale={[0, 0, 0]}>
        <Text
          fontSize={0.25}
          color="#ffcc00"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#b8860b"
        >
          Happy Anniversary
        </Text>
      </group>

      {/* The "Lid" Group (Frosting + Candles) 
          Pivots from the back edge (z = -0.25 approx)
      */}
      <group ref={lidGroupRef} position={[0, 0.2, -0.25]}>
        {/* We offset everything inside by +0.25 on Z so it aligns with the base 
            while the group origin is at the hinge point */}
        <group position={[0, 0, 0.25]}>
          
          {/* Top Frosting */}
          <mesh position={[0, 0.001, 0]} receiveShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.01, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>

          {/* Candles Group */}
          {[0, 1, 2].map((i) => {
            const angle = (i / 3) * Math.PI * 2;
            const radius = 0.18;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            return (
              <group key={i} position={[x, 0, z]}>
                {/* Candle Stick */}
                <mesh position={[0, 0.08, 0]} castShadow>
                  <cylinderGeometry args={[0.015, 0.015, 0.16, 12]} />
                  <meshStandardMaterial color={['#ff69b4', '#69b4ff', '#b4ff69'][i]} />
                </mesh>
                
                {/* Flame (Visual) */}
                <mesh position={[0, 0.18, 0]}>
                  <sphereGeometry args={[0.015, 8, 8]} />
                  <meshBasicMaterial color="#ffaa00" />
                </mesh>
              </group>
            );
          })}

          {/* Glow Effect attached to Lid so it moves with candles */}
          <pointLight 
            position={[0, 0.25, 0]} 
            intensity={1.5} 
            color="#ffaa33" 
            distance={2.5} 
            decay={2}
          />
        </group>
      </group>

    </group>
  );
};

const Table: React.FC = () => {
  const woodMaterial = new THREE.MeshStandardMaterial({ 
    color: '#5c4033', 
    roughness: 0.6,
    metalness: 0.1 
  });
  
  const windowWidth = 2.25; 
  const tableWidth = windowWidth * 2; 
  const tableDepth = 1.2;
  const tableHeightFromFloor = 1.2;
  const topThickness = 0.08;
  const tableSurfaceY = tableHeightFromFloor;
  const frameY = tableSurfaceY + 0.225 - 0.005;

  // Camera State
  const [capturedTexture, setCapturedTexture] = useState<THREE.Texture | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCameraClick = async () => {
    if (isProcessing || countdown !== null || capturedTexture) return;

    try {
      setIsProcessing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Create hidden video element to read stream
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      setCountdown(10);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            capturePhoto(video, stream);
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);

    } catch (err) {
      console.error("Error accessing camera:", err);
      setIsProcessing(false);
      setCountdown(null);
    }
  };

  const capturePhoto = (video: HTMLVideoElement, stream: MediaStream) => {
    // Create canvas to handle crop
    const canvas = document.createElement('canvas');
    // Desired vertical resolution (e.g. 0.28/0.38 aspect ratio ~ 0.73)
    const targetW = 480;
    const targetH = 640; 
    canvas.width = targetW;
    canvas.height = targetH;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Calculate crop from horizontal video to vertical frame
      // Video is usually 640x480 (4:3) or 1280x720 (16:9)
      const vidW = video.videoWidth;
      const vidH = video.videoHeight;
      const vidAspect = vidW / vidH;
      const targetAspect = targetW / targetH; // < 1 (Vertical)

      let drawW, drawH, offsetX, offsetY;

      // Crop center logic
      // Since video is wider than target vertical frame, we match height and crop width
      drawH = vidH;
      drawW = vidH * targetAspect;
      offsetX = (vidW - drawW) / 2;
      offsetY = 0;

      ctx.drawImage(video, offsetX, offsetY, drawW, drawH, 0, 0, targetW, targetH);
      
      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      // Flip Y if needed usually for WebGL, but CanvasTexture handles it usually. 
      // Sometimes ThreeJS textures from canvas need color space update
      texture.colorSpace = THREE.SRGBColorSpace;
      
      setCapturedTexture(texture);
    }

    // Stop camera
    stream.getTracks().forEach(track => track.stop());
    setIsProcessing(false);
  };

  return (
    <group position={[0, -3, 1.0]}>
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
         <mesh position={[-tableWidth/2 + 0.2, 0, tableDepth/2 - 0.2]} castShadow receiveShadow material={woodMaterial}>
            <boxGeometry args={[0.08, tableHeightFromFloor - topThickness, 0.08]} />
         </mesh>
         <mesh position={[tableWidth/2 - 0.2, 0, tableDepth/2 - 0.2]} castShadow receiveShadow material={woodMaterial}>
            <boxGeometry args={[0.08, tableHeightFromFloor - topThickness, 0.08]} />
         </mesh>
         <mesh position={[-tableWidth/2 + 0.2, 0, -tableDepth/2 + 0.2]} castShadow receiveShadow material={woodMaterial}>
            <boxGeometry args={[0.08, tableHeightFromFloor - topThickness, 0.08]} />
         </mesh>
         <mesh position={[tableWidth/2 - 0.2, 0, -tableDepth/2 + 0.2]} castShadow receiveShadow material={woodMaterial}>
            <boxGeometry args={[0.08, tableHeightFromFloor - topThickness, 0.08]} />
         </mesh>
      </group>

      <Cake 
        position={[0, tableSurfaceY, 0]} 
        isOpen={!!capturedTexture} 
      />

      {/* Picture Frames */}
      <group>
        {/* Left Pair */}
        <PhotoFrame 
          position={[-1.7, frameY, 0.25]} 
          rotation={[-0.15, 0.35, 0]} 
        />
        <PhotoFrame 
          position={[-1.25, frameY, 0.1]} 
          rotation={[-0.15, 0.1, 0]} 
        />

        {/* Right Pair */}
        <PhotoFrame 
          position={[1.3, frameY, 0.1]} 
          rotation={[-0.15, -0.05, 0]} 
        />
        
        {/* 4th Frame - Interactive */}
        <PhotoFrame 
          position={[1.85, frameY, 0.3]} 
          rotation={[-0.15, -0.4, 0]}
          onClick={handleCameraClick}
          texture={capturedTexture}
        >
          {countdown !== null && (
            <Text
              position={[0, 0, 0.03]} // Just in front of the photo
              fontSize={0.2}
              color="#ff3333"
              anchorX="center"
              anchorY="middle"
            >
              {countdown}
            </Text>
          )}
        </PhotoFrame>
      </group>
    </group>
  );
};

export default Table;
