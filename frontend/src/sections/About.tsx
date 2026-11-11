import { Fragment, useEffect, useRef, useState } from 'react'
import CountUp from '../components/CountUp'
import ExperienceCounter from '../components/ExperienceCounter'
import { featuredProjects, projects, srcsetOf } from '../data/realizations'
import './About.css'

// O nas jak sekcja "home-reel" na lusion.co:
// 1. wielki nagłówek w dwóch linijkach (pierwsza wcięta); słowa wjeżdżają od dołu jedno po drugim,
// 2. po prawej opis, liczby i przycisk-pigułka; po lewej, pod nagłówkiem, miniatura ze zdjęciami,
// 3. przy przewijaniu miniatura "przelatuje" ze swojego miejsca do dużej ramki, która zatrzymuje się
//    na środku ekranu, z napisem ZOBACZ [→] REALIZACJE (litery przewijają się po najechaniu),
// 4. w tle gruby pomarańczowy łuk rysuje się razem z przewijaniem.
// Tekst przewija się normalnie (nie jest przyklejony), przyklejona jest tylko duża ramka.

const HEADLINE = ['Projektujemy przestrzeń.', 'Od 1991 roku.']
const TEXT =
  'Nowoczesne osiedla, budynki wielorodzinne i jednorodzinne, hotele oraz obiekty użyteczności publicznej. ' +
  'Kompleksowo: architektura, konstrukcje, instalacje sanitarne i elektryczne. ' +
  'Ponad trzy dekady praktyki na Pomorzu Zachodnim.'
const PHOTO_EVERY_MS = 3200 // co tyle zmienia się zdjęcie w ramce
// łuk w tle (współrzędne rysunku 1440 × 1400); końce biegną daleko poza rysunek
const ARC =
  'M -1200 900 C -800 820, -380 540, -120 330 C 140 120, 420 160, 470 420 S 360 980, 760 1080 S 1380 900, 1580 1260 C 1780 1620, 2200 1700, 2700 1720'

// zdjęcia do ramki: najpierw wybrane realizacje, potem pozostałe (bez powtórek)
const PHOTOS = [...featuredProjects, ...projects]
  .filter((p, i, all) => p.image && all.findIndex((q) => q.slug === p.slug) === i)
  .slice(0, 6)

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

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
  const arcRef = useRef<SVGPathElement>(null)
  const shadowRef = useRef<SVGPathElement>(null)
  const [inView, setInView] = useState(false)
  const [near, setNear] = useState(false) // sekcja blisko ekranu: zdjęcia się zmieniają
  const [photo, setPhoto] = useState(0)

  // tekst wjeżdża raz, gdy sekcja pokaże się na ekranie; zdjęcia zmieniają się tylko blisko ekranu
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    // tekst: obserwujemy sam nagłówek, nie całą sekcję. Sekcja jest bardzo wysoka (z dużą ramką),
    // więc na szerokich ekranach jej widoczny ułamek był za mały i tekst długo się nie pokazywał
    const title = section.querySelector('.about__title')
    const reveal = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), {
      rootMargin: '0px 0px -15% 0px',
    })
    const nearby = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '50% 0px' })
    if (title) reveal.observe(title)
    nearby.observe(section)
    return () => {
      reveal.disconnect()
      nearby.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!near || PHOTOS.length < 2) return
    const id = window.setInterval(() => setPhoto((i) => (i + 1) % PHOTOS.length), PHOTO_EVERY_MS)
    return () => window.clearInterval(id)
  }, [near])

  // przewijanie: ramka przelatuje z miejsca miniatury na miejsce dużej ramki; łuk w tle się rysuje
  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let arcLength = 0
    let lastOffset = -1
    const onScroll = () => {
      const section = sectionRef.current
      const slot = slotRef.current
      const stage = stageRef.current
      const frame = frameRef.current
      if (!section || !slot || !stage || !frame) return
      const vh = window.innerHeight

      // łuk w tle: rysuje się od wejścia sekcji na ekran do połowy jej długości
      const arc = arcRef.current
      const shade = shadowRef.current
      if (arc && shade) {
        if (!arcLength) {
          arcLength = arc.getTotalLength()
          arc.style.strokeDasharray = shade.style.strokeDasharray = `${arcLength}`
        }
        const s = section.getBoundingClientRect()
        const draw = still ? 1 : clamp01((vh - s.top) / (s.height * 0.55))
        // łuk przerysowujemy tylko, gdy realnie urósł (każda zmiana to praca karty graficznej)
        const offset = Math.round(arcLength * (1 - draw))
        if (offset !== lastOffset) {
          lastOffset = offset
          arc.style.strokeDashoffset = shade.style.strokeDashoffset = `${offset}`
        }
      }
      if (still) return

      const a = slot.getBoundingClientRect()
      const b = stage.getBoundingClientRect()
      // 0 = duża ramka wjeżdża od dołu ekranu, 1 = stoi przyklejona na środku
      const pinnedTop = (vh - b.height) / 2
      const t = clamp01((vh - b.top) / Math.max(1, vh - pinnedTop))
      const e = easeInOut(t)
      // ramka leży w miejscu dużej ramki; na starcie przesunięta i zmniejszona do miniatury
      // (zmiana szerokości i wysokości, nie skali, żeby zdjęcia się nie rozciągały)
      frame.style.left = `${((a.left - b.left) * (1 - e)).toFixed(1)}px`
      frame.style.top = `${((a.top - b.top) * (1 - e)).toFixed(1)}px`
      frame.style.width = `${lerp(a.width, b.width, e).toFixed(1)}px`
      frame.style.height = `${lerp(a.height, b.height, e).toFixed(1)}px`
      frame.style.setProperty('--reel', e.toFixed(3))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const toRealizations = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById('realizations')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`about${inView ? ' is-in' : ''}`}
      aria-labelledby="about-title"
    >
      {/* gruby łuk w tle (jak niebieska rura na lusion.co), rysuje się przy przewijaniu.
          Rysunek ma szerokość treści strony (jak tekst), a końce łuku biegną daleko w bok,
          więc na szerokim ekranie łuk dalej przechodzi przez nagłówek i znika za krawędziami ekranu */}
      <svg className="about__arc" viewBox="0 0 1440 1400" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
        <defs>
          <linearGradient id="about-arc-shade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff8a52" />
            <stop offset="0.55" stopColor="#ff6b2c" />
            <stop offset="1" stopColor="#d9531a" />
          </linearGradient>
        </defs>
        <path ref={shadowRef} className="about__arc-shadow" d={ARC} fill="none" strokeWidth="70" strokeLinecap="round" />
        <path ref={arcRef} d={ARC} fill="none" stroke="url(#about-arc-shade)" strokeWidth="70" strokeLinecap="round" />
      </svg>

      <div className="container about__intro">
        <h2 id="about-title" className="about__title">
          <span className="visually-hidden">O nas: </span>
          <span className="about__line about__line--indent">
            <Words text={HEADLINE[0]} />
          </span>
          <span className="about__line">
            <Words text={HEADLINE[1]} from={2} />
          </span>
        </h2>

        {/* miejsce miniatury: sama ramka leży niżej (w dużej ramce) i tu tylko przylatuje */}
        <div ref={slotRef} className="about__slot" aria-hidden="true" />

        <div className="about__side">
          <p className="about__desc">
            <Words text={TEXT} from={4} />
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
          <a className="about__cta" href="#realizations" onClick={toRealizations}>
            <span className="about__cta-dot" aria-hidden="true" />
            <span className="about__cta-text">Zobacz realizacje</span>
            <span className="about__cta-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </div>

      {/* duża ramka: przyklejona na środku ekranu na czas przewinięcia o ok. jeden ekran */}
      <div className="container about__reel">
        <div ref={stageRef} className="about__stage">
          <a
            ref={frameRef}
            className="about__frame"
            href="#realizations"
            onClick={toRealizations}
            aria-label="Zobacz realizacje"
          >
            {PHOTOS.map((p, i) => (
              <img
                key={p.slug}
                className={`about__photo${i === photo ? ' is-on' : ''}`}
                src={p.image}
                srcSet={srcsetOf(p.image) || undefined}
                sizes="(max-width: 768px) 100vw, 92vw"
                alt=""
                loading="lazy"
                decoding="async"
              />
            ))}
            <span className="about__reel-title" aria-hidden="true">
              <RollWord text="Zobacz" />
              <RollWord text="realizacje" />
            </span>
            <span className="about__watch" aria-hidden="true">
              <span className="about__watch-fill" />
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
