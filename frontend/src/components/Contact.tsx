import SectionHeader from './SectionHeader'
import './Contact.css'

export default function Contact() {
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <SectionHeader
          index="07"
          label="Kontakt"
          id="contact-title"
          title={
            <>
              LET'S BUILD
              <br />
              SOMETHING
              <br />
              <span className="contact__accent">THAT BELONGS.</span>
            </>
          }
        />

        <div className="contact__details">
          <div className="contact__block">
            <span className="label">Studio</span>
            <p className="contact__value">ARCHinLAND</p>
            <p className="contact__value contact__value--muted">ARCHITECTURE in LAND DEVELOPMENT</p>
          </div>

          <div className="contact__block">
            <span className="label">Email</span>
            <a className="contact__value contact__link" href="mailto:andrzejkurka70@wp.pl">
              andrzejkurka70@wp.pl
            </a>
          </div>

          <div className="contact__block">
            <span className="label">Lokalizacja</span>
            <p className="contact__value">Wolińska 11d, 72-400 Kamień Pomorski</p>
          </div>
        </div>
      </div>
    </section>
  )
}
