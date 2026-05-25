import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Experience from './components/Experience.jsx'
import ColorPalette from './components/ColorPalette.jsx'

export default function App() {
  const [dancing, setDancing] = useState(false)
  const [modelColor, setModelColor] = useState('#6366f1')

  return (
    <div className="relative w-screen h-screen bg-[#050508] overflow-hidden">
      <Canvas
        camera={{ position: [0, 1.8, 5.5], fov: 35 }}
        gl={{ antialias: true, alpha: false, toneMapping: 3, toneMappingExposure: 1.2 }}
        dpr={[1, 2]}
        shadows
      >
        <color attach="background" args={['#050508']} />
        <Experience
          modelUrl="/models/Xbot.glb"
          onDanceChange={setDancing}
          modelColor={modelColor}
        />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={2.5}
          maxDistance={12}
          makeDefault
        />
      </Canvas>

      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10">
        <h1 className="text-white/60 text-sm md:text-base font-mono tracking-[0.3em] uppercase">
          3D Experience
        </h1>
        <p className="text-white/20 text-xs mt-2 font-mono tracking-widest">
          React Three Fiber · GSAP · Tailwind
        </p>
      </div>

      {dancing && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <span className="text-pink-400 text-xs font-mono tracking-[0.2em] animate-pulse">
            ♫ DANCE MODE ♫
          </span>
        </div>
      )}

      <ColorPalette selected={modelColor} onSelect={setModelColor} />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-x-6 gap-y-1 text-white/20 text-[10px] font-mono tracking-widest uppercase select-none pointer-events-none z-10">
        <span>WASD — mover</span>
        <span>Q/E — rotar</span>
        <span>D — bailar</span>
        <span>Arrastrar — orbitar</span>
      </div>
    </div>
  )
}
