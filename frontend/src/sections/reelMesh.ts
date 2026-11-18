import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Texture,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from 'three'

// Przelot zdjęcia w O nas jak "home-reel" na lusion.co (odczytane z ich kodu):
// zdjęcie to płachta z 32 x 32 kwadracików narysowana w WebGL. Ramki w HTML (miniatura i duża
// ramka) służą tylko do zmierzenia, skąd i dokąd leci obraz.
// - każdy punkt płachty rusza w innym momencie: prawy górny róg pierwszy, lewy dolny ostatni,
//   więc obraz rozciąga się po skosie jak materiał ciągnięty za róg,
// - w połowie drogi płachta wybrzusza się w prawo (do 10% szerokości) i lekko obraca (ok. 3 stopnie),
// - zdjęcie przez cały czas w swoich kolorach (bez filtra na miniaturze),
// - zaokrąglone rogi i przyciemnienie pod napisem liczy sam shader.

const vertexShader = /* glsl */ `
uniform vec2 uFromXY;
uniform vec2 uFromWH;
uniform vec2 uToXY;
uniform vec2 uToWH;
uniform vec2 uView;
uniform float uShow;
varying vec2 vUv;
varying vec2 vWH;
varying float vShow;

void main() {
  // punkt płachty: (0,0) lewy górny róg, (1,1) prawy dolny (jak w układzie strony)
  vec2 p = vec2(position.x + 0.5, 0.5 - position.y);
  // waga: prawy górny róg 0 (rusza pierwszy), lewy dolny 1 (rusza ostatni)
  float w = 1.0 - (pow(p.x, 1.5) + pow(1.0 - p.y, 1.5)) / 2.0;
  vShow = smoothstep(w * 0.3, 0.7 + w * 0.3, uShow);

  vec2 xy = mix(uFromXY, uToXY, vShow);
  vec2 wh = mix(uFromWH, uToWH, vShow);
  // wybrzuszenie w prawo w połowie drogi
  xy.x += mix(wh.x, 0.0, cos(vShow * 6.2831853) * 0.5 + 0.5) * 0.1;

  // lekki obrót wokół środka: najpierw w jedną, potem w drugą stronę
  vec2 base = (p - 0.5) * wh;
  float rot = (smoothstep(0.0, 1.0, vShow) - vShow) * -0.5;
  float s = sin(rot);
  float c = cos(rot);
  base = vec2(base.x * c - base.y * s, base.x * s + base.y * c);

  vec2 screen = xy + wh * 0.5 + base; // px od lewego górnego rogu ekranu
  gl_Position = vec4(screen.x / uView.x * 2.0 - 1.0, 1.0 - screen.y / uView.y * 2.0, 0.0, 1.0);
  vUv = vec2(p.x, 1.0 - p.y);
  vWH = wh;
}
`

const fragmentShader = /* glsl */ `
uniform sampler2D uTex;
uniform vec2 uTexSize;
uniform float uRadius;
uniform float uDim;
varying vec2 vUv;
varying vec2 vWH;

float sdRoundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

void main() {
  // zdjęcie wypełnia ramkę (jak object-fit: cover)
  float frameAspect = vWH.x / vWH.y;
  float imageAspect = uTexSize.x / uTexSize.y;
  vec2 scale = frameAspect > imageAspect ? vec2(1.0, imageAspect / frameAspect) : vec2(frameAspect / imageAspect, 1.0);
  vec2 uv = (vUv - 0.5) * scale + 0.5;
  vec3 color = texture2D(uTex, uv).rgb;

  // przyciemnienie pod napisem ZOBACZ ARCHITEKTURĘ
  color *= 1.0 - uDim * 0.26;

  // zaokrąglone rogi z wygładzoną krawędzią
  float d = sdRoundedBox((vUv - 0.5) * vWH, vWH * 0.5, uRadius);
  float alpha = clamp(0.5 - d, 0.0, 1.0);
  gl_FragColor = vec4(color, alpha);
}
`

export type Rect = { x: number; y: number; w: number; h: number }

export type ReelMesh = {
  /** ustaw położenie (miniatura, duża ramka), postęp przelotu 0..1 i przyciemnienie 0..1, potem rysuj */
  draw: (from: Rect, to: Rect, show: number, dim: number) => void
  resize: () => void
  dispose: () => void
}

/** Tworzy płachtę na podanym płótnie. Zwraca null, gdy przeglądarka nie ma WebGL. */
export function createReelMesh(canvas: HTMLCanvasElement, imageUrl: string, onReady: () => void): ReelMesh | null {
  let renderer: WebGLRenderer
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' })
  } catch {
    return null
  }
  renderer.setClearColor(0x000000, 0)

  const uniforms = {
    uFromXY: { value: new Vector2() },
    uFromWH: { value: new Vector2(1, 1) },
    uToXY: { value: new Vector2() },
    uToWH: { value: new Vector2(1, 1) },
    uView: { value: new Vector2(1, 1) },
    uShow: { value: 0 },
    uTex: { value: null as Texture | null },
    uTexSize: { value: new Vector2(16, 9) },
    uRadius: { value: 10 },
    uDim: { value: 0 },
  }
  const material = new ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true, depthTest: false })
  const geometry = new PlaneGeometry(1, 1, 32, 32)
  const mesh = new Mesh(geometry, material)
  mesh.frustumCulled = false // położenie liczy shader
  const scene = new Scene()
  scene.add(mesh)
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)

  let texture: Texture | null = null
  new TextureLoader().load(imageUrl, (t) => {
    // bez przeliczania kolorów: shader dostaje i oddaje zwykłe wartości sRGB ze zdjęcia
    t.generateMipmaps = true
    t.anisotropy = renderer.capabilities.getMaxAnisotropy()
    texture = t
    uniforms.uTex.value = t
    const img = t.image as HTMLImageElement
    uniforms.uTexSize.value.set(img.naturalWidth || img.width, img.naturalHeight || img.height)
    onReady()
  })

  const resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    renderer.setPixelRatio(dpr)
    renderer.setSize(w, h, false)
    uniforms.uView.value.set(w, h)
  }
  resize()

  return {
    draw(from, to, show, dim) {
      if (!texture) return
      uniforms.uFromXY.value.set(from.x, from.y)
      uniforms.uFromWH.value.set(Math.max(1, from.w), Math.max(1, from.h))
      uniforms.uToXY.value.set(to.x, to.y)
      uniforms.uToWH.value.set(Math.max(1, to.w), Math.max(1, to.h))
      uniforms.uShow.value = show
      uniforms.uDim.value = dim
      renderer.render(scene, camera)
    },
    resize,
    dispose() {
      geometry.dispose()
      material.dispose()
      texture?.dispose()
      renderer.dispose()
    },
  }
}
