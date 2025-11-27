
import React, { useRef, useEffect, useState } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const OutsideView: React.FC = () => {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const scroll = useScroll();
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    
    // We use JSDelivr to fetch the image from your GitHub repo.
    // JSDelivr adds the necessary CORS headers that raw GitHub links are missing.
    const gitHubImage = 'https://cdn.jsdelivr.net/gh/ItsJust-Wright/window_pane@main/public/background.jpg';
    
    // Fallback in case the GitHub image hasn't propagated or is renamed
    const fallbackImage = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2613&auto=format&fit=crop';

    loader.crossOrigin = "Anonymous";

    loader.load(
      gitHubImage,
      (loadedTexture) => {
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        setTexture(loadedTexture);
      },
      undefined,
      (err) => {
        console.warn(`Failed to load GitHub image, reverting to fallback.`, err);
        loader.load(fallbackImage, (fallbackTex) => {
          fallbackTex.colorSpace = THREE.SRGBColorSpace;
          setTexture(fallbackTex);
        });
      }
    );
  }, []);

  useFrame(() => {
    if (materialRef.current) {
      // Dim the image brightness by 10% as we zoom out (scroll offset 0 -> 1)
      const brightness = 1.0 - (scroll.offset * 0.1);
      materialRef.current.color.setScalar(brightness);
    }
  });

  return (
    <group position={[0, 0, -2]}>
      {/* 
        The view plane. 
        Placed behind the window. 
        Scaled to 9x12 (Ratio 0.75 or 3:4) to match typical aspect ratios.
      */}
      <mesh>
        <planeGeometry args={[9, 12]} />
        {texture ? (
          <meshBasicMaterial 
            ref={materialRef}
            map={texture} 
            toneMapped={false} 
          />
        ) : (
          // Temporary placeholder while loading
          <meshBasicMaterial color="#050510" />
        )}
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
