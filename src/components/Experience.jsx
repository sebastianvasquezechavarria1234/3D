import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import Model from './Model.jsx'
import Lights from './Lights.jsx'

export default function Experience({ modelUrl }) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const speed = hovered ? 0.05 : 0.25
    groupRef.current.rotation.y += speed * 0.01
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
        <Model
          url={modelUrl}
          onHover={setHovered}
        />
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
