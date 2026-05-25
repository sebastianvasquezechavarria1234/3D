import { useRef, useEffect, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGLTF, useAnimations } from '@react-three/drei'
import { gsap } from 'gsap'

function formatName(str) {
  return str
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/  +/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    || 'Part'
}

const DANCE_COLORS = [
  new THREE.Color('#ff6b6b'),
  new THREE.Color('#ffd93d'),
  new THREE.Color('#6bcbff'),
  new THREE.Color('#ff6bff'),
  new THREE.Color('#51cf66'),
]

function GLBModel({ url, dancing, materialColors, onMaterialsFound }) {
  const groupRef = useRef()
  const bodyRef = useRef()
  const { scene, animations } = useGLTF(url, true)
  const { actions } = useAnimations(animations, groupRef)
  const actionsRef = useRef(actions)
  const offset = useRef(Math.random() * Math.PI * 2)
  const materialsRef = useRef([])
  const reported = useRef(false)

  actionsRef.current = actions

  useEffect(() => {
    if (!scene || reported.current) return
    const parts = []
    const clonedNames = new Set()

    scene.traverse((child) => {
      if (!child.isMesh) return
      child.castShadow = true
      child.receiveShadow = true

      let mats = child.material
      if (!mats) return
      if (!Array.isArray(mats)) mats = [mats]

      const cloned = mats.map((mat) => {
        const clone = mat.clone()
        clone.envMapIntensity = 1.8
        return clone
      })

      child.material = cloned.length === 1 ? cloned[0] : cloned

      cloned.forEach((mat, i) => {
        const label = formatName(Array.isArray(child.material) ? child.name : child.name)
        const suffix = cloned.length > 1 ? ` ${i + 1}` : ''
        const uniqueName = label + suffix

        if (!clonedNames.has(uniqueName)) {
          clonedNames.add(uniqueName)
          parts.push({
            name: uniqueName,
            meshName: child.name,
            material: mat,
            color: '#' + mat.color.getHexString(),
          })
        }
      })
    })

    materialsRef.current = parts
    reported.current = true
    onMaterialsFound?.(parts)
  }, [scene, onMaterialsFound])

  useEffect(() => {
    if (!scene || !materialColors || Object.keys(materialColors).length === 0) return
    const entries = Object.entries(materialColors)

    scene.traverse((child) => {
      if (!child.isMesh || !child.material) return

      const label = formatName(child.name)
      const hex = materialColors[label] || entries.find(([k]) => k === label)?.[1]
      if (!hex) return

      const mats = Array.isArray(child.material) ? child.material : [child.material]
      mats.forEach((mat, i) => {
        const key = label + (mats.length > 1 ? ` ${i + 1}` : '')
        const h = materialColors[key] || hex
        const c = new THREE.Color(h)
        gsap.to(mat.color, {
          r: c.r, g: c.g, b: c.b,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      })
    })
  }, [materialColors, scene])

  useEffect(() => {
    const a = actionsRef.current
    if (!a) return
    const names = Object.keys(a)
    if (names.length === 0) return

    Object.values(a).forEach((act) => { if (act) act.stop() })

    if (dancing) {
      const dance = names.find((n) => n.toLowerCase().includes('dance'))
      const target = dance ? a[dance] : a[names[0]]
      if (target) {
        target.reset().play()
        target.setEffectiveTimeScale(1.3)
      }
    } else {
      const idle = a[names[0]]
      if (idle) idle.reset().play()
    }
  }, [dancing])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    if (dancing) {
      groupRef.current.position.y = Math.sin(t * 5 + offset.current) * 0.4
      groupRef.current.rotation.z = Math.sin(t * 3.2) * 0.08
      groupRef.current.rotation.x = Math.sin(t * 2.7 + 1) * 0.04

      if (bodyRef.current) {
        bodyRef.current.rotation.z = Math.sin(t * 7 + offset.current) * 0.06
        bodyRef.current.rotation.x = Math.sin(t * 5.5) * 0.04
      }

      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          const idx = Math.floor((t * 2) % DANCE_COLORS.length)
          const next = (idx + 1) % DANCE_COLORS.length
          const mix = Math.sin(t * 4) * 0.5 + 0.5
          child.material.emissive.lerpColors(
            DANCE_COLORS[idx],
            DANCE_COLORS[next],
            mix,
          )
          child.material.emissiveIntensity = 0.5 + Math.sin(t * 5) * 0.4
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      <group ref={bodyRef}>
        <primitive object={scene} scale={2.2} />
      </group>
    </group>
  )
}

function PlaceholderModel({ dancing, color }) {
  const groupRef = useRef()
  const matRef = useRef()
  const offset = useRef(Math.random() * Math.PI * 2)

  useEffect(() => {
    if (!matRef.current) return
    gsap.to(matRef.current, {
      emissiveIntensity: dancing ? 1 : 0,
      envMapIntensity: dancing ? 2 : 1.5,
      duration: 0.5,
      ease: 'power2.out',
    })
  }, [dancing])

  useEffect(() => {
    if (!matRef.current || !color) return
    const c = new THREE.Color(color)
    gsap.to(matRef.current.color, {
      r: c.r, g: c.g, b: c.b,
      duration: 0.6,
      ease: 'power2.out',
    })
  }, [color])

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
    }
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.8, 0.25, 32, 64]} />
        <meshPhysicalMaterial
          ref={matRef}
          color="#6366f1"
          metalness={0.8}
          roughness={0.15}
          emissive="#818cf8"
          emissiveIntensity={0}
          envMapIntensity={1.5}
          clearcoat={0.1}
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

function LoadingFallback() {
  return (
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial color="#6366f1" wireframe />
    </mesh>
  )
}

export default function Model({ url, dancing, materialColors, onMaterialsFound }) {
  if (!url) {
    return <PlaceholderModel dancing={dancing} color={materialColors?.['Part'] || '#6366f1'} />
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <GLBModel
        url={url}
        dancing={dancing}
        materialColors={materialColors}
        onMaterialsFound={onMaterialsFound}
      />
    </Suspense>
  )
}
