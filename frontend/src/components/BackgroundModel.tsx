import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js'
import './BackgroundModel.css'

const MODEL_URL = '/models/Eryk.dae'
const TARGET = 4.6 // najdłuższy bok modelu w jednostkach sceny

const { lerp, clamp } = THREE.MathUtils

function useModel(url: string) {
  const [obj, setObj] = useState<THREE.Object3D | null>(null)

  useEffect(() => {
    let alive = true
    new ColladaLoader().load(
      url,
      (c) => {
        if (!alive || !c) return
        const o = c.scene
        // środek na X/Z, stoi na ziemi, przeskalowany do TARGET
        const box = new THREE.Box3().setFromObject(o)
        const size = box.getSize(new THREE.Vector3())
        const centre = box.getCenter(new THREE.Vector3())
        o.position.set(-centre.x, -box.min.y, -centre.z)
        const wrap = new THREE.Group()
        wrap.add(o)
        wrap.scale.setScalar(TARGET / Math.max(size.x, size.y, size.z, 1e-6))
        setObj(wrap)
      },
      undefined,
      (e) => console.error('Nie udało się wczytać modelu', e),
    )
    return () => {
      alive = false
    }
  }, [url])

  return obj
}

function Model({ scroll }: { scroll: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null!)
  const { viewport } = useThree()
  const model = useModel(MODEL_URL)

  useFrame((_, dt) => {
    const p = scroll.current
    const k = 1 - Math.pow(0.001, dt) // wygładzanie niezależne od FPS
    const g = group.current
    g.rotation.y = lerp(g.rotation.y, -0.5 + p * Math.PI * 2, k)
    g.position.x = lerp(g.position.x, Math.sin(p * Math.PI * 3) * viewport.width * 0.2, k)
    g.scale.setScalar(clamp(viewport.width / 8, 0.5, 1))
  })

  return (
    <group ref={group}>
      <group position={[0, -0.9, 0]}>{model && <primitive object={model} />}</group>
    </group>
  )
}

export default function BackgroundModel() {
  const scroll = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scroll.current = max > 0 ? window.scrollY / max : 0
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="bg-model" aria-hidden="true">
      <Canvas camera={{ position: [0, 2.4, 8], fov: 35 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 6, 3]} intensity={1.8} />
        <directionalLight position={[-4, 2, -3]} intensity={0.4} />
        <Model scroll={scroll} />
      </Canvas>
    </div>
  )
}
