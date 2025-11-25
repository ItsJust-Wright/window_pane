import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import Experience from './components/Experience';

const App: React.FC = () => {
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full z-0 bg-black">
        <Canvas
          shadows
          camera={{ position: [0, 0, 2], fov: 45 }}
          dpr={[1, 2]} // Handle high DPI screens
        >
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </Canvas>
      </div>

      <Loader containerStyles={{ background: '#000' }} />

      {/* UI Overlay */}
      <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none z-10 animate-pulse">
        <p className="text-white/50 text-sm font-light tracking-widest uppercase">
          Scroll to explore the room
        </p>
      </div>
    </>
  );
};

export default App;