import { Fragment, useEffect, useRef, useState } from 'react'
import CountUp from '../components/CountUp'
import ExperienceCounter from '../components/ExperienceCounter'
import { featuredProjects, srcsetOf } from '../data/realizations'
import './About.css'

// O nas jak sekcja "home-reel" na lusion.co:
// 1. wielki nagłówek w dwóch linijkach (pierwsza wcięta); słowa wjeżdżają od dołu jedno po drugim,
// 2. po prawej opis, liczby i przycisk-pigułka; po lewej, pod nagłówkiem, miniatura ze zdjęciami,
// 3. przy przewijaniu miniatura "przelatuje" ze swojego miejsca do dużej ramki, która zatrzymuje się
//    na środku ekranu, z napisem ZOBACZ [→] REALIZACJE (litery przewijają się po najechaniu),
// Tekst przewija się normalnie (nie jest przyklejony), przyklejona jest tylko duża ramka.

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
  const [inView, setInView] = useState(false)

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
    const onScroll = () => {
      const section = sectionRef.current
      const slot = slotRef.current
      const stage = stageRef.current
      const frame = frameRef.current
      if (!section || !slot || !stage || !frame) return
      const vh = window.innerHeight

      if (still) return
      if (phone.matches) {
        // ramka w zwykłym układzie: bez rozmiarów ustawionych przez przelot (np. po obróceniu ekranu)
        frame.style.removeProperty('left')
        frame.style.removeProperty('top')
        frame.style.removeProperty('width')
        frame.style.removeProperty('height')
        frame.style.removeProperty('--reel')
        return
      }

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
