import { useReveal } from '../hooks/useReveal'
import './2_About.css'
import panorama from "../assets/1.webp";
import GlassSurface from './GlassSurface'

export default function About() {
  const statementRef = useReveal<HTMLHeadingElement>()
  const imageRef = useReveal<HTMLDivElement>()

  return (
    <section id="about" className="section section-border about">
      <div className="container about__grid">

        <div className="about__body">
          <h2 ref={statementRef} className="about__statement display reveal">
            BIURO
          </h2>

          <p className="body-lg about__paragraph">
            ARCHITECTURE in LAND DEVELOPMENT to biuro prowadzone przez Andrzeja Kurkę. Od 30 lat
            łączymy projektowanie architektoniczne z wiedzą techniczną, tworząc wielobranżowe,
            nowoczesne realizacje dopasowane do miejsca i wymagań prawa budowlanego.
          </p>
        </div>

        <div ref={imageRef} className="about__image reveal reveal-delay-1">
          <img
            src={panorama}
            alt="Rzuty i przekroje architektoniczne domu jednorodzinnego przygotowane przez biuro ARCHinLAND"
            loading="lazy"
          />
        </div>

        <a
          className="about__glass-map-link"
          href="https://maps.app.goo.gl/Smgh5WnrprgJWvn59?g_st=ig"
          target="_blank"
          rel="noreferrer"
          aria-label="Otwórz lokalizację ARCHITECTURE IN LAND DEVELOPMENT - Andrzej Kurka w Google Maps"
        >
          <GlassSurface
            className="about__glass-showcase"
            width="100%"
            height="auto"
            borderRadius={16}
            ripple
          >
            <div className="about__glass-content">
              <strong>ARCHITECTURE IN LAND DEVELOPMENT</strong>
              <span className="about__glass-line" aria-hidden="true" />
              <span className="about__glass-link">
                ANDRZEJ KURKA / OTWÓRZ MAPĘ
              </span>
            </div>
          </GlassSurface>
        </a>

          <GlassSurface
            className="about__stats"
            width="100%"
            height="auto"
            borderRadius={16}
            ripple
          >
            <div className="about__stats-content" aria-label="Informacje o pracowni">
              <div className="about__stat">
                <strong>30+</strong>
                <span>LAT DOŚWIADCZENIA</span>
              </div>
              <div className="about__stat">
                <strong>∞</strong>
                <span>MOŻLIWOŚCI PROJEKTOWE</span>
              </div>
          </div>
          </GlassSurface>
      </div>
    </section>
  )
}
