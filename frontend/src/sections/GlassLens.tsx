import { MutableRefObject, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Soczewka w Hero jako ta sama szklana bańka co ekran ładowania (LoaderBubble.tsx):
// scena rysuje się najpierw do tekstury, a potem przez "szkło", czyli zaokrągloną krawędź,
// która zagina obraz do środka, rozszczepia lekko kolory i ma dwa refleksy światła.
// Liczby (szerokość fazki, siła zagięcia, refleksy) są skopiowane z shadera loadera, żeby przy
// przejściu bańka z loadera i soczewka wyglądały identycznie, bez cięcia.
// Szkło gaśnie, gdy koło rośnie na cały ekran (glass = 0) i wtedy scena rysuje się wprost.

export type LensState = { x: number; y: number; r: number; glass: number } // px CSS, glass 0–1

const vertexShader = /* glsl */ `
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

const fragmentShader = /* glsl */ `
uniform sampler2D tScene;
uniform vec2 uRes;   // rozmiar płótna w px CSS
uniform float uDpr;
uniform vec3 uLens;  // x, y, r soczewki (px CSS, od lewego górnego rogu)
uniform float uGlass;
uniform vec3 uBg;    // tło soczewki (--bg-model), w kolorach ekranu

// próbka sceny w kolorach ekranu, położona na tło soczewki (scena jest w teksturze z kolorami
// przemnożonymi przez alfę i przed mapowaniem tonów)
vec3 sampleOverBg(vec2 uv) {
  vec4 c = texture2D(tScene, uv);
  if (c.a < 0.002) return uBg;
  gl_FragColor = vec4(c.rgb / c.a, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  return gl_FragColor.rgb * c.a + uBg * (1.0 - c.a);
}

vec2 toUv(vec2 q) {
  return vec2(q.x / uRes.x, 1.0 - q.y / uRes.y);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;
  vec2 dv = p - uLens.xy;
  float len = length(dv);
  float R = uLens.z;
  float d = len - R;                      // odległość od brzegu (ujemna w środku)
  vec2 n = dv / max(len, 1e-3);           // normalna brzegu (na zewnątrz)

  // liquid glass jak w loaderze: płaski środek, wąska zaokrąglona krawędź zagina obraz do środka
  float rimW = R * 0.24;
  float x = clamp(-d / rimW, 0.0, 1.0);
  float bevel = pow(1.0 - x, 2.6);
  vec2 refr = p - n * bevel * rimW * 1.35 * uGlass;
  vec2 ca = n * bevel * 3.5 * uGlass;     // delikatne rozszczepienie kolorów na fazce

  if (d > 1.0) {
    gl_FragColor = vec4(0.0); // poza kołem (i tak ucina je clip-path z CSS)
    return;
  }

  // każdy kanał osobno, już na tle soczewki: rozszczepienie kolorów nie robi kolorowych obwódek
  // tam, gdzie bryła styka się z przezroczystym tłem
  vec3 col = vec3(
    sampleOverBg(toUv(refr + ca)).r,
    sampleOverBg(toUv(refr)).g,
    sampleOverBg(toUv(refr - ca)).b
  );

  // refleksy jak w loaderze, dodane w kolorach ekranu
  float lightA = pow(max(dot(n, normalize(vec2(-0.7, -0.75))), 0.0), 2.0);
  float lightB = pow(max(dot(n, normalize(vec2(0.7, 0.75))), 0.0), 2.0);
  float rimLine = smoothstep(2.2, 0.2, -d);
  float sheen = bevel * (0.32 * lightA + 0.14 * lightB);
  float hl = (rimLine * (0.22 + 0.75 * lightA + 0.4 * lightB) + sheen) * uGlass;
  gl_FragColor = vec4(col + hl, 1.0);
}
`

// kolor tła soczewki z CSS (--bg-model) jako kolor ekranu (sRGB): shader kładzie scenę na to tło
function bgColour() {
  const css = getComputedStyle(document.documentElement).getPropertyValue('--bg-model').trim() || '#f0f0f0'
  // setStyle przelicza na kolory liniowe; shader pracuje w kolorach ekranu, więc wracamy do sRGB
  return new THREE.Color().setStyle(css, THREE.SRGBColorSpace).convertLinearToSRGB()
}

export default function GlassLens({ lens }: { lens: MutableRefObject<LensState> }) {
  const { gl, scene, camera, size } = useThree()

  const pass = useMemo(() => {
    // pół-float: kolory sceny przed mapowaniem tonów; 4 próbki = wygładzone krawędzie jak bez tekstury
    const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 })
    const material = new THREE.ShaderMaterial({
      uniforms: {
        tScene: { value: target.texture },
        uRes: { value: new THREE.Vector2() },
        uDpr: { value: 1 },
        uLens: { value: new THREE.Vector3() },
        uGlass: { value: 0 },
        uBg: { value: bgColour() },
      },
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NoBlending,
    })
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    quad.frustumCulled = false
    const quadScene = new THREE.Scene()
    quadScene.add(quad)
    return { target, material, quad, quadScene, quadCamera: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1) }
  }, [])

  useEffect(
    () => () => {
      pass.target.dispose()
      pass.material.dispose()
      pass.quad.geometry.dispose()
    },
    [pass],
  )

  // priorytet 1: ta funkcja przejmuje rysowanie klatki (zamiast automatycznego render() z R3F)
  useFrame(() => {
    const L = lens.current
    if (L.glass <= 0.001 || L.r <= 0) {
      gl.setRenderTarget(null)
      gl.render(scene, camera)
      return
    }

    const dpr = gl.getPixelRatio()
    const w = Math.max(1, Math.floor(size.width * dpr))
    const h = Math.max(1, Math.floor(size.height * dpr))
    const { target, material } = pass
    if (target.width !== w || target.height !== h) target.setSize(w, h)

    // tak jak na ekranie: rysujemy tylko kwadrat wokół soczewki (z zapasem na zagięty brzeg)
    const pad = 4
    const x0 = Math.max(0, (L.x - L.r - pad) * dpr)
    const y0 = Math.max(0, (size.height - L.y - L.r - pad) * dpr)
    const side = (2 * L.r + 2 * pad) * dpr
    target.scissor.set(x0, y0, Math.min(side, w - x0), Math.min(side, h - y0))
    target.scissorTest = true

    gl.setRenderTarget(target)
    gl.render(scene, camera)
    gl.setRenderTarget(null)

    const u = material.uniforms
    u.uRes.value.set(size.width, size.height)
    u.uDpr.value = dpr
    u.uLens.value.set(L.x, L.y, L.r)
    u.uGlass.value = L.glass
    gl.render(pass.quadScene, pass.quadCamera)
  }, 1)

  return null
}
