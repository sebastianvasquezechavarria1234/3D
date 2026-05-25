import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import Model from './Model.jsx'
import Lights from './Lights.jsx'

export default function Experience({ modelUrl }) {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.3
    }
  })

  return (
    <>
      <fog attach="fog" args={['#0a0a0f', 8, 20]} />

      <Lights />

      <Environment
        preset="night"
        resolution={256}
        background={false}
      />

      <group ref={groupRef} position={[0, 0, 0]}>
        <Model url={modelUrl} />
      </group>

      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.8}
        scale={6}
        blur={3}
        far={2}
        color="#000000"
      />
    </>
  )
}
