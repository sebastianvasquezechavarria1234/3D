import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import Model from './Model.jsx'
import Lights from './Lights.jsx'

export default function Experience({ modelUrl }) {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.5
    }
  })

  return (
    <>
      <Lights />

      <Environment
        preset="city"
        resolution={256}
        background={false}
      />

      <group ref={groupRef} position={[0, 0, 0]}>
        <Model url={modelUrl} />
      </group>

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.6}
        scale={8}
        blur={2.5}
        far={2}
      />
    </>
  )
}
