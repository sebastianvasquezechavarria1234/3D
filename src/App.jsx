import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Experience from './components/Experience.jsx'
import ColorPalette from './components/ColorPalette.jsx'

export default function App() {
  const [dancing, setDancing] = useState(false)
  const [modelColor, setModelColor] = useState('#6366f1')

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <Canvas
        camera={{ position: [0, 1.5, 4.5], fov: 30 }}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: 3,
          toneMappingExposure: 1.0,
          outputColorSpace: 'srgb',
        }}
        dpr={[1, 2]}
        shadows
      >
        <Experience
          modelUrl="/models/MaterialsVariantsShoe.glb"
          onDanceChange={setDancing}
          modelColor={modelColor}
          dancing={dancing}
        />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={2.5}
          maxDistance={10}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate={!dancing}
          autoRotateSpeed={1.5}
          makeDefault
        />
      </Canvas>

      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10">
        <h1 className="text-white/50 text-xs md:text-sm font-mono tracking-[0.4em] uppercase drop-shadow-xl">
          3D Experience
        </h1>
        <div className="mt-2 w-12 h-px mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {dancing && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <span className="text-pink-400/80 text-[10px] font-mono tracking-[0.3em] animate-pulse drop-shadow-xl">
            ♫ DANCE MODE ♫
          </span>
        </div>
      )}

      <ColorPalette selected={modelColor} onSelect={setModelColor} />

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-x-5 gap-y-1 text-white/15 text-[9px] font-mono tracking-[0.2em] uppercase select-none pointer-events-none z-10 drop-shadow-xl">
        <span>Arrastrar — orbitar</span>
        <span>Rueda — zoom</span>
        <span>D — dance</span>
      </div>
    </div>
  )
}
