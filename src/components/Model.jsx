import { useRef, Suspense } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

function GLBModel({ url, ...props }) {
  const groupRef = useRef()
  const { scene, animations } = useGLTF(url)
  const { actions } = useAnimations(animations, groupRef)

  return (
    <group ref={groupRef} {...props}>
      <primitive object={scene} scale={1} castShadow receiveShadow />
    </group>
  )
}

function PlaceholderModel() {
  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.8, 0.25, 32, 64]} />
        <meshStandardMaterial
          color="#6366f1"
          metalness={0.8}
          roughness={0.15}
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
