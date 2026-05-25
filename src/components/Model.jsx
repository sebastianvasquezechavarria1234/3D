import { useRef, useState, useEffect, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGLTF, useAnimations, useCursor } from '@react-three/drei'
import { gsap } from 'gsap'

const DANCE_COLORS = ['#ff6b6b', '#ffd93d', '#6bcbff', '#ff6bff', '#51cf66']

function GLBModel({ url, onHover, dancing, ...props }) {
  const groupRef = useRef()
  const innerRef = useRef()
  const [hovered, setHovered] = useState(false)
  const { scene, animations } = useGLTF(url)
  const { actions, mixer } = useAnimations(animations, groupRef)
  const floatOffset = useRef(Math.random() * Math.PI * 2)
  const dancePhase = useRef(0)

  useCursor(hovered)

  useEffect(() => {
    onHover?.(hovered)
  }, [hovered, onHover])

  useEffect(() => {
    if (!actions) return
    const names = Object.keys(actions)

    if (dancing) {
      const danceAnim = names.find((n) => n.toLowerCase().includes('dance'))
      const target = danceAnim ? actions[danceAnim] : names.length > 0 ? actions[names[0]] : null
      if (target) {
        Object.values(actions).forEach((a) => a.stop())
        target.reset().play()
        target.setEffectiveTimeScale(1.2)
      }
    } else {
      if (names.length > 0) {
        Object.values(actions).forEach((a) => a.stop())
        actions[names[0]].reset().play()
      }
    }
  }, [dancing, actions])

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
          envMapIntensity: hovered || dancing ? 2 : 1,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
    })
  }, [hovered, dancing, scene])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    if (dancing) {
      const beat = Math.sin(t * 4) * 0.5 + 0.5
      groupRef.current.position.y = Math.sin(t * 4 + floatOffset.current) * 0.15
      groupRef.current.rotation.z = Math.sin(t * 2.5) * 0.04
      groupRef.current.rotation.x = Math.sin(t * 3) * 0.02

      if (innerRef.current) {
        innerRef.current.rotation.z = Math.sin(t * 8) * 0.05
        innerRef.current.rotation.x = Math.sin(t * 6 + 1) * 0.03
      }

      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          const colorIdx = Math.floor((t * 2) % DANCE_COLORS.length)
          const nextIdx = (colorIdx + 1) % DANCE_COLORS.length
          const mix = (Math.sin(t * 4) * 0.5 + 0.5)
          child.material.emissive?.lerpColors
            ? child.material.emissive.lerpColors(
                new THREE.Color(DANCE_COLORS[colorIdx]),
                new THREE.Color(DANCE_COLORS[nextIdx]),
                mix,
              )
            : child.material.emissive?.set(DANCE_COLORS[colorIdx])
          child.material.emissiveIntensity = 0.3 + beat * 0.5
        }
      })
    } else if (hovered) {
      groupRef.current.position.y = Math.sin(t * 2 + floatOffset.current) * 0.08
      groupRef.current.rotation.z = Math.sin(t * 1.5 + floatOffset.current) * 0.015
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
  const floatOffset = useRef(Math.random() * Math.PI * 2)

  useCursor(hovered)

  useEffect(() => {
    onHover?.(hovered)
  }, [hovered, onHover])

  useEffect(() => {
    if (!groupRef.current) return
    gsap.to(groupRef.current.scale, {
      x: hovered || dancing ? 1.2 : 1,
      y: hovered || dancing ? 1.2 : 1,
      z: hovered || dancing ? 1.2 : 1,
      duration: 0.5,
      ease: 'back.out(2)',
    })
  }, [hovered, dancing])

  useEffect(() => {
    if (!matRef.current) return
    gsap.to(matRef.current, {
      emissiveIntensity: hovered || dancing ? 0.8 : 0,
      envMapIntensity: hovered || dancing ? 2 : 1,
      duration: 0.4,
      ease: 'power2.out',
    })
  }, [hovered, dancing])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    if (dancing) {
      groupRef.current.position.y = Math.sin(t * 4 + floatOffset.current) * 0.2
      groupRef.current.rotation.z = Math.sin(t * 3) * 0.05
      groupRef.current.rotation.y += 0.02

      if (matRef.current) {
        const colors = DANCE_COLORS
        const idx = Math.floor((t * 2) % colors.length)
        matRef.current.color.set(colors[idx])
        matRef.current.emissive.set(colors[(idx + 2) % colors.length])
      }
    } else if (hovered) {
      groupRef.current.position.y = Math.sin(t * 2 + floatOffset.current) * 0.1
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
