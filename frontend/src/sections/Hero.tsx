import { PointerEvent, useEffect, useRef, useState } from 'react'
import CountUp from '../components/CountUp'
import StrokeText from '../components/StrokeText'
import { modelControls } from '../lib/modelControls'
import { screenHeight } from '../lib/viewport'
import './Hero.css'

// Przypięta scena jak w STILL (odległości w wysokościach ekranu, liczone od góry strony):
//   0 → 0.8   koło z modelem rozszerza się do pełnego ekranu (BackgroundModel, REVEAL_DISTANCE)
//   0.85 → 1.25  pojawia się tekst O nas na cały ekran (czas na czytanie do 1.9)
//   1.9 → 2.6    tekst odjeżdża w górę jak kartka i odsłania model
//   od 2.6       model można obracać myszką / palcem
//   do 4.6    scena stoi w miejscu (--hero-pin w Hero.css), potem wjeżdżają Realizacje
// Długość sceny = 1 ekran + PIN_LENGTH — ustawiona w Hero.css (--hero-pin).
const ABOUT_START = 0.85
const ABOUT_END = 1.25
const LEAD_OUT_START = 1.9
const LEAD_OUT_END = 2.6
const DRAG_SPEED = 0.008 // radiany na piksel przeciągnięcia

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const lastX = useRef<number | null>(null)
  // tekst O nas pokazał się choć raz → liczniki ruszają (warstwa jest na ekranie od początku,
  // tylko przezroczysta, więc IntersectionObserver tu nie zadziała)
  const [aboutOn, setAboutOn] = useState(false)

  // postęp pojawiania się tekstu O nas → zmienna CSS --about (0–1)
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const vh = screenHeight() // stała wysokość (telefon: pasek adresu)
      const p = window.scrollY / vh
      const about = smoothstep(ABOUT_START, ABOUT_END, p)
      el.style.setProperty('--about', about.toFixed(3))
      if (about > 0.6) setAboutOn(true)
      // tekst odjeżdża liniowo (jak zwykłe przewijanie), potem model jest do obracania
      const leadOut = Math.min(1, Math.max(0, (p - LEAD_OUT_START) / (LEAD_OUT_END - LEAD_OUT_START)))
      el.style.setProperty('--lead-out', leadOut.toFixed(4))
      el.style.setProperty('--model', smoothstep(LEAD_OUT_END - 0.1, LEAD_OUT_END + 0.2, p).toFixed(3))
      el.dataset.model = leadOut > 0.9 ? 'on' : 'off'
      // podpowiedź przewijania znika przy pierwszym ruchu
      el.style.setProperty('--intro', (1 - smoothstep(0, 0.2, p)).toFixed(3))

      // wskaźnik przewijania w O nas: model stoi, ale linia się wypełnia — strona nadal jedzie.
      // 0 = początek tekstu O nas, 1 = odpięcie sceny (wjeżdżają Realizacje)
      const pinEnd = (el.offsetHeight - vh) / vh // w wysokościach ekranu
      const progress = Math.min(1, Math.max(0, (p - ABOUT_START) / Math.max(0.01, pinEnd - ABOUT_START)))
      el.style.setProperty('--pin', progress.toFixed(4))
      const outro = 1 - smoothstep(0.9, 1, progress) // koniec sceny: model ucięty do zera
      el.style.setProperty('--pin-show', (about * outro).toFixed(3))
      el.style.setProperty('--outro', outro.toFixed(3))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // przeciąganie myszką / palcem w poziomie obraca model
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    lastX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (lastX.current === null) return
    modelControls.dragRotation += (e.clientX - lastX.current) * DRAG_SPEED
    lastX.current = e.clientX
  }
  const onUp = () => {
    lastX.current = null
  }

  return (
    <section id="top" ref={sectionRef} className="hero" data-model="off" aria-labelledby="hero-title">
      {/* kotwica menu "O nas" — miejsce w scenie, w którym tekst jest już widoczny */}
      <span id="about" className="hero__anchor" aria-hidden="true" />

      {/* napis stoi w miejscu przez całą scenę, POD modelem 3D */}
      <div className="hero__layer hero__layer--title">
        <h1 id="hero-title" className="hero__title">
          <StrokeText
            text="ARCHinLAND"
            strokeColor="#2d2d2d"
            fillColor="#ffffff"
            strokeWidth={50}
            drawDuration={1.6}
            fillDelay={0.2}
            stagger={0.095}
            ease="power2.out"
            trigger="mount"
            fillMode="wipe"
            fontSize={150}
            fontWeight={900}
            letterSpacing={-5}
          />
          <span className="visually-hidden">
            ARCHinLAND — biuro architektoniczne Andrzej Kurka, Kamień Pomorski
          </span>
        </h1>
      </div>

      {/* podpowiedź przewijania (nad modelem, widoczna tylko na starcie) */}
      <div className="hero__layer hero__layer--intro" aria-hidden="true">
        <span className="hero__scroll-hint">
          <span className="hero__scroll-line" />
          Przewiń
        </span>
      </div>

      {/* wskaźnik przewijania w O nas (prawa krawędź): pokazuje, że strona jedzie, choć model stoi */}
      <div className="hero__layer hero__layer--progress" aria-hidden="true">
        <span className="hero__progress">
          <span className="hero__progress-label">Przewiń</span>
          <span className="hero__progress-track">
            <span className="hero__progress-fill" />
          </span>
          <span className="hero__progress-arrow" />
        </span>
      </div>

      {/* obracanie modelu: aktywne dopiero, gdy tekst O nas odjedzie (data-model="on") */}
      <div
        className="hero__layer hero__layer--drag"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <span className="hero__hint">Przeciągnij, aby obrócić model</span>
      </div>

      {/* tekst O nas na cały ekran, NAD modelem; po przeczytaniu odjeżdża w górę */}
      <div className="hero__layer hero__layer--about">
        <div className="hero__panel">
          <div className="container hero__about">
            <h2 className="visually-hidden">O nas</h2>

            <div className="hero__about-head">
              <span className="hero__tagline">ARCHITECTURE in LAND DEVELOPMENT</span>
              <span className="hero__hand">ARCHinLAND</span>
            </div>

            <div className="hero__stats">
              <p className="hero__stat">
                <span className="hero__stat-num"><CountUp to={35} start={aboutOn} /></span>
                <span className="hero__stat-label">letnie doświadczenie w projektowaniu</span>
              </p>
              <p className="hero__stat">
                <span className="hero__stat-num">
                  <CountUp to={180000} duration={2.2} start={aboutOn} /> m²
                </span>
                <span className="hero__stat-label">zaprojektowanych powierzchni</span>
              </p>
            </div>

            <div className="hero__about-cols">
              <div className="hero__about-col">
                <h3 className="hero__col-title"><span className="hero__col-num" aria-hidden="true">01</span>Projektujemy</h3>
                <ul className="hero__list">
                  <li>nowoczesne, funkcjonalne osiedla mieszkaniowe</li>
                  <li>budynki mieszkalne wielorodzinne i jednorodzinne</li>
                  <li>obiekty użyteczności publicznej oraz hotele i pensjonaty</li>
                </ul>
              </div>
              <div className="hero__about-col">
                <h3 className="hero__col-title"><span className="hero__col-num" aria-hidden="true">02</span>Pełnobranżowe projekty</h3>
                <ul className="hero__list">
                  <li>architektura</li>
                  <li>konstrukcje</li>
                  <li>instalacje sanitarne i elektryczne</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
