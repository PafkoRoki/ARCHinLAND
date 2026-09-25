import { MutableRefObject, RefObject, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { modelControls, reportModelProgress, reportModelReady } from '../lib/modelControls'
import { screenHeight } from '../lib/viewport'
import './BackgroundModel.css'

// Eryk.glb = Eryk.dae przekonwertowany i skompresowany (meshopt + tekstury WebP 1024 px)
const MODEL_URL = '/models/Eryk.glb'
const TARGET = 4.6 // najdłuższy bok modelu w jednostkach sceny
const MODEL_SCALE = 0.62 // ogólny rozmiar modelu na ekranie
// telefon (ekran pionowy): model po rozszerzeniu koła niżej (ułamek wysokości ekranu) i nieco mniejszy
const PORTRAIT_DROP = 0.08
const PORTRAIT_SCALE = 0.85
const BASE_ROTATION = -0.5 // obrót startowy (rad) — widok 3/4

// Soczewka w Hero (jak w STILL): model widać tylko w kole, które podąża za kursorem.
// Przy przewijaniu koło rośnie do pełnego ekranu, a model wraca na środek.
const LENS_RADIUS = 180 // px, promień koła w Hero (na telefonie mniejszy, patrz lensRadius)
const LENS_ZOOM = 1.15 // model w soczewce jest lekko przybliżony
const LENS_REST = { x: 0.5, y: 0.42 } // pozycja koła bez kursora (ułamek ekranu)
const REVEAL_DISTANCE = 0.8 // ile wysokości ekranu przewijania trwa powiększanie koła

// reakcja na kursor w Hero (radiany)
const HOVER_TILT_Y = 0.45
const HOVER_TILT_X = 0.12

// światło główne: przesunięcie względem modelu i zasięg mapy cieni (jednostki sceny)
const KEY_OFFSET: [number, number, number] = [4, 8, 5]
const SHADOW_EXTENT = 3.2
const ENV_INTENSITY = 0.45 // siła odbić i światła z otoczenia (RoomEnvironment)

const { lerp, clamp, smoothstep } = THREE.MathUtils

type Loaded = { obj: THREE.Object3D; height: number }

// Materiały z modelu mają roughness 1 i zero metalu (wyglądają jak papier).
// Stroimy je po nazwie; env = względna siła odbić otoczenia (RoomEnvironment w <Reflections />).
type Look = { roughness: number; metalness?: number; env?: number }
const LOOKS: [RegExp, Look][] = [
  [/Metal|galvan/i, { roughness: 0.35, metalness: 0.85, env: 1.2 }], // blacha ocynkowana
  [/Gabbiano/i, { roughness: 0.4, metalness: 0.3, env: 1 }], // ciemne ramy i obróbki
  [/Plastic/i, { roughness: 0.45, env: 0.9 }],
  [/Tiles|Floor/i, { roughness: 0.55, env: 0.8 }], // płytki, posadzka
  [/Humano|Pinus|leaves/i, { roughness: 0.9, env: 0.4 }], // ludzie i zieleń — bez połysku
]
const GLASS: Look = { roughness: 0.05, metalness: 0.1, env: 2 }
const MATTE: Look = { roughness: 0.95, env: 0.25 } // beton, tynk, drewno

function enhanceMaterial(m: THREE.Material) {
  if (!(m instanceof THREE.MeshStandardMaterial)) return
  // szkło = przezroczysty materiał, który nie jest liśćmi drzew
  const isGlass = m.transparent && !/Pinus|leaves/i.test(m.name)
  const look = isGlass ? GLASS : LOOKS.find(([re]) => re.test(m.name))?.[1] ?? MATTE
  m.roughness = look.roughness
  m.metalness = look.metalness ?? 0
  m.envMapIntensity = (look.env ?? 1) * ENV_INTENSITY
  m.needsUpdate = true
}

// Odbicia bez zewnętrznych plików HDR: studyjne otoczenie generowane w przeglądarce.
// Mapę przypinamy do każdego materiału osobno (material.envMap), bo tylko wtedy działa
// envMapIntensity z LOOKS — scene.environment świeciłoby jednakowo na wszystko.
function Reflections({ object }: { object: THREE.Object3D | undefined }) {
  const { gl } = useThree()
  useEffect(() => {
    if (!object) return
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    object.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return
      for (const m of ([] as THREE.Material[]).concat(mesh.material)) {
        if (m instanceof THREE.MeshStandardMaterial) {
          m.envMap = env
          m.needsUpdate = true
        }
      }
    })
    return () => {
      env.dispose()
      pmrem.dispose()
    }
  }, [gl, object])
  return null
}

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
          if (!m.isMesh) return
          // model rzuca cień na podłoże i sam na siebie (pergola na tarasie, okap na ścianie)
          m.castShadow = true
          m.receiveShadow = true
          ;([] as THREE.Material[]).concat(m.material).forEach(enhanceMaterial)
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
        // zapas: gdy scena nie rysuje klatek (strona przewinięta poza Hero), useFrame nie zgłosi
        // gotowości — zgłoś ją po wczytaniu, żeby ekran ładowania nie czekał do limitu
        setTimeout(reportModelReady, 300)
      },
      // postęp dla AppLoadera (tylko gdy serwer podał rozmiar pliku)
      (e) => {
        if (e.lengthComputable && e.total > 0) reportModelProgress(e.loaded / e.total)
      },
      (e) => {
        console.error('Nie udało się wczytać modelu', e)
        reportModelReady() // nie blokuj ekranu ładowania, gdy model się nie wczyta
      },
    )
    return () => {
      alive = false
    }
  }, [url])

  return loaded
}

const lensRadius = (w: number) => Math.min(LENS_RADIUS, w * 0.32)

type Motion = {
  reveal: MutableRefObject<number> // 0 = soczewka w Hero, 1 = pełny ekran
  pointer: MutableRefObject<{ x: number; y: number } | null> // kursor w px, null = brak
  layer: RefObject<HTMLDivElement> // tu ustawiamy zmienne CSS soczewki
}

function Model({ reveal, pointer, layer }: Motion) {
  const group = useRef<THREE.Group>(null!)
  const { viewport, camera, size } = useThree()
  const loaded = useModel(MODEL_URL)
  const lens = useRef({ x: 0, y: 0, ready: false })
  const tmp = useRef({ ndc: new THREE.Vector3(), dir: new THREE.Vector3(), hit: new THREE.Vector3() })
  const key = useRef<THREE.DirectionalLight>(null!)

  useEffect(() => {
    camera.lookAt(0, 0, 0)
  }, [camera])

  // gotowość dla AppLoadera: model wczytany i narysowany w pierwszej klatce
  const announced = useRef(false)

  useFrame((state, dt) => {
    if (loaded && !announced.current) {
      announced.current = true
      requestAnimationFrame(() => reportModelReady()) // po narysowaniu tej klatki
    }

    const g = group.current
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

    // po rozszerzeniu soczewki model stoi na środku ekranu
    g.position.x = lerp(hit.x, 0, r)
    // delikatne unoszenie w Hero, jak puszka w STILL
    // telefon (ekran pionowy): model niżej, pod tekstem O nas — więcej miejsca na tekst
    const portrait = size.height > size.width
    const restY = portrait ? -viewport.height * PORTRAIT_DROP : 0
    g.position.y = lerp(hit.y, restY, r) + Math.sin(state.clock.elapsedTime * 0.8) * 0.05 * h

    // przewijanie nie obraca modelu — tylko kursor w Hero i przeciąganie myszką w About
    const nx = pointer.current ? (pointer.current.x / w) * 2 - 1 : 0
    const ny = pointer.current ? -(pointer.current.y / hgt) * 2 + 1 : 0
    const turn = BASE_ROTATION + nx * HOVER_TILT_Y * h + modelControls.dragRotation
    g.rotation.y = lerp(g.rotation.y, turn, k)
    g.rotation.x = lerp(g.rotation.x, -ny * HOVER_TILT_X * h, k)

    const fit = clamp(viewport.width / 6, 0.5, 1) * MODEL_SCALE * (portrait ? PORTRAIT_SCALE : 1) // mniejszy na wąskich ekranach
    g.scale.setScalar(fit * lerp(LENS_ZOOM, 1, r))

    // światło główne jedzie za modelem — dzięki temu obszar cieni jest mały, a cienie ostre
    const light = key.current
    light.position.set(g.position.x + KEY_OFFSET[0], g.position.y + KEY_OFFSET[1], KEY_OFFSET[2])
    light.target.position.copy(g.position)
    light.target.updateMatrixWorld()
  })

  return (
    <>
      {/* ciepłe światło główne (słońce) z miękkim cieniem */}
      <directionalLight
        ref={key}
        intensity={1.9}
        color="#fff3e2"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-SHADOW_EXTENT}
        shadow-camera-right={SHADOW_EXTENT}
        shadow-camera-top={SHADOW_EXTENT}
        shadow-camera-bottom={-SHADOW_EXTENT}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
        shadow-radius={4}
      />
      <Reflections object={loaded?.obj} />
      <ModelGroup group={group} loaded={loaded} />
    </>
  )
}

function ModelGroup({ group, loaded }: { group: RefObject<THREE.Group>; loaded: Loaded | null }) {
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
  const reveal = useRef(0)
  const pointer = useRef<{ x: number; y: number } | null>(null)
  // po zniknięciu modelu (sekcja Realizacje) scena przestaje się renderować
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const vh = screenHeight() // stała wysokość (bez skoków przy chowaniu paska adresu na telefonie)
      const y = window.scrollY
      // po odpięciu sceny Hero (O nas) model odjeżdża w górę razem z nią i znika z ekranu.
      // Warstwa przechodzi z fixed na absolute w miejscu odpięcia — przewija ją sama przeglądarka,
      // równo z tekstem O nas. (Przesuwanie transformem z JS na telefonie spóźnia się
      // za przewijaniem palcem i model podskakuje.)
      const hero = document.getElementById('top')
      const pinEnd = hero ? hero.getBoundingClientRect().top + y + hero.offsetHeight - vh : Infinity
      const offset = Math.max(0, y - pinEnd)
      const el = layer.current
      if (el) {
        el.style.position = offset > 0 ? 'absolute' : ''
        el.style.top = offset > 0 ? `${pinEnd}px` : ''
      }
      setHidden(offset >= vh)

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
        <div className="bg-model__canvas">
          <Canvas
            shadows={{ type: THREE.PCFShadowMap }}
            frameloop={hidden ? 'never' : 'always'}
            camera={{ position: [0, 2.4, 8], fov: 35 }}
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true }}
          >
            {/* rozproszone światło nieba (góra) i odbite od ziemi (dół) — otoczenie robi resztę */}
            <hemisphereLight args={['#f4f1ea', '#b9b2a6', 0.15]} />
            {/* chłodne światło kontrowe od tyłu — rysuje krawędzie bryły */}
            <directionalLight position={[-5, 4, -6]} intensity={0.9} color="#dfe7f2" />
            <Model reveal={reveal} pointer={pointer} layer={layer} />
          </Canvas>
        </div>
      </div>
    </div>
  )
}
