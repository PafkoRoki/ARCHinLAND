import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

// Tymczasowy zastępca modelu Eryk.glb: unosząca się gromada brył architektonicznych
// (w stylu lusion.co) — wieże, płyty, łuki, domy, schody, sklepienia, jak makiety z pracowni.
// Bryły stoją pionowo, powoli obracają się wokół osi pionowej, pływają i rozpychają się nawzajem.
// Zero plików do pobrania — wszystko liczy się w przeglądarce.
// Kolory z palety strony (biel, grafit --black, pomarańcz --orange) w różnych wykończeniach.

const COUNT = 24
const CLUSTER_RADIUS = 1.35 // promień gromady (jednostki sceny)
const MIN_S = 0.45 // rozmiar bryły (≈ promień kuli, w której się mieści)
const MAX_S = 0.85
const DRIFT = 0.1 // jak daleko bryła odpływa od swojego miejsca
const SPIN = 0.25 // szybkość obracania brył (rad/s)

// Bryły architektoniczne: wieża, płyta, sześcian, kolumna, łuk, dom z dwuspadowym dachem,
// schody, kształt L, sklepienie, piramida i klin. Każda wyśrodkowana i przeskalowana tak,
// żeby mieściła się w kuli o promieniu 1; fill = ile miejsca zajmuje przy rozpychaniu.
const BEVEL = { bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025, bevelSegments: 3 }

// profil 2D (w płaszczyźnie XY) wyciągnięty na głębokość depth
function extrude(points: [number, number][], depth: number) {
  const shape = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)))
  return new THREE.ExtrudeGeometry(shape, { depth, curveSegments: 24, ...BEVEL })
}

// łuk: prostokąt z półokrągłym otworem
function arch() {
  const w = 1.2 // szerokość
  const h = 1.3 // wysokość
  const r = 0.36 // promień otworu
  const spring = h - 0.3 - r // wysokość, na której zaczyna się półkole
  // profil odwróconego U: otwór sięga do ziemi, więc to obrys, a nie dziura w prostokącie
  const u = new THREE.Shape()
  u.moveTo(-w / 2, 0)
  u.lineTo(-r, 0)
  u.lineTo(-r, spring)
  u.absarc(0, spring, r, Math.PI, 0, true)
  u.lineTo(r, 0)
  u.lineTo(w / 2, 0)
  u.lineTo(w / 2, h)
  u.lineTo(-w / 2, h)
  u.lineTo(-w / 2, 0)
  return new THREE.ExtrudeGeometry(u, { depth: 0.45, curveSegments: 24, ...BEVEL })
}

// sklepienie: półkole wyciągnięte w tunel
function vault() {
  const s = new THREE.Shape()
  s.moveTo(-0.6, 0)
  s.absarc(0, 0, 0.6, Math.PI, 0, true)
  s.lineTo(-0.6, 0)
  return new THREE.ExtrudeGeometry(s, { depth: 1.2, curveSegments: 32, ...BEVEL })
}

function normalize(g: THREE.BufferGeometry) {
  g.center()
  g.computeBoundingSphere()
  const k = 1 / g.boundingSphere!.radius
  g.scale(k, k, k)
  g.computeVertexNormals()
  return g
}

const SHAPES: { geometry: THREE.BufferGeometry; fill: number }[] = [
  { geometry: new RoundedBoxGeometry(0.5, 1.6, 0.5, 2, 0.03), fill: 0.45 }, // wieża
  { geometry: new RoundedBoxGeometry(1.5, 0.22, 1.0, 2, 0.03), fill: 0.55 }, // płyta stropu
  { geometry: new RoundedBoxGeometry(1, 1, 1, 2, 0.04), fill: 0.7 }, // sześcian
  { geometry: new THREE.CylinderGeometry(0.16, 0.16, 1.5, 32), fill: 0.35 }, // kolumna
  { geometry: arch(), fill: 0.65 }, // łuk
  { geometry: extrude([[-0.5, 0], [0.5, 0], [0.5, 0.6], [0, 1.05], [-0.5, 0.6]], 0.9), fill: 0.7 }, // dom
  { geometry: extrude([[0, 0], [1.2, 0], [1.2, 0.3], [0.9, 0.3], [0.9, 0.6], [0.6, 0.6], [0.6, 0.9], [0.3, 0.9], [0.3, 1.2], [0, 1.2]], 0.6), fill: 0.6 }, // schody
  { geometry: extrude([[0, 0], [1.1, 0], [1.1, 0.4], [0.4, 0.4], [0.4, 1.1], [0, 1.1]], 0.5), fill: 0.6 }, // kształt L
  { geometry: vault(), fill: 0.6 }, // sklepienie
  { geometry: new THREE.ConeGeometry(0.7, 0.9, 4), fill: 0.6 }, // piramida
  { geometry: extrude([[0, 0], [1.2, 0], [0, 0.7]], 0.8), fill: 0.55 }, // klin (rampa)
].map((s) => ({ geometry: normalize(s.geometry), fill: s.fill }))

type Item = {
  rest: THREE.Vector3
  pos: THREE.Vector3
  r: number // promień do rozpychania
  size: number
  phase: number
  speed: number
  axis: THREE.Vector3
  base: THREE.Quaternion
  mesh: THREE.Mesh
  inner: THREE.Mesh
}

// prosty, powtarzalny los (ta sama gromada przy każdym wejściu)
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

// szum do chropowatych materiałów (beton, piaskowany metal): mała tekstura liczona w przeglądarce
function noiseTexture(rand: () => number) {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(size, size)
  for (let i = 0; i < size * size; i++) {
    const v = 150 + rand() * 105
    img.data.set([v, v, v, 255], i * 4)
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 3)
  return tex
}

// materiały: połysk (lakier), mat (tynk, guma, beton), metal (chrom, satyna, miedź) i efekty
// (perła mieniąca się kolorami, mleczne szkło). Waga = jak często wypada.
function materials(rand: () => number): { material: THREE.MeshPhysicalMaterial; weight: number }[] {
  const noise = noiseTexture(rand)
  const gloss = { clearcoat: 1, clearcoatRoughness: 0.06 }
  const M = (p: THREE.MeshPhysicalMaterialParameters, weight: number) => ({
    material: new THREE.MeshPhysicalMaterial(p),
    weight,
  })
  return [
    // połysk
    M({ ...gloss, color: '#f4f2ee', roughness: 0.3, envMapIntensity: 0.9 }, 3), // biały lakier
    M({ ...gloss, color: '#2d2d2d', roughness: 0.25, envMapIntensity: 0.7 }, 1.5), // grafitowy lakier
    M({ ...gloss, color: '#ff6b2c', roughness: 0.28, envMapIntensity: 0.8 }, 1.5), // pomarańczowy lakier
    // mat
    M({ color: '#ecebe7', roughness: 0.95, envMapIntensity: 0.3 }, 2.5), // biały tynk
    M({ color: '#cfccc6', roughness: 1, roughnessMap: noise, bumpMap: noise, bumpScale: 0.6, envMapIntensity: 0.25 }, 2), // beton
    M({ color: '#262626', roughness: 0.85, envMapIntensity: 0.2 }, 1.5), // czarna guma
    M({ color: '#ff7a40', roughness: 0.9, sheen: 1, sheenColor: '#ffd2b8', sheenRoughness: 0.5, envMapIntensity: 0.3 }, 1), // pomarańczowy welur
    // metal
    M({ color: '#e6e6e6', metalness: 1, roughness: 0.06, envMapIntensity: 1.4 }, 1.5), // chrom
    M({ color: '#c9c9c9', metalness: 1, roughness: 0.38, roughnessMap: noise, envMapIntensity: 1.2 }, 1.5), // satynowa stal
    M({ color: '#c8774a', metalness: 1, roughness: 0.22, envMapIntensity: 1.2 }, 1), // miedź
    // efekty
    M({ ...gloss, color: '#f6f3f0', roughness: 0.2, iridescence: 1, iridescenceIOR: 1.6, iridescenceThicknessRange: [250, 900], envMapIntensity: 1 }, 1.2), // perła
    M({ color: '#ffffff', roughness: 0.28, transmission: 1, thickness: 0.8, ior: 1.45, envMapIntensity: 1 }, 1), // mleczne szkło
  ]
}

export function createShapeCluster() {
  const rand = rng(11)
  const group = new THREE.Group()
  const mats = materials(rand)
  const total = mats.reduce((sum, m) => sum + m.weight, 0)
  const pick = () => {
    let x = rand() * total
    for (const m of mats) if ((x -= m.weight) <= 0) return m.material
    return mats[0].material
  }
  // wnętrze brył czarne jak przekrój ścian w modelu — widać je, gdy płaszczyzna cięcia przetnie gromadę
  const sectionFill = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide })

  const items: Item[] = []
  for (let i = 0; i < COUNT; i++) {
    // punkty rozłożone równo na kuli (spirala Fibonacciego), wciśnięte do środka na różną głębokość
    const y = 1 - (2 * (i + 0.5)) / COUNT
    const ring = Math.sqrt(1 - y * y)
    const a = i * Math.PI * (3 - Math.sqrt(5))
    const depth = 0.35 + 0.65 * Math.sqrt(rand())
    const rest = new THREE.Vector3(Math.cos(a) * ring, y, Math.sin(a) * ring).multiplyScalar(CLUSTER_RADIUS * depth)
    const size = MIN_S + (MAX_S - MIN_S) * Math.pow(rand(), 1.4)
    const shape = SHAPES[i % SHAPES.length]
    const material = pick()

    const mesh = new THREE.Mesh(shape.geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    const inner = new THREE.Mesh(shape.geometry, sectionFill)
    inner.scale.setScalar(0.995) // minimalnie mniejsze — nie przebija przez powierzchnię
    mesh.add(inner)
    group.add(mesh)

    const base = new THREE.Quaternion().setFromEuler(
      new THREE.Euler((rand() - 0.5) * 0.35, rand() * Math.PI * 2, (rand() - 0.5) * 0.35),
    )
    const axis = new THREE.Vector3((rand() - 0.5) * 0.3, 1, (rand() - 0.5) * 0.3).normalize() // prawie pionowa
    items.push({
      rest,
      pos: rest.clone(),
      r: size * shape.fill,
      size,
      phase: rand() * Math.PI * 2,
      speed: 0.4 + rand() * 0.5,
      axis,
      base,
      mesh,
      inner,
    })
  }

  // gromada stoi na y=0 (pod nią cień), środek na wysokości CLUSTER_RADIUS + zapas na bryły
  const height = 2 * (CLUSTER_RADIUS + MAX_S * 0.6)
  const centreY = height / 2

  const d = new THREE.Vector3()
  const spin = new THREE.Quaternion()

  function tick(t: number) {
    // 1. każda bryła pływa wokół swojego miejsca
    for (const it of items) {
      const w = t * it.speed + it.phase
      it.pos.set(
        it.rest.x + Math.sin(w) * DRIFT,
        it.rest.y + Math.sin(w * 1.3 + 1.7) * DRIFT,
        it.rest.z + Math.cos(w * 0.9) * DRIFT,
      )
    }
    // 2. nachodzące na siebie bryły odpychają się (bryły przybliżone kulami)
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const a = items[i]
          const c = items[j]
          d.subVectors(c.pos, a.pos)
          const dist = d.length() || 1e-4
          const overlap = a.r + c.r - dist
          if (overlap <= 0) continue
          d.multiplyScalar((overlap / dist) * 0.5)
          a.pos.sub(d)
          c.pos.add(d)
        }
      }
    }
    // 3. położenie, obrót i rozmiar
    for (const it of items) {
      it.mesh.position.set(it.pos.x, it.pos.y + centreY, it.pos.z)
      spin.setFromAxisAngle(it.axis, t * SPIN * it.speed)
      it.mesh.quaternion.multiplyQuaternions(spin, it.base)
      it.mesh.scale.setScalar(it.size)
    }
  }

  tick(0)
  return { obj: group as THREE.Object3D, height, tick }
}
