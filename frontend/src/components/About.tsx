import { useReveal } from '../hooks/useReveal'
import './About.css'

export default function About() {
  const statementRef = useReveal<HTMLHeadingElement>()
  const imageRef = useReveal<HTMLDivElement>()

  return (
    <section id="about" className="section section-border about">
      <div className="container about__grid">
        <div className="about__heading">
          <span className="eyebrow">01 — O nas</span>
        </div>

        <div className="about__body">
          <h2 ref={statementRef} className="about__statement display reveal">
            TWORZYMY ARCHITEKTURE
            <br />
            <span className="text-orange">OD 30 LAT.</span>
          </h2>

          <p className="body-lg about__paragraph">
            ARCHITECTURE in LAND DEVELOPMENT, biuro prowadzone przez Andrzeja Kurkę, to marka będąca gwarancją 
            inżynieryjnej doskonałości. Działamy nieprzerwanie od trzech dekad. Tworzymy wielobranżowe, złożone i nowoczesne 
            projekty, ze szczególnym uwzględnieniem wymagającego pasa nadmorskiego oraz restrykcyjnego prawa budowlanego.
          </p>

          <div ref={imageRef} className="about__image reveal reveal-delay-1">
            <img
              src="/images/budynek-uslugowo-mieszkalny.jpg"
              alt="Architect reviewing a site model on a studio table"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
