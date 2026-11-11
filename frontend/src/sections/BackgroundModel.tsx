import { MutableRefObject, RefObject, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { modelControls, reportModelProgress, reportModelReady } from '../lib/modelControls'
import { screenHeight } from '../lib/viewport'
import { createShapeCluster, type ClusterCursor } from './shapeCluster'
import GlassLens, { type LensState } from './GlassLens'
import './BackgroundModel.css'

// Eryk.glb = Eryk.dae przekonwertowany i skompresowany (meshopt + tekstury WebP 1024 px)
const MODEL_URL = '/models/Eryk.glb'
// na razie zamiast domu gromada kul (shapeCluster.ts) — false przywraca Eryk.glb
const USE_SHAPE = true
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
// Koniec sceny O nas: pozioma płaszczyzna tnie model od dachu do podstawy (jak rzut na planie),
// aż model zniknie tuż przed odpięciem sceny. Tyle wysokości ekranu przewijania trwa cięcie.
const CUT_DISTANCE = 0.8

// reakcja na kursor w Hero (radiany)
const HOVER_TILT_Y = 0.45
const HOVER_TILT_X = 0.12

// światło główne: przesunięcie względem modelu i zasięg mapy cieni (jednostki sceny)
const KEY_OFFSET: [number, number, number] = [4, 8, 5]
const SHADOW_EXTENT = 3.2
const ENV_INTENSITY = 0.45 // siła odbić i światła z otoczenia (RoomEnvironment)

// gęstość pikseli sceny: model w tle nie potrzebuje pełnej rozdzielczości Retina,
// a na telefonach (ekran dotykowy) każdy piksel kosztuje baterię
const MAX_DPR =
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches ? 1 : 1.5

const { lerp, clamp, smoothstep } = THREE.MathUtils

// tick = animacja obiektu (gromada kul), wołana w każdej klatce
type Loaded = { obj: THREE.Object3D; height: number; tick?: (t: number, dt: number, cursor: ClusterCursor) => void }

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

const SECTION = /section_cut/i
const SECTION_FILL = new THREE.MeshBasicMaterial({ color: 0x000000, name: '_0_Black_section_cut' })

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
          // przekrój: wewnętrzne strony ścian są w SketchUpie czarne (_0_Black_section_cut).
          // Z zewnątrz ich nie widać, a po przecięciu płaszczyzną cięcia wyglądają jak czarne
          // wypełnienie ścian na rzucie. Czysta czerń bez światła i odbić; bez cienia, bo dublują ściany.
          if (SECTION.test(([] as THREE.Material[]).concat(m.material)[0]?.name ?? '')) {
            m.material = SECTION_FILL
            m.castShadow = false
            m.receiveShadow = false
            return
          }
          const materials = ([] as THREE.Material[]).concat(m.material)
          // model rzuca cień na podłoże i sam na siebie (pergola na tarasie, okap na ścianie);
          // teren tylko przyjmuje cień — jego własny i tak leżałby pod modelem, a kosztuje
          m.castShadow = !materials.some((x) => /ziemia/i.test(x.name))
          m.receiveShadow = true
          materials.forEach(enhanceMaterial)
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

// gromada brył: gotowa od razu, bez pobierania pliku. Gotowość zgłasza Model po skompilowaniu
// shaderów; tu tylko zapas, gdy scena nie rysuje klatek (strona otwarta poniżej Hero)
function useShape(): Loaded {
  const [shape] = useState(createShapeCluster)
  useEffect(() => {
    const t = setTimeout(reportModelReady, 2500)
    return () => clearTimeout(t)
  }, [])
  return shape
}

// Kompilacja shaderów w tle, zanim scena się pokaże. Materiały brył są bogate (lakier, perła,
// welur), a three.js potrzebuje dwóch wersji każdego programu: do tekstury (scena pod szklaną
// soczewką, GlassLens) i prosto na ekran (koło rozszerzone na cały ekran). Bez tego pierwsza
// klatka każdej wersji kompilowała je w locie: zacinał się loader, a przy rozszerzeniu koła strona
// stawała na prawie sekundę. compileAsync kompiluje równolegle i nie blokuje strony.
// Uwaga: wersja programu zależy też od liczby płaszczyzn cięcia, a compileAsync bierze ją
// z ostatniego rysowania. Dlatego najpierw rysujemy niewidoczny punkt z płaszczyzną cięcia
// (wszystkie materiały sceny mają jedną: cutPlane), żeby kompilacja trafiła w te same wersje.
async function precompile(
  gl: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  target: THREE.WebGLRenderTarget | null,
  plane: THREE.Plane,
) {
  try {
    const primer = new THREE.Scene()
    const dot = new THREE.Mesh(new THREE.PlaneGeometry(1e-4, 1e-4), new THREE.MeshBasicMaterial({ clippingPlanes: [plane] }))
    primer.add(dot)
    gl.render(primer, camera)
    dot.geometry.dispose()
    ;(dot.material as THREE.Material).dispose()

    const jobs: Promise<unknown>[] = []
    if (target) {
      // wersję programu wybiera aktualny cel rysowania w chwili wywołania
      gl.setRenderTarget(target)
      jobs.push(gl.compileAsync(scene, camera))
      gl.setRenderTarget(null)
    }
    jobs.push(gl.compileAsync(scene, camera))
    await Promise.all(jobs)
  } catch (e) {
    console.warn('Kompilacja shaderów w tle nie powiodła się', e)
  }
}

// stała na poziomie modułu, więc kolejność hooków się nie zmienia
const useSubject = USE_SHAPE ? useShape : () => useModel(MODEL_URL)

const lensRadius = (w: number) => Math.min(LENS_RADIUS, w * 0.32)

type Motion = {
  reveal: MutableRefObject<number> // 0 = soczewka w Hero, 1 = pełny ekran
  cut: MutableRefObject<number> // 0 = cały model, 1 = model ucięty do podstawy (zniknął)
  pointer: MutableRefObject<{ x: number; y: number } | null> // kursor w px, null = brak
  layer: RefObject<HTMLDivElement> // tu ustawiamy zmienne CSS soczewki
  lensState: MutableRefObject<LensState> // soczewka dla szkła (GlassLens)
}

function Model({ reveal, cut, pointer, layer, lensState }: Motion) {
  const group = useRef<THREE.Group>(null!)
  const { viewport, camera, size, gl } = useThree()
  const loaded = useSubject()
  // płaszczyzna cięcia w układzie świata: widać tylko to, co leży poniżej jej wysokości (constant)
  const cutPlane = useRef(new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e6))
  const ground = useRef<THREE.ShadowMaterial>(null!)

  useEffect(() => {
    gl.localClippingEnabled = true
    if (!loaded) return
    // wszystkie obiekty z materiałem — także linie w modelu, nie tylko siatki
    loaded.obj.traverse((child) => {
      const material = (child as THREE.Mesh).material
      if (!material) return
      for (const m of ([] as THREE.Material[]).concat(material)) {
        m.clippingPlanes = [cutPlane.current]
        m.clipShadows = true // cień maleje razem z uciętym modelem
        m.needsUpdate = true
      }
    })
    // cień na ziemi też z płaszczyzną cięcia: wszystkie materiały sceny mają wtedy jedną płaszczyznę,
    // więc wstępna kompilacja shaderów (precompile) trafia we wszystkie wersje programów
    if (ground.current) ground.current.clippingPlanes = [cutPlane.current]
  }, [gl, loaded])

  const lens = useRef({ x: 0, y: 0, ready: false })
  const tmp = useRef({
    ndc: new THREE.Vector3(),
    dir: new THREE.Vector3(),
    hit: new THREE.Vector3(),
    raycaster: new THREE.Raycaster(),
    inverse: new THREE.Matrix4(),
  })
  const key = useRef<THREE.DirectionalLight>(null!)

  useEffect(() => {
    camera.lookAt(0, 0, 0)
  }, [camera])

  // gotowość dla AppLoadera: model wczytany i narysowany w pierwszej klatce
  const announced = useRef(false)

  useFrame((state, dt) => {
    if (loaded && !announced.current) {
      announced.current = true
      // najpierw shadery (w tle), potem rysowanie i zgłoszenie gotowości dla ekranu ładowania
      precompile(gl, state.scene, camera, lensState.current.target, cutPlane.current).then(() => {
        lensState.current.ready = true
        requestAnimationFrame(() => requestAnimationFrame(() => reportModelReady())) // po narysowaniu klatki
      })
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
    // szklana bańka wokół soczewki (jak w loaderze) gaśnie, gdy koło rośnie na cały ekran
    const L = lensState.current
    L.x = lx
    L.y = ly
    L.r = radius
    L.glass = h

    // poza kołem CSS i tak ucina obraz (clip-path) — rysuj tylko prostokąt wokół soczewki
    if (r <= 0.999) {
      const pad = 2
      const x0 = clamp(lx - radius - pad, 0, w)
      const y0 = clamp(hgt - ly - radius - pad, 0, hgt) // WebGL liczy y od dołu
      const x1 = clamp(lx + radius + pad, 0, w)
      const y1 = clamp(hgt - ly + radius + pad, 0, hgt)
      gl.setScissor(x0, y0, x1 - x0, y1 - y0)
      gl.setScissorTest(true)
    } else {
      gl.setScissorTest(false)
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

    // gromada brył: kursor jako przeszkoda — promień spod kursora przeliczony do układu gromady.
    // Działa po rozszerzeniu soczewki (w Hero kursor i tak prowadzi soczewkę z modelem).
    if (loaded?.tick) {
      let cursor: ClusterCursor = null
      const p = pointer.current
      if (p && r > 0.5) {
        g.updateMatrixWorld(true)
        const { raycaster, inverse } = tmp.current
        raycaster.setFromCamera(new THREE.Vector2((p.x / w) * 2 - 1, -(p.y / hgt) * 2 + 1), camera)
        inverse.copy(loaded.obj.matrixWorld).invert()
        cursor = { ray: raycaster.ray.clone().applyMatrix4(inverse), strength: smoothstep(r, 0.5, 1) }
      }
      loaded.tick(state.clock.elapsedTime, dt, cursor)
    }

    // cięcie od góry: wysokość płaszczyzny zjeżdża od dachu do podstawy modelu
    if (loaded) {
      const c = cut.current
      const half = (loaded.height / 2) * g.scale.y
      const top = g.position.y + half
      const bottom = g.position.y - half
      cutPlane.current.constant = c > 0 ? lerp(top + 0.01, bottom - 0.01, c) : 1e6
      // cień na ziemi gaśnie na sam koniec, gdy z domu zostaje tylko podstawa
      ground.current.opacity = GROUND_SHADOW * (1 - smoothstep(c, 0.85, 1))
    }
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
      <ModelGroup group={group} loaded={loaded} ground={ground} />
    </>
  )
}

const GROUND_SHADOW = 0.22 // krycie cienia pod modelem

type ModelGroupProps = {
  group: RefObject<THREE.Group>
  loaded: Loaded | null
  ground: RefObject<THREE.ShadowMaterial>
}

function ModelGroup({ group, loaded, ground }: ModelGroupProps) {
  return (
    <group ref={group}>
      {loaded && (
        // model wyśrodkowany w pionie, cień leży pod jego podstawą
        <group position={[0, -loaded.height / 2, 0]}>
          <primitive object={loaded.obj} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow>
            <circleGeometry args={[TARGET * 0.9, 64]} />
            <shadowMaterial ref={ground} transparent opacity={GROUND_SHADOW} />
          </mesh>
        </group>
      )}
    </group>
  )
}

export default function BackgroundModel() {
  const layer = useRef<HTMLDivElement>(null)
  const reveal = useRef(0)
  const cut = useRef(0)
  const pointer = useRef<{ x: number; y: number } | null>(null)
  const lensState = useRef<LensState>({ x: 0, y: 0, r: 0, glass: 0, target: null, ready: false })
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
      cut.current = smoothstep(y, pinEnd - vh * CUT_DISTANCE, pinEnd)
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
      {/* miękki cień pod szklaną bańką — "unosi się" nad stroną, jak bańka w loaderze */}
      <div className="bg-model__shadow" />
      <div className="bg-model__lens">
        <div className="bg-model__lens-bg" />
        <div className="bg-model__canvas">
          <Canvas
            shadows={{ type: THREE.PCFShadowMap }}
            frameloop={hidden ? 'never' : 'always'}
            camera={{ position: [0, 2.4, 8], fov: 35 }}
            dpr={[1, MAX_DPR]}
            gl={{ alpha: true, antialias: true }}
          >
            {/* rozproszone światło nieba (góra) i odbite od ziemi (dół) — otoczenie robi resztę */}
            <hemisphereLight args={['#f4f1ea', '#b9b2a6', 0.15]} />
            {/* chłodne światło kontrowe od tyłu — rysuje krawędzie bryły */}
            <directionalLight position={[-5, 4, -6]} intensity={0.9} color="#dfe7f2" />
            <Model reveal={reveal} cut={cut} pointer={pointer} layer={layer} lensState={lensState} />
            <GlassLens lens={lensState} />
          </Canvas>
        </div>
      </div>
    </div>
  )
}
