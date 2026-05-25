import { useRef } from 'react'

export default function Lights() {
  const lightRef = useRef()

  return (
    <>
      <directionalLight
        ref={lightRef}
        position={[5, 5, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />

      <directionalLight
        position={[-5, 3, -3]}
        intensity={0.5}
        color="#6366f1"
      />

      <ambientLight intensity={0.3} />

      <spotLight
        position={[0, 6, 0]}
        intensity={0.4}
        angle={0.6}
        penumbra={0.8}
        distance={20}
        color="#a78bfa"
      />
    </>
  )
}

export function LightsPreset() {
  return <Lights />
}
