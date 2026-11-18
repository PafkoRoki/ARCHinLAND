import SectionHeader from '../components/SectionHeader'
import './Contact.css'

// Kontakt: grafitowe tło jak Opinie i stopka, ale z jednym dużym działaniem — numer telefonu na całą szerokość.
// Pod nim drobne dane biura w siatce z liniami 1px; dolna krawędź styka się z górną linią stopki.
export default function Contact() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="container">
        <SectionHeader index="06" label="Kontakt" id="contact-title" />

        <div className="contact__lead">
          <p className="contact__intro">
            Zadzwoń albo napisz, porozmawiamy o działce i o tym, co chcesz na niej zbudować.
          </p>
          <a className="contact__phone" href="tel:+48790820114">
            790 820 114
          </a>
          <a className="contact__mail" href="mailto:ARCHinLAND@wp.pl">
            ARCHinLAND@wp.pl
          </a>
        </div>

        <div className="contact__details">
          <div className="contact__block">
            <span className="contact__label">Studio</span>
            <p className="contact__value">ARCHinLAND</p>
          </div>

          <div className="contact__block">
            <span className="contact__label">Architekt</span>
            <p className="contact__value">Andrzej Kurka</p>
          </div>

          <div className="contact__block">
            <span className="contact__label">Biuro</span>
            <p className="contact__value">Wolińska 11d, 72-400 Kamień Pomorski</p>
          </div>
        </div>
      </div>
    </section>
  )
}
