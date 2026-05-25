import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Lights({ dancing }) {
  const keyRef = useRef()
  const fillRef = useRef()
  const rimRef = useRef()
  const ambientRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.elapsedTime

    if (!dancing) {
      if (keyRef.current) {
        keyRef.current.intensity = 3.5
        keyRef.current.color.setHex(0xffcc88)
        keyRef.current.position.set(4, 6, 3)
      }
      if (fillRef.current) {
        fillRef.current.intensity = 1.2
        fillRef.current.color.setHex(0x8899ff)
        fillRef.current.position.set(-3, 1, 2)
      }
      if (rimRef.current) {
        rimRef.current.intensity = 2.5
        rimRef.current.color.setHex(0x88ddff)
        rimRef.current.position.set(0, 2, -5)
      }
      if (ambientRef.current) ambientRef.current.intensity = 0.12
      return
    }

    const beat = Math.sin(t * 4) * 0.5 + 0.5
    const colors = [0xff6b6b, 0xffd93d, 0x6bcbff, 0xff6bff, 0x51cf66]
    const idx = Math.floor((t * 2) % colors.length)
    const next = (idx + 1) % colors.length

    if (keyRef.current) {
      keyRef.current.intensity = 2 + beat * 4
      keyRef.current.color.setHex(colors[idx])
    }
    if (fillRef.current) {
      fillRef.current.intensity = 1 + beat * 2
      fillRef.current.color.setHex(colors[next])
    }
    if (rimRef.current) {
      rimRef.current.intensity = 1 + beat * 2
      rimRef.current.color.setHex(colors[(idx + 2) % colors.length])
    }
    if (ambientRef.current) ambientRef.current.intensity = 0.15 + beat * 0.2
  })

  return (
    <>
      <directionalLight
        ref={keyRef}
        position={[4, 6, 3]}
        intensity={3.5}
        color="#ffcc88"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={15}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
        shadow-radius={4}
      />

      <directionalLight
        ref={fillRef}
        position={[-3, 1, 2]}
        intensity={1.2}
        color="#8899ff"
      />

      <directionalLight
        ref={rimRef}
        position={[0, 2, -5]}
        intensity={2.5}
        color="#88ddff"
      />

      <ambientLight ref={ambientRef} intensity={0.12} color="#222244" />

      <hemisphereLight
        args={["#ffcc88", "#112244", 0.4]}
      />
    </>
  )
}
