import { useReveal } from '../hooks/useReveal'
import './2_About.css'
import panorama from "../assets/1.png";
import GlassSurface from './GlassSurface'

export default function About() {
  const statementRef = useReveal<HTMLHeadingElement>()
  const imageRef = useReveal<HTMLDivElement>()

  return (
    <section id="about" className="section section-border about">
      <div className="container about__grid">
        <div ref={imageRef} className="about__image reveal reveal-delay-1">
          <img
            src={panorama}
            alt="Architect reviewing a site model on a studio table"
            loading="lazy"
          />
        </div>

        <div className="about__body">
          <h2 ref={statementRef} className="about__statement display reveal">
            O NAS
          </h2>

          <p className="body-lg about__paragraph">
            ARCHITECTURE in LAND DEVELOPMENT to biuro prowadzone przez Andrzeja Kurkę. Od 30 lat
            łączymy projektowanie architektoniczne z wiedzą techniczną, tworząc wielobranżowe,
            nowoczesne realizacje dopasowane do miejsca i wymagań prawa budowlanego.
          </p>

          <GlassSurface
            className="about__glass-showcase"
            width="100%"
            height="auto"
            borderRadius={16}
            ripple
          >
            <div className="about__glass-content">
              <span className="about__glass-label">MATERIAŁ / PRZESTRZEŃ</span>
              <strong>FORMA, KTÓRA REAGUJE NA ŚWIATŁO</strong>
              <span className="about__glass-line" aria-hidden="true" />
              <span className="about__glass-meta">ARCHinLAND / 2024—2025</span>
            </div>
          </GlassSurface>

          <div className="about__stats" aria-label="Informacje o pracowni">
            <div className="about__stat">
              <strong>30+</strong>
              <span>LAT DOŚWIADCZENIA</span>
            </div>
            <div className="about__stat">
              <strong>∞</strong>
              <span>MOŻLIWOŚCI PROJEKTOWE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
