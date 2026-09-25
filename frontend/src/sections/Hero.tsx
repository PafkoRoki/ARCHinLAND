import { PointerEvent, useEffect, useRef } from 'react'
import StrokeText from '../components/StrokeText'
import { modelControls } from '../lib/modelControls'
import './Hero.css'

// Przypięta scena jak w STILL (odległości w wysokościach ekranu, liczone od góry strony):
//   0 → 0.8   koło z modelem rozszerza się do pełnego ekranu (BackgroundModel, REVEAL_DISTANCE)
//   0.85 → 1.25  pojawia się tekst O nas, model można obracać myszką
//   do PIN_LENGTH  scena stoi w miejscu, potem wjeżdżają Realizacje
// Długość sceny = 1 ekran + PIN_LENGTH — ustawiona w Hero.css (--hero-pin).
const ABOUT_START = 0.85
const ABOUT_END = 1.25
const DRAG_SPEED = 0.008 // radiany na piksel przeciągnięcia

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const lastX = useRef<number | null>(null)

  // postęp pojawiania się tekstu O nas → zmienna CSS --about (0–1)
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const p = window.scrollY / window.innerHeight
      const about = smoothstep(ABOUT_START, ABOUT_END, p)
      el.style.setProperty('--about', about.toFixed(3))
      el.dataset.about = about > 0.6 ? 'on' : 'off'
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
    <section id="top" ref={sectionRef} className="hero" data-about="off" aria-labelledby="hero-title">
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

      {/* tekst O nas NAD modelem; pojawia się po rozszerzeniu koła */}
      <div
        className="hero__layer hero__layer--about"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div className="container hero__about">
          <h2 className="visually-hidden">O nas</h2>
          <p className="hero__lead">
            <strong>ARCHIinLAND</strong><br /><br />
            Biuro prowadzone przez <strong>Andrzeja Kurkę</strong>.<br />
            Od 30 lat łączymy <strong>projektowanie architektoniczne</strong><br />
            z wiedzą techniczną,
            tworząc wielobranżowe,<br />
            nowoczesne realizacje
            dopasowane do <br />
            miejsca i wymagań prawa budowlanego.
          </p>
          <span className="label hero__hint">Przeciągnij, aby obrócić model</span>
        </div>
      </div>
    </section>
  )
}
