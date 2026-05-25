import { useRef, useEffect, Suspense } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { gsap } from 'gsap'

function GLBModel({ url, ...props }) {
  const groupRef = useRef()
  const { scene, animations } = useGLTF(url)
  const { actions } = useAnimations(animations, groupRef)

  useEffect(() => {
    if (animations.length > 0 && actions) {
      const names = Object.keys(actions)
      if (names.length > 0) actions[names[0]].play()
    }
  }, [actions, animations])

  useEffect(() => {
    if (scene) {
      gsap.from(scene.scale, {
        x: 0, y: 0, z: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
      })
    }
  }, [scene])

  return (
    <group ref={groupRef} {...props}>
      <primitive object={scene} scale={1} castShadow receiveShadow />
    </group>
  )
}

function PlaceholderModel() {
  const meshRef = useRef()

  useEffect(() => {
    if (meshRef.current) {
      gsap.from(meshRef.current.scale, {
        x: 0, y: 0, z: 0,
        duration: 1.5,
        ease: 'elastic.out(1, 0.4)',
        delay: 0.3,
      })
    }
  }, [])

  return (
    <group ref={meshRef}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <torusGeometry args={[1, 0.4, 32, 64]} />
        <meshStandardMaterial
          color="#6366f1"
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <torusKnotGeometry args={[0.6, 0.2, 100, 16]} />
        <meshStandardMaterial
          color="#a78bfa"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
    </group>
  )
}

function LoadingFallback() {
  return (
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#6366f1" wireframe />
    </mesh>
  )
}

export default function Model({ url, ...props }) {
  if (!url) {
    return <PlaceholderModel />
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <GLBModel url={url} {...props} />
    </Suspense>
  )
}
