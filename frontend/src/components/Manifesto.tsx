import { useReveal } from '../hooks/useReveal'
import './Manifesto.css'

export default function Manifesto() {
  const titleRef = useReveal<HTMLHeadingElement>()
  const imageRef = useReveal<HTMLDivElement>()

  return (
    <section className="section section-border manifesto">
      <div className="container manifesto__grid">
        <h2 ref={titleRef} className="manifesto__title display reveal">
          ARCHITECTURE
          <br />
          STARTS
          <br />
          <span className="text-orange">WITH LAND.</span>
        </h2>

        <div className="manifesto__side">
          <div ref={imageRef} className="manifesto__image reveal reveal-delay-1">
            <img
              src="https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=1200&q=80&auto=format&fit=crop"
              alt="Open landscape at dusk with a low horizon line"
              loading="lazy"
            />
          </div>

          <p className="body-lg manifesto__text">
            We believe architecture begins before the building.
            <br />
            <br />
            It begins with the land, the light, the horizon, the material,
            and the way people move through a place.
          </p>
        </div>
      </div>
    </section>
  )
}
