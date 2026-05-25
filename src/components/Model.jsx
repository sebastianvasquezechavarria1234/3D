import { useRef, useState, useEffect, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, useCursor } from '@react-three/drei'
import { gsap } from 'gsap'

function GLBModel({ url, onHover, ...props }) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const { scene, animations } = useGLTF(url)
  const { actions } = useAnimations(animations, groupRef)
  const floatOffset = useRef(Math.random() * Math.PI * 2)
  const origMaterials = useRef(null)

  useCursor(hovered)

  useEffect(() => {
    onHover?.(hovered)
  }, [hovered, onHover])

  useEffect(() => {
    if (animations.length > 0 && actions) {
      const names = Object.keys(actions)
      if (names.length > 0) actions[names[0]].play()
    }
  }, [actions, animations])

  useEffect(() => {
    if (!groupRef.current) return
    const target = groupRef.current

    gsap.to(target.scale, {
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
        if (!origMaterials.current) {
          origMaterials.current = new Map()
        }
        if (!origMaterials.current.has(child.uuid)) {
          origMaterials.current.set(child.uuid, child.material.clone())
        }
        const mat = child.material
        gsap.to(mat, {
          emissiveIntensity: hovered ? 0.6 : 0,
          envMapIntensity: hovered ? 2 : 1,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
    })
  }, [hovered, scene])

  useFrame((state) => {
    if (!groupRef.current) return
    if (hovered) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2 + floatOffset.current) * 0.08
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5 + floatOffset.current) * 0.015
    } else {
      groupRef.current.position.y = 0
      groupRef.current.rotation.z = 0
    }
  })

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
      {...props}
    >
      <primitive object={scene} scale={1} castShadow receiveShadow />
    </group>
  )
}

function PlaceholderModel({ onHover }) {
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
      x: hovered ? 1.2 : 1,
      y: hovered ? 1.2 : 1,
      z: hovered ? 1.2 : 1,
      duration: 0.5,
      ease: 'back.out(2)',
    })
  }, [hovered])

  useEffect(() => {
    if (!matRef.current) return
    gsap.to(matRef.current, {
      emissiveIntensity: hovered ? 0.8 : 0,
      envMapIntensity: hovered ? 2 : 1,
      duration: 0.4,
      ease: 'power2.out',
    })
  }, [hovered])

  useFrame((state) => {
    if (!groupRef.current) return
    if (hovered) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2 + floatOffset.current) * 0.1
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.02
    } else {
      groupRef.current.position.y = 0
      groupRef.current.rotation.z = 0
    }
  })

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
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
        emissive={hovered ? "#818cf8" : "#000000"}
        emissiveIntensity={hovered ? 0.5 : 0}
      />
    </mesh>
  )
}

export default function Model({ url, onHover, ...props }) {
  if (!url) {
    return <PlaceholderModel onHover={onHover} />
  }

  return (
    <Suspense fallback={<LoadingFallback onHover={onHover} />}>
      <GLBModel url={url} onHover={onHover} {...props} />
    </Suspense>
  )
}
