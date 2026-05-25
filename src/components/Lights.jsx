export default function Lights() {
  return (
    <>
      {/* Key light — cálido, desde arriba a la derecha (como sol de atardecer) */}
      <directionalLight
        position={[6, 8, 4]}
        intensity={4}
        color="#ff9a56"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.001}
      />

      {/* Fill light — frío, desde abajo a la izquierda (luz de relleno cinematográfica) */}
      <directionalLight
        position={[-4, 1, 3]}
        intensity={1.2}
        color="#4a7fff"
      />

      {/* Rim / back light — luz de contorno desde atrás */}
      <directionalLight
        position={[0, 3, -6]}
        intensity={2.5}
        color="#8ecae6"
      />

      {/* Luz ambiental muy tenue para mantener el contraste dramático */}
      <ambientLight intensity={0.15} color="#1a1a2e" />

      {/* Luz puntual cálida desde abajo para dar dramatismo */}
      <pointLight
        position={[0, -1, 0.5]}
        intensity={1.5}
        distance={5}
        color="#ff6b35"
      />

      {/* Hemisphere para sutiles reflejos de ambiente */}
      <hemisphereLight
        args={["#ff9a56", "#0a1628", 0.3]}
      />
    </>
  )
}
