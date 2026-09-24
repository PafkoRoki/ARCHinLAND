import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js'
import './BackgroundModel.css'

const MODEL_URL = '/models/Eryk.dae'
const TARGET = 4.6 // najdłuższy bok modelu w jednostkach sceny
const MODEL_SCALE = 0.62 // ogólny rozmiar modelu na ekranie
const BASE_ROTATION = -0.5 // obrót startowy (rad) — widok 3/4

// reakcja na kursor w Hero (radiany / skala)
const HOVER_TILT_Y = 0.45
const HOVER_TILT_X = 0.12
const HOVER_SCALE = 1.06

const { lerp, clamp, smoothstep } = THREE.MathUtils

// box = obrys modelu w układzie grupy Model (liczony raz, do testu najechania)
type Loaded = { obj: THREE.Object3D; height: number; box: THREE.Box3 }

function useModel(url: string) {
  const [loaded, setLoaded] = useState<Loaded | null>(null)

  useEffect(() => {
    let alive = true
    new ColladaLoader().load(
      url,
      (c) => {
        if (!alive || !c) return
        const o = c.scene
        o.traverse((child) => {
          const m = child as THREE.Mesh
          if (m.isMesh) m.castShadow = true
        })
        // środek na X/Z, stoi na y=0, przeskalowany do TARGET
        const box = new THREE.Box3().setFromObject(o)
        const size = box.getSize(new THREE.Vector3())
        const centre = box.getCenter(new THREE.Vector3())
        o.position.set(-centre.x, -box.min.y, -centre.z)
        const s = TARGET / Math.max(size.x, size.y, size.z, 1e-6)
        const wrap = new THREE.Group()
        wrap.add(o)
        wrap.scale.setScalar(s)
        const height = size.y * s
        // po wyśrodkowaniu w pionie (group y = -height/2) model zajmuje ±height/2
        const half = new THREE.Vector3(size.x * s, height, size.z * s).multiplyScalar(0.5)
        setLoaded({ obj: wrap, height, box: new THREE.Box3(half.clone().negate(), half) })
      },
      undefined,
      (e) => console.error('Nie udało się wczytać modelu', e),
    )
    return () => {
      alive = false
    }
  }, [url])

  return loaded
}

type Motion = {
  progress: MutableRefObject<number> // 0 → 1 od sekcji About do końca strony
  hero: MutableRefObject<number> // 1 = Hero na ekranie, 0 = przewinięte
  pointer: MutableRefObject<THREE.Vector2> // kursor, -1…1
}

function Model({ progress, hero, pointer }: Motion) {
  const group = useRef<THREE.Group>(null!)
  const { viewport, camera } = useThree()
  const loaded = useModel(MODEL_URL)
  const hoverBox = useRef(new THREE.Box3())
  const raycaster = useRef(new THREE.Raycaster())
  const hovered = useRef(0)

  useEffect(() => {
    camera.lookAt(0, 0, 0)
  }, [camera])

  useFrame((state, dt) => {
    const g = group.current
    const p = progress.current
    const h = hero.current
    const k = 1 - Math.pow(0.001, dt) // wygładzanie niezależne od FPS

    // najechanie na model — tani test na prostopadłościanie otaczającym
    let over = 0
    if (loaded && h > 0.01) {
      hoverBox.current.copy(loaded.box).applyMatrix4(g.matrixWorld)
      raycaster.current.setFromCamera(pointer.current, camera)
      over = raycaster.current.ray.intersectsBox(hoverBox.current) ? 1 : 0
    }
    hovered.current = lerp(hovered.current, over, 1 - Math.pow(0.02, dt))

    // w Hero model podąża za kursorem; od About obraca się z przewijaniem
    const tiltY = pointer.current.x * HOVER_TILT_Y * h
    const tiltX = -pointer.current.y * HOVER_TILT_X * h
    g.rotation.y = lerp(g.rotation.y, BASE_ROTATION + p * Math.PI * 2 + tiltY, k)
    g.rotation.x = lerp(g.rotation.x, tiltX, k)
    g.position.x = lerp(g.position.x, Math.sin(p * Math.PI * 3) * viewport.width * 0.2, k)
    // delikatne unoszenie w Hero, jak puszka w STILL
    g.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05 * h

    const fit = clamp(viewport.width / 6, 0.5, 1) * MODEL_SCALE // mniejszy na wąskich ekranach
    g.scale.setScalar(fit * (1 + (HOVER_SCALE - 1) * hovered.current * h))
  })

  return (
    <group ref={group}>
      {loaded && (
        // model wyśrodkowany w pionie, cień leży pod jego podstawą
        <group position={[0, -loaded.height / 2, 0]}>
          <primitive object={loaded.obj} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow>
            <circleGeometry args={[TARGET * 0.9, 64]} />
            <shadowMaterial transparent opacity={0.22} />
          </mesh>
        </group>
      )}
    </group>
  )
}

export default function BackgroundModel() {
  const progress = useRef(0)
  const hero = useRef(1)
  const pointer = useRef(new THREE.Vector2(0, 0))

  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight
      const max = document.documentElement.scrollHeight - vh
      // model stoi w miejscu, dopóki nie dojedziemy do sekcji About
      const about = document.getElementById('about')
      const start = about ? about.offsetTop : vh
      progress.current = max > start ? clamp((window.scrollY - start) / (max - start), 0, 1) : 0
      hero.current = 1 - smoothstep(window.scrollY, 0, vh * 0.8)
    }
    const onMove = (e: PointerEvent) => {
      pointer.current.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
    }
    const onLeave = () => pointer.current.set(0, 0)

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div className="bg-model" aria-hidden="true">
      <Canvas
        shadows
        camera={{ position: [0, 2.4, 8], fov: 35 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[4, 8, 5]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
          shadow-camera-near={0.5}
          shadow-camera-far={25}
          shadow-bias={-0.0004}
          shadow-normalBias={0.03}
        />
        <directionalLight position={[-4, 2, -3]} intensity={0.4} />
        <Model progress={progress} hero={hero} pointer={pointer} />
      </Canvas>
    </div>
  )
}
