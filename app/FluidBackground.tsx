'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

function FluidMesh({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(2.4, viewport.height * 1.2, 48, 96)
    return geo
  }, [viewport.height])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const scroll = scrollY.current * 0.0005
    const pos = meshRef.current.geometry.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const wave1 = Math.sin(x * 1.8 + t * 0.6 + scroll) * 0.045
      const wave2 = Math.sin(y * 1.2 + t * 0.4) * 0.03
      const wave3 = Math.cos(x * 0.9 + y * 0.6 + t * 0.35) * 0.025
      pos.setZ(i, wave1 + wave2 + wave3)
    }
    pos.needsUpdate = true
    meshRef.current.geometry.computeVertexNormals()
    meshRef.current.rotation.z = Math.sin(t * 0.08) * 0.012
  })

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0.5, 0, 0]}>
      <MeshTransmissionMaterial
        backside={false}
        samples={4}
        thickness={0.35}
        chromaticAberration={0.04}
        anisotropy={0.15}
        distortion={0.12}
        distortionScale={0.3}
        temporalDistortion={0.05}
        iridescence={0.6}
        iridescenceIOR={1.2}
        iridescenceThicknessRange={[0, 1200]}
        roughness={0.0}
        metalness={0.0}
        transmission={0.97}
        color="#d0e4ff"
        attenuationColor="#b8d4ff"
        attenuationDistance={0.8}
      />
    </mesh>
  )
}

export default function FluidBackground() {
  const scrollY = useRef(0)

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => { scrollY.current = window.scrollY }, { passive: true })
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 4, 2]} intensity={1.2} color="#c8d8f8" />
        <directionalLight position={[-3, -2, 1]} intensity={0.4} color="#e0e8ff" />
        <pointLight position={[0, 2, 2]} intensity={0.8} color="#a8c4f8" />
        <FluidMesh scrollY={scrollY} />
      </Canvas>
    </div>
  )
}
