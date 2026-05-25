import { useRef, useState, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Environment, ContactShadows } from '@react-three/drei'
import Model from './Model.jsx'
import Lights from './Lights.jsx'

const keys = { w: false, a: false, s: false, d: false, q: false, e: false }

export default function Experience({ modelUrl, onDanceChange, modelColor }) {
  const groupRef = useRef()
  const shadowRef = useRef()
  const [dancing, setDancing] = useState(false)

  const toggleDance = useCallback(() => {
    setDancing((prev) => {
      const next = !prev
      onDanceChange?.(next)
      return next
    })
  }, [onDanceChange])

  const handleKey = useCallback((down) => (e) => {
    const key = e.key.toLowerCase()
    if (key === 'd' && down) {
      toggleDance()
      e.preventDefault()
      return
    }
    if (key in keys) {
      keys[key] = down
      e.preventDefault()
    }
  }, [toggleDance])

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

  useFrame((_, delta) => {
    if (!groupRef.current || !shadowRef.current) return
    const g = groupRef.current

    const speed = dancing ? 0.02 : 0.06 * delta * 60
    const rotSpeed = dancing ? 0.01 : 0.04 * delta * 60
    const dir = new THREE.Vector3()

    if (keys.w || keys.s) {
      dir.z = keys.w ? -speed : speed
      dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), g.rotation.y)
    }
    if (keys.a || keys.d) {
      dir.x = keys.d ? speed : -speed
      dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), g.rotation.y)
    }

    g.position.x += dir.x
    g.position.z += dir.z
    g.position.y = dancing ? g.position.y : 0

    if (keys.q) g.rotation.y += rotSpeed
    if (keys.e) g.rotation.y -= rotSpeed

    shadowRef.current.position.x = g.position.x
    shadowRef.current.position.z = g.position.z

    if (dancing) {
      const s = 1 + Math.sin(Date.now() * 0.005) * 0.08
      shadowRef.current.scale.setScalar(s)
    } else {
      shadowRef.current.scale.setScalar(1)
    }
  })

  return (
    <>
      <Lights dancing={dancing} />

      <Environment
        preset="studio"
        resolution={256}
        background={false}
      />

      <group ref={groupRef} position={[0, 0, 0]}>
        <Model url={modelUrl} dancing={dancing} color={modelColor} />
      </group>

      <ContactShadows
        ref={shadowRef}
        position={[0, -1.2, 0]}
        opacity={0.6}
        scale={6}
        blur={3}
        far={2}
        color="#000000"
      />
    </>
  )
}
