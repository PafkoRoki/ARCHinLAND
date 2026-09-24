import StrokeText from './StrokeText'
import './1_Hero.css'

// Hero = jeden ekran jak w STILL: duży napis pod modelem 3D (BackgroundModel), model przed nim
export default function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="container hero__inner">
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

        <div className="hero__foot">
          <span className="label">Kamień Pomorski</span>
          <a className="btn-outline" href="#contact">
            Kontakt <span className="plus" aria-hidden="true">→</span>
          </a>
          <a className="hero__scroll" href="#about">
            Scroll
            <span className="hero__scroll-line" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
