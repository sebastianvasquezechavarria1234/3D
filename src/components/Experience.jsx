import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import { gsap } from 'gsap'
import Model from './Model.jsx'
import Lights from './Lights.jsx'

export default function Experience({ modelUrl }) {
  const groupRef = useRef()

  useEffect(() => {
    if (!groupRef.current) return
    gsap.from(groupRef.current.position, {
      y: -2,
      duration: 1.5,
      ease: 'power3.out',
    })
    gsap.from(groupRef.current.rotation, {
      y: Math.PI * 2,
      duration: 2,
      ease: 'power2.out',
    })
  }, [])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.15
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
        {/*
          * Para cargar tu modelo .glb, pasa la URL:
          * <Model url="/models/tu-modelo.glb" />
          *
          * Sin URL se muestra un placeholder con formas geométricas
          */}
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
