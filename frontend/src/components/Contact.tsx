import SectionHeader from './SectionHeader'
import './Contact.css'

// Kontakt w stylu stopki (10_Footer): grafitowe tło na całą szerokość, siatka w .container, jasne linie 1px.
// Dolna krawędź styka się z górną linią stopki — razem tworzą jeden blok.
export default function Contact() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <SectionHeader index="06" label="Kontakt" id="contact-title" />

      <div className="container">
      <div className="contact__details">
        <div className="contact__block">
          <span className="contact__label">Studio</span>
          <p className="contact__value">ARCHinLAND</p>
          <p className="contact__value contact__value--muted">ARCHITECTURE in LAND DEVELOPMENT</p>
        </div>

        <div className="contact__block">
          <span className="contact__label">Email</span>
          <a className="contact__value contact__link" href="mailto:ARCHinLAND@wp.pl">
            ARCHinLAND@wp.pl
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
