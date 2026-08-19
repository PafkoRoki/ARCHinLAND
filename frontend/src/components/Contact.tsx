import { useReveal } from '../hooks/useReveal'
import './Contact.css'

export default function Contact() {
  const titleRef = useReveal<HTMLHeadingElement>()

  return (
    <section id="contact" className="section section-border contact">
      <div className="container">
        <span className="eyebrow">04 — Kontakt</span>

        <h2 ref={titleRef} className="contact__title display reveal">
          LET'S BUILD
          <br />
          SOMETHING
          <br />
          <span className="text-orange">THAT BELONGS.</span>
        </h2>

        <div className="contact__details">
          <div className="contact__block">
            <span className="contact__label">Studio</span>
            <p className="contact__value">ARCHinLAND</p>
            <p className="contact__value contact__value--muted">ARCHITECTURE in LAND DEVELOPMENT</p>
          </div>

          <div className="contact__block">
            <span className="contact__label">Email</span>
            <a className="contact__value contact__link" href="mailto:andrzejkurka70@wp.pl">
              andrzejkurka70@wp.pl
            </a>
          </div>

          <div className="contact__block">
            <span className="contact__label">Lokalizacja</span>
            <p className="contact__value">Wolińska 11d, 72-400 Kamień Pomorski</p>
          </div>
        </div>
      </div>
    </section>
  )
}
