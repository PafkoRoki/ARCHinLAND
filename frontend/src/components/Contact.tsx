import { useReveal } from '../hooks/useReveal'
import './Contact.css'

export default function Contact() {
  const titleRef = useReveal<HTMLHeadingElement>()

  return (
    <section id="contact" className="section section-border contact">
      <div className="container">
        <span className="eyebrow">04 — Get in touch</span>

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
            <p className="contact__value">ARCH in LAND</p>
            <p className="contact__value contact__value--muted">Architecture &amp; Land Development</p>
          </div>

          <div className="contact__block">
            <span className="contact__label">Email</span>
            <a className="contact__value contact__link" href="mailto:hello@archinland.com">
              hello@archinland.com
            </a>
          </div>

          <div className="contact__block">
            <span className="contact__label">Studio location</span>
            <p className="contact__value">Warsaw / Poland</p>
          </div>
        </div>
      </div>
    </section>
  )
}
