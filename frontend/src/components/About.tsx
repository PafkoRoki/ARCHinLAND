import { useReveal } from '../hooks/useReveal'
import './About.css'

export default function About() {
  const statementRef = useReveal<HTMLHeadingElement>()
  const imageRef = useReveal<HTMLDivElement>()

  return (
    <section id="about" className="section section-border about">
      <div className="container about__grid">
        <div className="about__heading">
          <span className="eyebrow">01 — About</span>
        </div>

        <div className="about__body">
          <h2 ref={statementRef} className="about__statement display reveal">
            WE DESIGN ARCHITECTURE
            <br />
            THAT BELONGS <span className="text-orange">TO ITS LAND.</span>
          </h2>

          <p className="body-lg about__paragraph">
            ARCH in LAND is an architecture and development studio focused on
            creating thoughtful buildings, residential environments and
            places that respond to their landscape, context and people.
          </p>

          <div ref={imageRef} className="about__image reveal reveal-delay-1">
            <img
              src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1400&q=80&auto=format&fit=crop"
              alt="Architect reviewing a site model on a studio table"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
