export default function Lights() {
  return (
    <>
      <directionalLight
        position={[5, 8, 5]}
        intensity={3}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />

      <directionalLight
        position={[-5, 3, -3]}
        intensity={1.5}
        color="#6366f1"
      />

      <ambientLight intensity={0.6} />

      <pointLight
        position={[0, 4, 2]}
        intensity={2}
        color="#a78bfa"
      />

      <hemisphereLight
        args={["#6366f1", "#0a0a0f", 0.5]}
      />
    </>
  )
}
