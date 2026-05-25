import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Experience from './components/Experience.jsx'
import Sidebar from './components/Sidebar.jsx'

export default function App() {
  const [dancing, setDancing] = useState(false)
  const [materials, setMaterials] = useState(null)
  const [materialColors, setMaterialColors] = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleMaterialsFound = useCallback((parts) => {
    setMaterials(parts)
    const defaults = {}
    parts.forEach((p) => { defaults[p.name] = p.color })
    setMaterialColors((prev) => {
      if (Object.keys(prev).length === 0) return defaults
      return prev
    })
  }, [])

  const handleColorChange = useCallback((name, value) => {
    if (name === '__reset__') {
      setMaterialColors(value)
      return
    }
    setMaterialColors((prev) => ({ ...prev, [name]: value }))
  }, [])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0a12]">
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 28 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: 3,
          toneMappingExposure: 1.0,
          outputColorSpace: 'srgb',
          preserveDrawingBuffer: true,
        }}
        dpr={[1, 2]}
        shadows
        onCreated={(state) => {
          state.gl.setClearColor(0x000000, 0)
        }}
      >
        <Experience
          modelUrl="/models/MaterialsVariantsShoe.glb"
          onDanceChange={setDancing}
          dancing={dancing}
          materialColors={materialColors}
          onMaterialsFound={handleMaterialsFound}
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
        <h1 className="text-white/40 text-[11px] font-mono tracking-[0.4em] uppercase drop-shadow-xl">
          Shoe Customizer
        </h1>
        <div className="mt-2 w-12 h-px mx-auto bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      {dancing && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <span className="text-pink-400/70 text-[10px] font-mono tracking-[0.3em] animate-pulse drop-shadow-xl">
            ♫ DANCE MODE ♫
          </span>
        </div>
      )}

      <Sidebar
        materials={materials}
        materialColors={materialColors}
        onColorChange={handleColorChange}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
      />

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-x-5 gap-y-1 text-white/12 text-[9px] font-mono tracking-[0.2em] uppercase select-none pointer-events-none z-10 drop-shadow-xl">
        <span>Arrastrar — orbitar</span>
        <span>D — dance</span>
        <span>⚙ — editar</span>
      </div>
    </div>
  )
}
