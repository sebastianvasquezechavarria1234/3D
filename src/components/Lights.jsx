import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Lights({ dancing }) {
  const keyRef = useRef()
  const fillRef = useRef()
  const spotRef = useRef()

  useFrame(({ clock }) => {
    if (!dancing) {
      if (keyRef.current) keyRef.current.intensity = 4
      if (fillRef.current) fillRef.current.color.setHex(0x4a7fff)
      if (spotRef.current) spotRef.current.intensity = 1.5
      return
    }

    const t = clock.elapsedTime
    const beat = Math.sin(t * 4) * 0.5 + 0.5
    const colors = [0xff6b6b, 0xffd93d, 0x6bcbff, 0xff6bff, 0x51cf66]
    const idx = Math.floor((t * 2) % colors.length)
    const nextIdx = (idx + 1) % colors.length

    if (keyRef.current) {
      keyRef.current.intensity = 3 + beat * 3
      keyRef.current.color.setHex(colors[idx])
    }
    if (fillRef.current) {
      fillRef.current.color.setHex(colors[nextIdx])
      fillRef.current.intensity = 1 + beat * 1.5
    }
    if (spotRef.current) {
      spotRef.current.intensity = 1 + beat * 2
      spotRef.current.color.setHex(colors[(idx + 3) % colors.length])
    }
  })

  return (
    <>
      <directionalLight
        ref={keyRef}
        position={[6, 8, 4]}
        intensity={4}
        color="#ff9a56"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.001}
      />

      <directionalLight
        ref={fillRef}
        position={[-4, 1, 3]}
        intensity={1.2}
        color="#4a7fff"
      />

      <directionalLight
        position={[0, 3, -6]}
        intensity={2.5}
        color="#8ecae6"
      />

      <ambientLight intensity={0.15} color="#1a1a2e" />

      <pointLight
        ref={spotRef}
        position={[0, -1, 0.5]}
        intensity={1.5}
        distance={5}
        color="#ff6b35"
      />

      <hemisphereLight
        args={["#ff9a56", "#0a1628", 0.3]}
      />
    </>
  )
}
