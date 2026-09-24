import { MutableRefObject, RefObject, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { modelControls } from '../lib/modelControls'
import './BackgroundModel.css'

// Eryk.glb = Eryk.dae przekonwertowany i skompresowany (meshopt + tekstury WebP 1024 px)
const MODEL_URL = '/models/Eryk.glb'
const TARGET = 4.6 // najdłuższy bok modelu w jednostkach sceny
const MODEL_SCALE = 0.62 // ogólny rozmiar modelu na ekranie
const BASE_ROTATION = -0.5 // obrót startowy (rad) — widok 3/4

// Soczewka w Hero (jak w STILL): model widać tylko w kole, które podąża za kursorem.
// Przy przewijaniu koło rośnie do pełnego ekranu, a model wraca na środek.
const LENS_RADIUS = 180 // px, promień koła w Hero (na telefonie mniejszy, patrz lensRadius)
const LENS_ZOOM = 1.15 // model w soczewce jest lekko przybliżony
const LENS_REST = { x: 0.5, y: 0.42 } // pozycja koła bez kursora (ułamek ekranu)
const REVEAL_DISTANCE = 0.8 // ile wysokości ekranu przewijania trwa powiększanie koła
const FADE_END = 0.35 // model całkiem znika, gdy góra sekcji Realizacje dojdzie do 35% ekranu

// reakcja na kursor w Hero (radiany)
const HOVER_TILT_Y = 0.45
const HOVER_TILT_X = 0.12

const { lerp, clamp, smoothstep } = THREE.MathUtils

type Loaded = { obj: THREE.Object3D; height: number }

function useModel(url: string) {
  const [loaded, setLoaded] = useState<Loaded | null>(null)

  useEffect(() => {
    let alive = true
    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(
      url,
      (gltf) => {
        if (!alive) return
        const o = gltf.scene
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
        setLoaded({ obj: wrap, height: size.y * s })
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

const lensRadius = (w: number) => Math.min(LENS_RADIUS, w * 0.32)

type Motion = {
  progress: MutableRefObject<number> // 0 → 1 od pola z modelem w About do końca strony
  reveal: MutableRefObject<number> // 0 = soczewka w Hero, 1 = pełny ekran
  pointer: MutableRefObject<{ x: number; y: number } | null> // kursor w px, null = brak
  layer: RefObject<HTMLDivElement> // tu ustawiamy zmienne CSS soczewki
}

function Model({ progress, reveal, pointer, layer }: Motion) {
  const group = useRef<THREE.Group>(null!)
  const { viewport, camera, size } = useThree()
  const loaded = useModel(MODEL_URL)
  const lens = useRef({ x: 0, y: 0, ready: false })
  const tmp = useRef({ ndc: new THREE.Vector3(), dir: new THREE.Vector3(), hit: new THREE.Vector3() })

  useEffect(() => {
    camera.lookAt(0, 0, 0)
  }, [camera])

  useFrame((state, dt) => {
    const g = group.current
    const p = progress.current
    const r = reveal.current
    const h = 1 - r
    const k = 1 - Math.pow(0.001, dt) // wygładzanie niezależne od FPS
    const kLens = 1 - Math.pow(0.0005, dt)
    const { width: w, height: hgt } = size

    // środek soczewki: goni kursor, przy przewijaniu wraca na środek ekranu
    const target = pointer.current ?? { x: w * LENS_REST.x, y: hgt * LENS_REST.y }
    if (!lens.current.ready) Object.assign(lens.current, target, { ready: true })
    lens.current.x = lerp(lens.current.x, target.x, kLens)
    lens.current.y = lerp(lens.current.y, target.y, kLens)
    const lx = lerp(lens.current.x, w / 2, r)
    const ly = lerp(lens.current.y, hgt / 2, r)
    const radius = lerp(lensRadius(w), Math.hypot(w, hgt) / 2 + 40, r)

    const el = layer.current
    if (el) {
      el.style.setProperty('--lens-x', `${lx}px`)
      el.style.setProperty('--lens-y', `${ly}px`)
      el.style.setProperty('--lens-r', `${radius}px`)
      el.style.setProperty('--lens-fade', `${h}`)
      el.dataset.full = r > 0.999 ? 'true' : 'false'
    }

    // punkt sceny (płaszczyzna z=0) pod środkiem soczewki — tam stoi model
    const { ndc, dir, hit } = tmp.current
    ndc.set((lx / w) * 2 - 1, -(ly / hgt) * 2 + 1, 0.5).unproject(camera)
    dir.copy(ndc).sub(camera.position).normalize()
    hit.copy(camera.position).addScaledVector(dir, -camera.position.z / dir.z)

    // od About model obraca się i kołysze na boki z przewijaniem
    const scrollX = Math.sin(p * Math.PI * 3) * viewport.width * 0.2
    g.position.x = lerp(hit.x, scrollX, r)
    // delikatne unoszenie w Hero, jak puszka w STILL
    g.position.y = lerp(hit.y, 0, r) + Math.sin(state.clock.elapsedTime * 0.8) * 0.05 * h

    // w Hero model obraca się w stronę kursora, w About — przeciąganiem myszką
    const nx = pointer.current ? (pointer.current.x / w) * 2 - 1 : 0
    const ny = pointer.current ? -(pointer.current.y / hgt) * 2 + 1 : 0
    const turn = BASE_ROTATION + p * Math.PI * 2 + nx * HOVER_TILT_Y * h + modelControls.dragRotation
    g.rotation.y = lerp(g.rotation.y, turn, k)
    g.rotation.x = lerp(g.rotation.x, -ny * HOVER_TILT_X * h, k)

    const fit = clamp(viewport.width / 6, 0.5, 1) * MODEL_SCALE // mniejszy na wąskich ekranach
    g.scale.setScalar(fit * lerp(LENS_ZOOM, 1, r))
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
  const layer = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const reveal = useRef(0)
  const pointer = useRef<{ x: number; y: number } | null>(null)
  // po zniknięciu modelu (sekcja Realizacje) scena przestaje się renderować
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight
      const y = window.scrollY
      const top = (id: string) => {
        const el = document.getElementById(id)
        return el ? el.getBoundingClientRect().top + y : null
      }

      // model znika, gdy wjeżdża sekcja Realizacje: od jej pojawienia się na dole ekranu
      // do chwili, gdy jej góra dojdzie do FADE_END ekranu
      const realTop = top('realizations')
      const end = realTop !== null ? realTop - vh * FADE_END : document.documentElement.scrollHeight - vh
      const fade = realTop !== null ? smoothstep(realTop - y, vh * FADE_END, vh) : 1
      layer.current?.style.setProperty('opacity', `${fade}`)
      setHidden(fade <= 0)

      // model nie obraca się z przewijaniem, dopóki na ekranie jest pole do obracania w About;
      // potem pełny obrót do momentu zniknięcia
      const stage = document.getElementById('about-stage')
      const start = stage ? stage.getBoundingClientRect().bottom + y - vh / 2 : vh
      progress.current = end > start ? clamp((y - start) / (end - start), 0, 1) : 0
      reveal.current = smoothstep(y, 0, vh * REVEAL_DISTANCE)
    }
    // tylko prawdziwa mysz — na dotyku soczewka stoi w LENS_REST
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') pointer.current = { x: e.clientX, y: e.clientY }
    }
    const onLeave = () => {
      pointer.current = null
    }

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
    <div ref={layer} className="bg-model" aria-hidden="true">
      <div className="bg-model__halo" />
      <div className="bg-model__lens">
        <div className="bg-model__lens-bg" />
        <Canvas
          shadows
          frameloop={hidden ? 'never' : 'always'}
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
            shadow-camera-left={-8}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-bottom={-8}
            shadow-camera-near={0.5}
            shadow-camera-far={30}
            shadow-bias={-0.0004}
            shadow-normalBias={0.03}
          />
          <directionalLight position={[-4, 2, -3]} intensity={0.4} />
          <Model progress={progress} reveal={reveal} pointer={pointer} layer={layer} />
        </Canvas>
      </div>
    </div>
  )
}
