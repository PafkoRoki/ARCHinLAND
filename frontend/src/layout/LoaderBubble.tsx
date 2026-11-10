import { useEffect, useRef } from 'react'
import { Mesh, Program, Renderer, Texture, Triangle } from 'ogl'

// Ekran ładowania strony głównej: płynna bańka z "liquid glass" (kilka zlanych kul) na grafitowym tle.
// Przez szkło widać zmieniające się zdjęcia realizacji — środek przezroczysty, obraz zagina się tylko
// na wąskiej zaokrąglonej krawędzi; cienkie refleksy światła na brzegu i miękki cień pod spodem. Bańka rośnie razem z postępem wczytywania modelu 3D.
// Wyjście: bańka zamienia się w koło soczewki z Hero (to samo miejsce i promień), a potem
// tło i zdjęcie gasną — pod spodem jest już ta sama soczewka z modelem.
//
// Zdjęcia: src/assets/loader/*.webp — okładki realizacji 1024×768 (WebP, ~70–110 KB każde).
// Zdjęcie wypełnia kwadrat wokół bańki, więc 1024 px wystarcza nawet dla dużej bańki na ekranie retina.
// Nowe: sharp, resize 1024×768 cover, lekkie wyostrzenie, webp quality 76.

const photos = Object.values(
  import.meta.glob<string>('../assets/loader/*.webp', { eager: true, import: 'default' }),
)

const PHOTO_ASPECT = 1024 / 768
const PHOTO_EVERY = 0.65 // s — jak często zmienia się zdjęcie w bańce
const PHOTO_FADE = 0.12 // s — krótkie przenikanie między zdjęciami
const CENTER = { x: 0.5, y: 0.45 } // środek bańki (ułamek ekranu); napis stoi w tym samym miejscu
// Wyjście w dwóch łagodnych etapach (bez błysku: wcześniej cały ekran przeskakiwał z grafitu na jasne tło w ~0,2 s):
// Wyjście to jedno ciągłe przenikanie, jak w filmie: bańka płynie w soczewkę, a w tym samym czasie
// grafit wokół i zdjęcie w środku powoli przenikają w stronę pod spodem (zachodzące na siebie etapy, bez cięć).
const MORPH_S = 1.3 // s, bańka → koło soczewki
const OUT_START_S = 0.1 // tło wokół koła: grafit przenika w stronę
const OUT_S = 1.7
const IN_START_S = 0.45 // wnętrze koła: zdjęcie przenika w model z soczewki
const IN_S = 1.5

// soczewka z Hero (BackgroundModel): LENS_REST i lensRadius — gdyby zmienne CSS nie były jeszcze ustawione
const LENS_REST = { x: 0.5, y: 0.42 }
const lensRadius = (w: number) => Math.min(180, w * 0.32)

const vertex = /* glsl */ `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragment = /* glsl */ `
precision highp float;

uniform vec2 uRes;      // rozmiar ekranu w px CSS
uniform float uDpr;
uniform float uTime;
uniform vec2 uCenter;   // px CSS, od lewego górnego rogu
uniform float uRadius;  // px CSS
uniform vec3 uLens;     // x, y, r soczewki z Hero (px CSS)
uniform float uMorph;   // 0 = bańka, 1 = koło soczewki
uniform float uOutFade; // tło: 0 = grafit, 1 = przezroczyste (widać stronę)
uniform float uInFade;  // wnętrze koła: 0 = zdjęcie, 1 = przezroczyste (widać soczewkę z modelem)
uniform sampler2D uPhotoA;
uniform sampler2D uPhotoB;
uniform float uMix;     // przenikanie A → B
uniform float uHasPhoto;
uniform float uPhotoAspect;

const vec3 BG = vec3(0.1765); // #2d2d2d — kolor planszy i stopki

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// odległość od brzegu bańki (ujemna w środku), w px
float sdf(vec2 p) {
  float R = uRadius;
  float t = uTime;
  float d = length(p - uCenter) - R * 0.72;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float a = t * (0.35 + 0.11 * fi) + fi * 1.7;
    vec2 off = vec2(cos(a), sin(a * 1.3 + fi)) * R * (0.34 + 0.06 * sin(t * 0.7 + fi));
    float r = R * (0.46 + 0.07 * sin(t * 0.9 + fi * 2.1));
    d = smin(d, length(p - uCenter - off) - r, R * 0.42);
  }
  float lens = length(p - uLens.xy) - uLens.z;
  return mix(d, lens, uMorph);
}

// zdjęcie rozpięte na kwadracie wokół bańki (jak object-fit: cover), nie na całym ekranie —
// widać je tylko w bańce, więc tam trafiają wszystkie piksele pliku
vec3 photo(sampler2D tex, vec2 p, vec2 c, float size) {
  vec2 st = (p - c) / size;
  vec2 ratio = vec2(min(1.0 / uPhotoAspect, 1.0), 1.0); // kwadrat z poziomego zdjęcia: przycięte boki
  vec2 uv = vec2(st.x, -st.y) * ratio + 0.5;
  // poza zdjęciem (mocno zagięty brzeg) — lustrzane odbicie zamiast rozciągniętego ostatniego piksela
  uv = 1.0 - abs(1.0 - mod(uv, 2.0));
  return texture2D(tex, clamp(uv, 0.001, 0.999)).rgb;
}

vec3 scene(vec2 p, vec2 c, float size) {
  return mix(photo(uPhotoA, p, c, size), photo(uPhotoB, p, c, size), uMix);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;
  float d = sdf(p);

  // normalna brzegu (na zewnątrz) z różnic skończonych
  vec2 e = vec2(1.0, 0.0);
  vec2 n = normalize(vec2(sdf(p + e.xy) - sdf(p - e.xy), sdf(p + e.yx) - sdf(p - e.yx)) + 1e-5);

  float R = mix(uRadius, uLens.z, uMorph);
  float glass = 1.0 - uMorph; // soczewka z Hero jest płaska — efekty szkła gasną przy wyjściu

  // liquid glass: płaski, przezroczysty środek i wąska, zaokrąglona krawędź (fazka), tylko ona załamuje obraz
  float rimW = R * 0.24;                            // szerokość zaokrąglonej krawędzi
  float x = clamp(-d / rimW, 0.0, 1.0);             // 0 na samym brzegu, 1 = płaski środek
  float bevel = pow(1.0 - x, 2.6);                  // nachylenie fazki: stromo przy brzegu, zero w środku
  vec2 c = mix(uCenter, uLens.xy, uMorph);
  vec2 q = c + (p - c) * mix(0.94, 1.0, uMorph);    // środek prawie 1:1, minimalnie powiększony
  vec2 refr = q - n * bevel * rimW * 1.35 * glass;  // przy brzegu obraz zagina się do środka
  vec2 ca = n * bevel * 3.5 * glass;                // delikatne rozszczepienie kolorów tylko na fazce

  vec3 inside;
  if (uHasPhoto > 0.5) {
    float size = 2.0 * R * 1.15;
    inside = vec3(scene(refr + ca, c, size).r, scene(refr, c, size).g, scene(refr - ca, c, size).b);
  } else {
    inside = BG + 0.06;
  }

  // światło na szkle: dwa refleksy z przeciwnych stron (góra-lewo mocniej, dół-prawo słabiej)
  float lightA = pow(max(dot(n, normalize(vec2(-0.7, -0.75))), 0.0), 2.0);
  float lightB = pow(max(dot(n, normalize(vec2(0.7, 0.75))), 0.0), 2.0);
  float rimLine = smoothstep(2.2, 0.2, -d);         // cienka jasna linia na samym brzegu (~2 px)
  float sheen = bevel * (0.32 * lightA + 0.14 * lightB); // miękki połysk na fazce
  inside = mix(inside, vec3(1.0), 0.035 * glass);   // szkło lekko rozjaśnia to, co pod nim
  inside += (rimLine * (0.22 + 0.75 * lightA + 0.4 * lightB) + sheen) * glass;

  // na zewnątrz: grafit i miękki cień pod szkłem (bańka "unosi się" nad tłem)
  float ds = sdf(p - vec2(0.0, R * 0.08));
  float shadow = 0.32 * smoothstep(R * 0.35, -R * 0.1, ds) * glass;
  // tło zostaje grafitowe i tylko staje się przezroczyste: czyste przenikanie z warstwą strony.
  // (Wcześniej kolor jednocześnie jaśniał i znikał, więc jasność rosła skokiem w połowie wyjścia.)
  vec3 outside = BG * (1.0 - shadow);

  float mask = smoothstep(1.0, -1.0, d);
  vec3 col = mix(outside, inside, mask);
  // przezroczystość osobno dla tła i wnętrza koła: jasność ekranu rośnie równo, bez skoku
  float alpha = mix(1.0 - uOutFade, 1.0 - uInFade, mask);
  gl_FragColor = vec4(col, alpha);
}
`

const easeInOut = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
// łagodniejsza krzywa do przenikań: bez gwałtownego środka, jasność zmienia się równo
const easeSine = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : 0.5 - 0.5 * Math.cos(Math.PI * t))

/** Czy przeglądarka ma WebGL (bez niego AppLoader zostaje przy wersji z falą). */
export function canUseBubble() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl') || c.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

/** Soczewka z Hero: zmienne CSS ustawiane przez BackgroundModel, a gdy ich jeszcze nie ma — pozycja spoczynkowa. */
function heroLens(w: number, h: number): [number, number, number] {
  const el = document.querySelector<HTMLElement>('.bg-model')
  const read = (name: string) => {
    const v = el ? getComputedStyle(el).getPropertyValue(name).trim() : ''
    return v.endsWith('px') ? parseFloat(v) : NaN
  }
  const x = read('--lens-x')
  const y = read('--lens-y')
  const r = read('--lens-r')
  return [
    Number.isFinite(x) ? x : w * LENS_REST.x,
    Number.isFinite(y) ? y : h * LENS_REST.y,
    Number.isFinite(r) ? r : lensRadius(w),
  ]
}

interface Props {
  progress: number // 0–1
  exiting: boolean // strona gotowa — bańka zamienia się w soczewkę i gaśnie
  onExited: () => void
  onFail: () => void // WebGL nie wystartował — AppLoader pokaże wersję z falą
}

export default function LoaderBubble({ progress, exiting, onExited, onFail }: Props) {
  const boxRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(progress)
  const exitingRef = useRef(exiting)
  const callbacks = useRef({ onExited, onFail })
  progressRef.current = progress
  exitingRef.current = exiting
  callbacks.current = { onExited, onFail }

  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    // własne płótno na każde zamontowanie — po sprzątaniu (loseContext) stary kontekst jest martwy,
    // a React w trybie deweloperskim montuje efekt dwa razy
    const canvas = document.createElement('canvas')
    box.appendChild(canvas)

    let renderer: Renderer
    try {
      renderer = new Renderer({
        canvas,
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      })
    } catch {
      canvas.remove()
      callbacks.current.onFail()
      return
    }
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)

    const makeTexture = () =>
      new Texture(gl, { generateMipmaps: false, minFilter: gl.LINEAR, magFilter: gl.LINEAR })
    const textures: Texture[] = []
    const blank = makeTexture()
    photos.forEach((src) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        const t = makeTexture()
        t.image = img
        textures.push(t)
      }
      img.src = src
    })

    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: false, // jeden przebieg na cały ekran — kolor i alfa zapisywane wprost, bez mieszania
      depthTest: false,
      uniforms: {
        uRes: { value: [1, 1] },
        uDpr: { value: renderer.dpr },
        uTime: { value: 0 },
        uCenter: { value: [0, 0] },
        uRadius: { value: 100 },
        uLens: { value: [0, 0, 100] },
        uMorph: { value: 0 },
        uOutFade: { value: 0 },
        uInFade: { value: 0 },
        uPhotoA: { value: blank },
        uPhotoB: { value: blank },
        uMix: { value: 0 },
        uHasPhoto: { value: 0 },
        uPhotoAspect: { value: PHOTO_ASPECT },
      },
    })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

    const u = program.uniforms
    let w = 0
    let h = 0
    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      renderer.setSize(w, h)
      u.uRes.value = [w, h]
    }
    resize()
    window.addEventListener('resize', resize)

    let shown = 0 // wyświetlany postęp — dojeżdża płynnie do prawdziwego
    let exitStart = -1
    let lens: [number, number, number] | null = null
    let done = false
    const t0 = performance.now()
    let raf = 0

    const frame = (now: number) => {
      const t = (now - t0) / 1000
      shown += (progressRef.current - shown) * 0.08
      u.uTime.value = t
      u.uCenter.value = [w * CENTER.x, h * CENTER.y]
      const base = Math.min(w, h)
      u.uRadius.value = base * (0.22 + 0.12 * shown)

      // zdjęcia: co PHOTO_EVERY s następne, z krótkim przenikaniem
      // przy wyjściu zdjęcie stoi (zmiana zdjęcia w trakcie przenikania w model migała)
      if (textures.length && !exitingRef.current) {
        const step = t / PHOTO_EVERY
        const i = Math.floor(step)
        const into = (step - i) * PHOTO_EVERY
        u.uPhotoA.value = textures[i % textures.length]
        u.uPhotoB.value = textures[(i + 1) % textures.length]
        u.uMix.value = into > PHOTO_EVERY - PHOTO_FADE ? (into - (PHOTO_EVERY - PHOTO_FADE)) / PHOTO_FADE : 0
        u.uHasPhoto.value = 1
      }

      // wyjście: bańka → soczewka z Hero → gaśnie
      if (exitingRef.current) {
        if (exitStart < 0) {
          exitStart = t
          lens = heroLens(w, h)
          // zdjęcia stają: przenikanie w toku dociągnięte do bliższego zdjęcia (bez zamrożonej mieszanki dwóch)
          if (u.uMix.value > 0.5) u.uPhotoA.value = u.uPhotoB.value
          u.uMix.value = 0
        }
        const e = t - exitStart
        u.uLens.value = lens!
        u.uMorph.value = easeInOut(e / MORPH_S)
        u.uOutFade.value = easeSine((e - OUT_START_S) / OUT_S)
        u.uInFade.value = easeSine((e - IN_START_S) / IN_S)
        if (e >= Math.max(OUT_START_S + OUT_S, IN_START_S + IN_S) && !done) {
          done = true
          callbacks.current.onExited()
          return
        }
      } else {
        u.uLens.value = [w * CENTER.x, h * CENTER.y, u.uRadius.value]
      }

      renderer.render({ scene: mesh })
      // pierwsza klatka narysowana — tło z CSS (zasłona do tego czasu) już niepotrzebne, a przeszkadzałoby w gaśnięciu
      box.style.background = 'transparent'
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      canvas.remove()
    }
  }, [])

  return <div ref={boxRef} className="loader-bubble" aria-hidden="true" />
}
