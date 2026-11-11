import { PointerEvent, useEffect, useRef } from 'react'
import StrokeText from '../components/StrokeText'
import { modelControls } from '../lib/modelControls'
import { screenHeight } from '../lib/viewport'
import './Hero.css'

// Przypięta scena z modelem (odległości w wysokościach ekranu, liczone od góry strony):
//   0 → 0.8      koło z modelem rozszerza się do pełnego ekranu (BackgroundModel, REVEAL_DISTANCE)
//   0.8 → 1.6    model na całym ekranie, można go obracać myszką / palcem
//   1.6 → 2.4    tnie go płaszczyzna od dachu do podstawy (CUT_DISTANCE w BackgroundModel)
//   2.4          koniec sceny (--hero-pin w Hero.css), potem sekcja O nas (About.tsx)
const MODEL_START = 0.8
const DRAG_SPEED = 0.008 // radiany na piksel przeciągnięcia

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const lastX = useRef<number | null>(null)

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const vh = screenHeight() // stała wysokość (telefon: pasek adresu)
      const p = window.scrollY / vh
      // model odsłonięty: podpowiedź obracania i samo obracanie
      el.style.setProperty('--model', smoothstep(MODEL_START - 0.1, MODEL_START + 0.15, p).toFixed(3))
      el.dataset.model = p > MODEL_START - 0.05 ? 'on' : 'off'
      // podpowiedź przewijania znika przy pierwszym ruchu
      el.style.setProperty('--intro', (1 - smoothstep(0, 0.2, p)).toFixed(3))

      // wskaźnik przewijania: model stoi, ale linia się wypełnia, strona nadal jedzie.
      // 0 = model na całym ekranie, 1 = odpięcie sceny (wjeżdża sekcja O nas)
      const pinEnd = (el.offsetHeight - vh) / vh // w wysokościach ekranu
      const progress = Math.min(1, Math.max(0, (p - MODEL_START) / Math.max(0.01, pinEnd - MODEL_START)))
      el.style.setProperty('--pin', progress.toFixed(4))
      const outro = 1 - smoothstep(0.9, 1, progress) // koniec sceny: model ucięty do zera
      el.style.setProperty('--pin-show', (smoothstep(MODEL_START - 0.1, MODEL_START + 0.1, p) * outro).toFixed(3))
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
          {/* od pierwszego ekranu wiadomo, czym jest ARCHinLAND */}
          <span className="hero__tagline">
            <span className="visually-hidden">ARCHinLAND: </span>
            {/* pełna nazwa biura — fraza, pod którą ludzie szukają firmy */}
            <span className="hero__tagline-name">Architecture in Land Development</span>
            Biuro architektoniczne Andrzej Kurka · Kamień Pomorski · od 1991
          </span>
        </h1>
      </div>

      {/* podpowiedź przewijania (nad modelem, widoczna tylko na starcie) */}
      <div className="hero__layer hero__layer--intro" aria-hidden="true">
        <span className="hero__scroll-hint">
          <span className="hero__scroll-line" />
          Scroll
        </span>
      </div>

      {/* wskaźnik przewijania (prawa krawędź): pokazuje, że strona jedzie, choć model stoi */}
      <div className="hero__layer hero__layer--progress" aria-hidden="true">
        <span className="hero__progress">
          <span className="hero__progress-label">Scroll</span>
          <span className="hero__progress-track">
            <span className="hero__progress-fill" />
          </span>
          <span className="hero__progress-arrow" />
        </span>
      </div>

      {/* obracanie modelu: aktywne, gdy model jest na całym ekranie (data-model="on") */}
      <div
        className="hero__layer hero__layer--drag"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <span className="hero__hint">Przeciągnij, aby obrócić model</span>
      </div>

    </section>
  )
}
