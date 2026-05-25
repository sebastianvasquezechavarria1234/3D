import { useRef, useState, useEffect, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGLTF, useAnimations, useCursor } from '@react-three/drei'
import { gsap } from 'gsap'

const DANCE_COLORS = [
  new THREE.Color('#ff6b6b'),
  new THREE.Color('#ffd93d'),
  new THREE.Color('#6bcbff'),
  new THREE.Color('#ff6bff'),
  new THREE.Color('#51cf66'),
]

function GLBModel({ url, onHover, dancing, ...props }) {
  const groupRef = useRef()
  const innerRef = useRef()
  const [hovered, setHovered] = useState(false)
  const { scene, animations } = useGLTF(url)
  const { actions, mixer } = useAnimations(animations, groupRef)
  const actionsRef = useRef(actions)
  const offset = useRef(Math.random() * Math.PI * 2)

  actionsRef.current = actions

  useCursor(hovered)

  useEffect(() => {
    onHover?.(hovered)
  }, [hovered, onHover])

  useEffect(() => {
    const a = actionsRef.current
    if (!a) return
    const names = Object.keys(a)
    if (names.length === 0) return

    Object.values(a).forEach((act) => act.stop())

    if (dancing) {
      const dance = names.find((n) => n.toLowerCase().includes('dance'))
      const target = dance ? a[dance] : a[names[0]]
      target.reset().play()
      target.setEffectiveTimeScale(1.3)
    } else {
      a[names[0]].reset().play()
    }
  }, [dancing])

  useEffect(() => {
    if (!groupRef.current) return
    gsap.to(groupRef.current.scale, {
      x: hovered ? 1.15 : 1,
      y: hovered ? 1.15 : 1,
      z: hovered ? 1.15 : 1,
      duration: 0.5,
      ease: 'back.out(2)',
    })
  }, [hovered])

  useEffect(() => {
    if (!scene) return
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const mat = child.material
        gsap.to(mat, {
          emissiveIntensity: hovered || dancing ? 0.6 : 0,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
    })
  }, [hovered, dancing, scene])

  const colorTargets = useRef(DANCE_COLORS.map((c) => c.clone()))

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    if (dancing) {
      const bounce = Math.sin(t * 5 + offset.current) * 0.35
      const sway = Math.sin(t * 3.2) * 0.08
      const groove = Math.sin(t * 2.7 + 1) * 0.04

      groupRef.current.position.y = bounce
      groupRef.current.rotation.z = sway
      groupRef.current.rotation.x = groove

      if (innerRef.current) {
        innerRef.current.rotation.z = Math.sin(t * 7 + offset.current) * 0.06
        innerRef.current.rotation.x = Math.sin(t * 5.5) * 0.04
      }

      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          const idx = Math.floor((t * 2) % DANCE_COLORS.length)
          const next = (idx + 1) % DANCE_COLORS.length
          const mix = Math.sin(t * 4) * 0.5 + 0.5

          colorTargets.current[idx].copy(DANCE_COLORS[idx])
          colorTargets.current[next].copy(DANCE_COLORS[next])

          child.material.emissive.lerpColors(
            DANCE_COLORS[idx],
            DANCE_COLORS[next],
            mix,
          )
          child.material.emissiveIntensity = 0.4 + bounce * 1.5 + 0.3
        }
      })
    } else if (hovered) {
      groupRef.current.position.y = Math.sin(t * 2 + offset.current) * 0.08
      groupRef.current.rotation.z = Math.sin(t * 1.5 + offset.current) * 0.015
      groupRef.current.rotation.x = 0
    } else {
      groupRef.current.position.y = 0
      groupRef.current.rotation.z = 0
      groupRef.current.rotation.x = 0
    }
  })

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
      {...props}
    >
      <group ref={innerRef}>
        <primitive object={scene} scale={1} castShadow receiveShadow />
      </group>
    </group>
  )
}

function PlaceholderModel({ onHover, dancing }) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const matRef = useRef()
  const offset = useRef(Math.random() * Math.PI * 2)

  useCursor(hovered)

  useEffect(() => {
    onHover?.(hovered)
  }, [hovered, onHover])

  useEffect(() => {
    if (!groupRef.current) return
    gsap.to(groupRef.current.scale, {
      x: hovered || dancing ? 1.3 : 1,
      y: hovered || dancing ? 1.3 : 1,
      z: hovered || dancing ? 1.3 : 1,
      duration: 0.5,
      ease: 'back.out(2)',
    })
  }, [hovered, dancing])

  useEffect(() => {
    if (!matRef.current) return
    gsap.to(matRef.current, {
      emissiveIntensity: hovered || dancing ? 1 : 0,
      envMapIntensity: hovered || dancing ? 2 : 1,
      duration: 0.4,
      ease: 'power2.out',
    })
  }, [hovered, dancing])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    if (dancing) {
      groupRef.current.position.y = Math.sin(t * 5 + offset.current) * 0.4
      groupRef.current.rotation.z = Math.sin(t * 3.5) * 0.08
      groupRef.current.rotation.y += 0.03

      if (matRef.current) {
        const idx = Math.floor((t * 2) % DANCE_COLORS.length)
        matRef.current.color.copy(DANCE_COLORS[idx])
        matRef.current.emissive.copy(DANCE_COLORS[(idx + 3) % DANCE_COLORS.length])
      }
    } else if (hovered) {
      groupRef.current.position.y = Math.sin(t * 2 + offset.current) * 0.1
      groupRef.current.rotation.z = Math.sin(t * 1.5) * 0.02
      groupRef.current.rotation.y += 0.005
    } else {
      groupRef.current.position.y = 0
      groupRef.current.rotation.z = 0
    }
  })

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.8, 0.25, 32, 64]} />
        <meshStandardMaterial
          ref={matRef}
          color="#6366f1"
          metalness={0.8}
          roughness={0.15}
          emissive="#818cf8"
          emissiveIntensity={0}
          envMapIntensity={1}
        />
      </mesh>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <icosahedronGeometry args={[0.45, 2]} />
        <meshStandardMaterial
          color="#a78bfa"
          metalness={0.4}
          roughness={0.3}
          wireframe
        />
      </mesh>
    </group>
  )
}

function LoadingFallback({ onHover }) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  useEffect(() => {
    onHover?.(hovered)
  }, [hovered, onHover])

  return (
    <mesh
      position={[0, 0.5, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial
        color="#6366f1"
        wireframe
        emissive={hovered ? '#818cf8' : '#000000'}
        emissiveIntensity={hovered ? 0.5 : 0}
      />
    </mesh>
  )
}

export default function Model({ url, onHover, dancing, ...props }) {
  if (!url) {
    return <PlaceholderModel onHover={onHover} dancing={dancing} />
  }

  return (
    <Suspense fallback={<LoadingFallback onHover={onHover} />}>
      <GLBModel url={url} onHover={onHover} dancing={dancing} {...props} />
    </Suspense>
  )
}
