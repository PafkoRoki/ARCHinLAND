import { Fragment, useEffect, useRef, useState } from 'react'
import CountUp from '../components/CountUp'
import ExperienceCounter from '../components/ExperienceCounter'
import { featuredProjects, srcsetOf } from '../data/realizations'
import { lenis, scrollToTarget } from '../lib/smoothScroll'
import type { ReelMesh } from './reelMesh'
import './About.css'

// O nas jak sekcja "home-reel" na lusion.co:
// 1. wielki nagłówek w dwóch linijkach (pierwsza wcięta); słowa wjeżdżają od dołu jedno po drugim,
// 2. po prawej opis, liczby i przycisk-pigułka; po lewej, pod nagłówkiem, miniatura ze zdjęciami,
// 3. przy przewijaniu miniatura "przelatuje" ze swojego miejsca do dużej ramki, która zatrzymuje się
//    na środku ekranu, z napisem ZOBACZ [→] REALIZACJE (litery przewijają się po najechaniu),
// Tekst przewija się normalnie (nie jest przyklejony), przyklejona jest tylko duża ramka.
// Na komputerze przelot rysuje WebGL (reelMesh.ts): zdjęcie jest płachtą, która rozciąga się po
// skosie jak u lusion. Ramka w HTML stoi wtedy w pełnym rozmiarze, przezroczysta, i trzyma tylko
// napis i kliknięcie. Bez WebGL (albo zanim zdjęcie się wczyta) ramka przelatuje jak dawniej.

const HEADLINE = ['Projektujemy', 'od 1991']
const TEXT =
  'Nowoczesne osiedla, budynki wielorodzinne i jednorodzinne, hotele oraz obiekty użyteczności publicznej. ' +
  'Kompleksowo: architektura, konstrukcje, instalacje sanitarne i elektryczne. ' +
  'Ponad trzy dekady praktyki na Pomorzu Zachodnim.'

// zdjęcie w ramce (statyczne): tylko z "Wybranych" realizacji. Bierzemy drugą, bo pierwsza
// otwiera listę Realizacji tuż pod ramką i na wąskim ekranie wyglądałoby to jak jedno zdjęcie dwa razy
const PHOTO = featuredProjects.filter((p) => p.image)[1] ?? featuredProjects.find((p) => p.image)

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

// Przelot zaczyna się dopiero, gdy góra dużej ramki dojedzie do tej części wysokości ekranu
// (1 = od razu, gdy ramka wjeżdża od dołu). Do tego czasu miniatura czeka na środku ekranu.
const FLY_START = 0.6
// Przelot na komputerze (WebGL): gdy przewijanie wejdzie w przelot (postęp z przewijania > FLY_GO),
// zdjęcie samo dolatuje do końca w FLY_TIME sekund, a strona przewija się dalej bez zatrzymania.
// Po przewinięciu z powrotem przed przelot (postęp < FLY_BACK) zdjęcie samo wraca do miniatury.
const FLY_GO = 0.2
const FLY_BACK = 0.05
const FLY_TIME = 1.4
// Razem z przelotem strona sama dojeżdża do miejsca, w którym duża ramka stoi na środku ekranu
// (w górę: do miniatury). Tylko po ruchu kółkiem/touchpadem; każdy kolejny ruch kółka przejmuje
// przewijanie od razu (bez blokowania), a menu i linki przejeżdżają bez zatrzymania.
const easeInOutSine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2

/** Tekst rozbity na słowa; każde wjeżdża od dołu z opóźnieniem (--i), gdy sekcja dostanie .is-in */
function Words({ text, from = 0 }: { text: string; from?: number }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        // spacja poza maską słowa: wewnątrz inline-block na końcu linii znikała i słowa się sklejały
        <Fragment key={i}>
          <span className="about__word">
            <span className="about__word-inner" style={{ ['--i' as string]: from + i }}>
              {word}
            </span>
          </span>{' '}
        </Fragment>
      ))}
    </>
  )
}

/** Słowo na ramce: każda litera podwójna; po najechaniu kolumna liter przesuwa się o jedną w górę */
function RollWord({ text }: { text: string }) {
  return (
    <span className="about__roll">
      {[...text].map((ch, i) => (
        <span className="about__roll-char" key={i} style={{ ['--i' as string]: i }}>
          <span>{ch}</span>
          <span>{ch}</span>
        </span>
      ))}
    </span>
  )
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const slotRef = useRef<HTMLDivElement>(null) // miejsce miniatury (pod nagłówkiem, po lewej)
  const stageRef = useRef<HTMLDivElement>(null) // miejsce dużej ramki (przyklejone na środku ekranu)
  const frameRef = useRef<HTMLAnchorElement>(null) // ramka, która przelatuje z miniatury do dużej ramki
  const canvasRef = useRef<HTMLCanvasElement>(null) // płótno WebGL z płachtą zdjęcia (komputer)
  const [inView, setInView] = useState(false)
  // przelot w WebGL działa (klasa w stanie Reacta: React nadpisuje className przy każdej zmianie)
  const [glOn, setGlOn] = useState(false)

  // tekst wjeżdża raz, gdy nagłówek pokaże się na ekranie
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    // tekst: obserwujemy sam nagłówek, nie całą sekcję. Sekcja jest bardzo wysoka (z dużą ramką),
    // więc na szerokich ekranach jej widoczny ułamek był za mały i tekst długo się nie pokazywał
    const title = section.querySelector('.about__title')
    const reveal = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), {
      rootMargin: '0px 0px -15% 0px',
    })
    if (title) reveal.observe(title)
    return () => reveal.disconnect()
  }, [])

  // przewijanie: ramka przelatuje z miejsca miniatury na miejsce dużej ramki
  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // telefon: sekcja przewija się zwyczajnie z całą stroną (ramka bez przyklejania i przelotu)
    const phone = window.matchMedia('(max-width: 768px)')
    let gl: ReelMesh | null = null
    let glReady = false
    let raf = 0
    let anim = 0 // postęp przelotu w WebGL (0 = miniatura, 1 = duża ramka), biegnie sam w czasie
    let animDir = 0 // 1 = leci do dużej ramki, -1 = wraca do miniatury
    let lastT = performance.now()
    let near = false
    let disposed = false

    // postęp przelotu: 0 = duża ramka wjeżdża od dołu ekranu, 1 = stoi przyklejona na środku
    const measure = () => {
      const slot = slotRef.current
      const stage = stageRef.current
      if (!slot || !stage) return null
      const vh = window.innerHeight
      const s = slot.getBoundingClientRect()
      const b = stage.getBoundingClientRect()
      // miniatura jedzie z tekstem do środka ekranu i tam czeka na przelot (jak u lusion)
      const a = { left: s.left, top: Math.max(s.top, (vh - s.height) / 2), width: s.width, height: s.height }
      const pinnedTop = (vh - b.height) / 2
      const startTop = vh * FLY_START
      return { a, b, t: clamp01((startTop - b.top) / Math.max(1, startTop - pinnedTop)) }
    }

    const clearFrame = (frame: HTMLElement) => {
      for (const p of ['left', 'top', 'width', 'height']) frame.style.removeProperty(p)
    }

    // przelot w HTML (bez WebGL): ramka zmienia położenie i rozmiar
    const domStep = () => {
      const frame = frameRef.current
      const m = measure()
      if (!frame || !m) return
      const { a, b, t } = m
      const e = easeInOut(t)
      // zmiana szerokości i wysokości, nie skali, żeby zdjęcia się nie rozciągały
      frame.style.left = `${((a.left - b.left) * (1 - e)).toFixed(1)}px`
      frame.style.top = `${((a.top - b.top) * (1 - e)).toFixed(1)}px`
      frame.style.width = `${lerp(a.width, b.width, e).toFixed(1)}px`
      frame.style.height = `${lerp(a.height, b.height, e).toFixed(1)}px`
      frame.style.setProperty('--reel', e.toFixed(3))
    }

    // przelot w WebGL: płachta rysowana co klatkę, gdy sekcja jest blisko ekranu
    const glStep = (now: number) => {
      raf = 0
      const dt = Math.min(0.05, Math.max(0, (now - lastT) / 1000))
      lastT = now
      const frame = frameRef.current
      const m = measure()
      if (!gl || !frame || !m || !near || phone.matches) return
      const { a, b, t } = m
      // przewijanie tylko uruchamia przelot (w dół) albo powrót (w górę); dalej biegnie sam w czasie
      const prevDir = animDir
      if (t > FLY_GO) animDir = 1
      else if (t < FLY_BACK) animDir = -1
      if (animDir !== prevDir && prevDir !== 0) pullScroll(animDir)
      anim = clamp01(anim + (animDir * dt) / FLY_TIME)
      // napis i przyciemnienie dopiero pod koniec przelotu (jak "Play Reel" u lusion)
      const reel = clamp01((anim - 0.75) / 0.25)
      frame.style.setProperty('--reel', reel.toFixed(3))
      frame.classList.toggle('is-live', anim > 0.92)
      gl.draw(
        { x: a.left, y: a.top, w: a.width, h: a.height },
        { x: b.left, y: b.top, w: b.width, h: b.height },
        anim,
        reel,
      )
      raf = requestAnimationFrame(glStep)
    }

    const update = () => {
      const section = sectionRef.current
      const frame = frameRef.current
      if (!section || !frame) return
      if (still || phone.matches) {
        // zwykły układ: bez rozmiarów z przelotu (np. po obróceniu ekranu)
        clearFrame(frame)
        frame.style.removeProperty('--reel')
        setGlOn(false)
        return
      }
      if (gl && glReady) {
        setGlOn(true)
        clearFrame(frame)
        if (near && !raf) raf = requestAnimationFrame(glStep)
        return
      }
      domStep()
    }

    // WebGL tylko na komputerze; three.js jest już na stronie (bryły w Hero), więc nic nie dochodzi
    const canvas = canvasRef.current
    if (!still && canvas && PHOTO) {
      const url = PHOTO.image
      import('./reelMesh').then(({ createReelMesh }) => {
        if (disposed) return
        gl = createReelMesh(canvas, url, () => {
          glReady = true
          update()
        })
      })
    }

    // dociąganie przewijania razem z przelotem
    const fine = window.matchMedia('(pointer: fine)').matches
    let userAt = -Infinity
    const markUser = () => {
      userAt = performance.now()
    }
    const offVirtual = lenis?.on('virtual-scroll', markUser)
    const pullScroll = (dir: number) => {
      const l = lenis
      const stage = stageRef.current
      const reelEl = stage?.parentElement
      if (!l || !fine || !stage || !reelEl) return
      if (performance.now() - userAt > 400) return // przewija menu albo link, nie użytkownik
      const vh = window.innerHeight
      const reelTop = reelEl.getBoundingClientRect().top + window.scrollY
      // w dół: duża ramka na środku ekranu; w górę: tuż przed początkiem przelotu (miniatura)
      const target = dir > 0 ? reelTop - (vh - stage.offsetHeight) / 2 : reelTop - vh * FLY_START - 1
      if ((target - l.scroll) * dir <= 0) return // cel już za nami
      l.scrollTo(Math.max(0, target), { duration: FLY_TIME, easing: easeInOutSine })
    }

    const io = new IntersectionObserver(
      ([en]) => {
        near = en.isIntersecting
        if (canvasRef.current) canvasRef.current.style.visibility = near ? 'visible' : 'hidden'
        update()
      },
      { rootMargin: '50% 0px' },
    )
    if (sectionRef.current) io.observe(sectionRef.current)
    const onResize = () => {
      gl?.resize()
      update()
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', onResize)
    phone.addEventListener('change', update)
    return () => {
      disposed = true
      offVirtual?.()
      io.disconnect()
      cancelAnimationFrame(raf)
      gl?.dispose()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', onResize)
      phone.removeEventListener('change', update)
    }
  }, [])

  const toRealizations = (e: React.MouseEvent) => {
    e.preventDefault()
    const target = document.getElementById('realizations')
    if (target) scrollToTarget(target)
  }

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`about${inView ? ' is-in' : ''}${glOn ? ' about--gl' : ''}`}
      aria-labelledby="about-title"
    >
      <div className="container about__intro">
        <h2 id="about-title" className="about__title">
          <span className="visually-hidden">O nas: </span>
          <span className="about__line about__line--indent">
            <Words text={HEADLINE[0]} />
          </span>
          <span className="about__line">
            <Words text={HEADLINE[1]} from={1} />
          </span>
        </h2>

        {/* miejsce miniatury: sama ramka leży niżej (w dużej ramce) i tu tylko przylatuje */}
        <div ref={slotRef} className="about__slot" aria-hidden="true" />

        <div className="about__side">
          <p className="about__desc">
            <Words text={TEXT} from={3} />
          </p>
          <p className="about__stats">
            <span>
              <ExperienceCounter since="1991-01-01" start={inView} />
            </span>
            <span className="about__stat-sep" aria-hidden="true">
              ·
            </span>
            <span>
              <CountUp to={180000} duration={2.2} start={inView} /> m²
            </span>
            <span className="about__stat-sep" aria-hidden="true">
              ·
            </span>
            <span>Kamień Pomorski</span>
          </p>
        </div>
      </div>

      {/* płótno WebGL na cały ekran: rysuje zdjęcie w locie (pod napisem z dużej ramki) */}
      <canvas ref={canvasRef} className="about__gl" aria-hidden="true" />

      {/* duża ramka: przyklejona na środku ekranu na czas przewinięcia o ok. jeden ekran */}
      <div className="container about__reel">
        <div ref={stageRef} className="about__stage">
          <a
            ref={frameRef}
            className="about__frame"
            href="#realizations"
            onClick={toRealizations}
            aria-label="Zobacz architekturę"
          >
            {PHOTO && (
              <img
                className="about__photo"
                src={PHOTO.image}
                srcSet={srcsetOf(PHOTO.image) || undefined}
                sizes="(max-width: 768px) 100vw, 92vw"
                alt=""
                loading="lazy"
                decoding="async"
              />
            )}
            {/* ZOBACZ [→] ARCHITEKTURĘ: cały rząd wyśrodkowany w ramce */}
            <span className="about__reel-title" aria-hidden="true">
              <RollWord text="Zobacz" />
              <span className="about__watch">
                <span className="about__watch-fill" />
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <RollWord text="architekturę" />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
