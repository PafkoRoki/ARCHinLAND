import { PointerEvent, useRef } from 'react'
import { modelControls } from '../lib/modelControls'
import './Hero.css'

// Hero: sam model 3D na całym ekranie od pierwszej chwili (bez napisu, soczewki i podpowiedzi).
// Przypięta scena (odległości w wysokościach ekranu, liczone od góry strony):
//   0 → 0.8      bryły stoją; myszą można chwycić pojedynczą bryłę i ją rzucić, palcem stuknąć
//   0.8 → 1.6    tnie je płaszczyzna od dachu do podstawy (CUT_DISTANCE w BackgroundModel)
//   1.6          koniec sceny (--hero-pin w Hero.css), potem sekcja O nas (About.tsx)
const TAP_MS = 300 // stuknięcie: krótsze niż tyle…
const TAP_MOVE = 10 // …i bez przesunięcia palca o więcej niż tyle px (inaczej to przewijanie)

export default function Hero() {
  const layer = useRef<HTMLDivElement>(null)
  const touch = useRef<{ x: number; y: number; t: number } | null>(null)

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') {
      // mysz: chwyt tylko nad bryłą (BackgroundModel sprawdza to w każdej klatce)
      if (!modelControls.hoverShape) return
      modelControls.grab = { x: e.clientX, y: e.clientY }
      e.currentTarget.setPointerCapture(e.pointerId)
      e.currentTarget.dataset.grabbing = '1'
    } else {
      // palec: zapamiętaj, żeby rozpoznać stuknięcie (przewijania nie blokujemy: touch-action pan-y)
      touch.current = { x: e.clientX, y: e.clientY, t: performance.now() }
    }
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    if (modelControls.grab) modelControls.grab = { x: e.clientX, y: e.clientY }
    e.currentTarget.dataset.hover = modelControls.hoverShape ? '1' : '0'
  }
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') {
      modelControls.grab = null
      delete e.currentTarget.dataset.grabbing
      return
    }
    const start = touch.current
    touch.current = null
    if (!start) return
    const quick = performance.now() - start.t < TAP_MS
    const still = Math.hypot(e.clientX - start.x, e.clientY - start.y) < TAP_MOVE
    if (quick && still) modelControls.taps.push({ x: e.clientX, y: e.clientY })
  }
  const onCancel = () => {
    // przeglądarka przejęła palec do przewijania albo mysz wyszła poza okno
    touch.current = null
    modelControls.grab = null
    if (layer.current) delete layer.current.dataset.grabbing
  }

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      {/* nagłówek strony tylko dla wyszukiwarek i czytników ekranu (na ekranie jest sam model) */}
      <h1 id="hero-title" className="visually-hidden">
        ARCHinLAND: Architecture in Land Development. Biuro architektoniczne Andrzej Kurka, Kamień Pomorski, od 1991
      </h1>

      {/* warstwa nad modelem: chwytanie brył myszą, stuknięcia palcem */}
      <div
        ref={layer}
        className="hero__layer hero__layer--drag"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onCancel}
        onLostPointerCapture={onCancel}
      />
    </section>
  )
}
