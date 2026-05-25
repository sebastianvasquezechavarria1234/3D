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

      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1a1a25" />
      </mesh>
    </>
  )
}
