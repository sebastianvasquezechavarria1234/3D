import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Experience from './components/Experience.jsx'

export default function App() {
  return (
    <div className="relative w-screen h-screen bg-[#0a0a0f] overflow-hidden">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        shadows
      >
        <color attach="background" args={['#0a0a0f']} />
        <Experience modelUrl="/models/Xbot.glb" />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={15}
          makeDefault
        />
      </Canvas>

      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <h1 className="text-white/80 text-sm md:text-base font-mono tracking-[0.3em] uppercase">
          3D Experience
        </h1>
        <p className="text-white/30 text-xs mt-2 font-mono tracking-widest">
          React Three Fiber · GSAP · Tailwind
        </p>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30 text-[10px] font-mono tracking-widest uppercase select-none pointer-events-none">
        Arrastra para orbitar · Scroll para zoom
      </div>
    </div>
  )
}
