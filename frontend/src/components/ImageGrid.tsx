import { useReveal } from '../hooks/useReveal'
import './ImageGrid.css'

export default function ImageGrid() {
  const leftRef = useReveal<HTMLDivElement>()
  const topRef = useReveal<HTMLDivElement>()
  const bottomRef = useReveal<HTMLDivElement>()
  const rightRef = useReveal<HTMLDivElement>()

  return (
    <div className="hero-grid">
      <figure ref={leftRef} className="hero-grid__item hero-grid__left reveal">
        <img
          src="https://raw.githubusercontent.com/PafkoRoki/ARCHinLAND/main/frontend/public/images/Hero1.jpg"
          alt="Minimal timber house set into a sloped, forested plot"
          loading="lazy"
        />
      </figure>

      <div className="hero-grid__center">
        <figure ref={topRef} className="hero-grid__item hero-grid__center-top reveal reveal-delay-1">
          <img
            src="https://raw.githubusercontent.com/PafkoRoki/ARCHinLAND/main/frontend/public/images/Hero2.jpg"
            alt="Wide view of a low concrete residence facing open land"
            loading="lazy"
          />
        </figure>
        <figure ref={bottomRef} className="hero-grid__item hero-grid__center-bottom reveal reveal-delay-2">
          <img
            src="https://raw.githubusercontent.com/PafkoRoki/ARCHinLAND/main/frontend/public/images/Hero3.jpg"
            alt="Architectural site plan and technical drawing"
            loading="lazy"
          />
        </figure>
      </div>

      <figure ref={rightRef} className="hero-grid__item hero-grid__right reveal reveal-delay-3">
        <img
          src="https://raw.githubusercontent.com/PafkoRoki/ARCHinLAND/main/frontend/public/images/Hero4.jpg"
          alt="Tall vertical facade of a residence framed by trees"
          loading="lazy"
        />
      </figure>
    </div>
  )
}
