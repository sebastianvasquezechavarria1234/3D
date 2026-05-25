import { useRef, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import Model from './Model.jsx'
import Lights from './Lights.jsx'

export default function Experience({
  modelUrl,
  onDanceChange,
  dancing,
  materialColors,
  onMaterialsFound,
}) {
  const groupRef = useRef()
  const shadowRef = useRef()

  useEffect(() => {
    onDanceChange?.(false)
  }, [])

  const handleKey = useCallback((down) => (e) => {
    if (e.key.toLowerCase() === 'd' && down) {
      onDanceChange?.((prev) => !prev)
      e.preventDefault()
    }
  }, [onDanceChange])

  useEffect(() => {
    const onDown = handleKey(true)
    const onUp = handleKey(false)
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [handleKey])

  useFrame((state) => {
    if (!groupRef.current || !shadowRef.current) return
    const g = groupRef.current
    const t = state.clock.elapsedTime

    if (!dancing) {
      g.position.y = Math.sin(t * 0.8) * 0.04
    }

    shadowRef.current.position.x = g.position.x
    shadowRef.current.position.z = g.position.z
  })

  return (
    <>
      <fog attach="fog" args={['#0a0a12', 6, 15]} />

      <Lights dancing={dancing} />

      <Environment
        preset="city"
        resolution={1024}
        background={false}
      />

      <group ref={groupRef} position={[0, -0.3, 0]}>
        <Model
          url={modelUrl}
          dancing={dancing}
          materialColors={materialColors}
          onMaterialsFound={onMaterialsFound}
        />
      </group>

      <ContactShadows
        ref={shadowRef}
        position={[0, -1, 0]}
        opacity={0.35}
        scale={6}
        blur={4}
        far={2}
        resolution={1024}
        color="#000000"
      />
    </>
  )
}
