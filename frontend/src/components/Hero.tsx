import { useReveal } from '../hooks/useReveal'
import ImageGrid from './ImageGrid'
import StrokeText from './StrokeText';
import ParticleText from './ParticleText';
import './Hero.css'

export default function Hero() {
  const headlineRef = useReveal<HTMLHeadingElement>()

  return (
    <section id="top" className="hero">
      <div className="container hero__top">
        <span className="eyebrow">ARCHITECTURE in LAND DEVELOPMENT<br/>1994</span>
      </div>

      <div className="container">
        <StrokeText
          text="ARCH in LAND"
          strokeColor="#2d2d2d"
          fillColor="#2d2d2d"
          strokeWidth={1}
          drawDuration={1.6}
          fillDelay={0.2}
          stagger={0.095}
          ease="power2.out"
          trigger="mount"
          fillMode="wipe"
          fontSize={150}
          fontWeight={900}
          letterSpacing={-5}
          reverse={false}
        />
      </div>

      <div className="container hero__composition">
        <ImageGrid />
      </div>

      <div className="container hero__scroll">
        <span>Scroll</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </div>
    </section>
  )
}
