import { useReveal } from '../hooks/useReveal'
import './Process.css'

const STEPS = [
  {
    number: '01',
    title: 'POZNANIE POTRZEB',
    text: 'Pierwsze spotkanie z klientem, analiza potrzeb i oczekiwań.',
  },
  {
    number: '02',
    title: 'FAZA KONCEPCYJA',
    text: 'Tworzenie koncepcji architektonicznej.',
  },
  {
    number: '03',
    title: 'MODELOWANIE\n3D',
    text: 'Przekształcanie pomysłu w przestrzeń, strukturę i materiał.',
  },
  {
    number: '04',
    title: 'PROJEKT BUDOWLANY',
    text: 'Praca nad wymaganiami technicznymi i planistycznymi.',
  },
  {
    number: '05',
    title: 'DOKUMENTACJA WYKONAWCZA',
    text: 'Przekształcanie projektu w formę fizyczną.',
  },
]

function ProcessStep({ step, index }: { step: (typeof STEPS)[number]; index: number }) {
  const ref = useReveal<HTMLLIElement>()

  return (
    <li ref={ref} className={`process__step reveal reveal-delay-${Math.min(index, 3)}`}>
      <span className="process__number display">{step.number}</span>
      <span className="process__title-sm display">{step.title}</span>
      <p className="process__text">{step.text}</p>
    </li>
  )
}

export default function Process() {
  const headingRef = useReveal<HTMLHeadingElement>()

  return (
    <section id="process" className="section section-border process">
      <div className="container">
        <div className="process__header">
          <span className="eyebrow">03 — Jak działamy</span>
          <h2 ref={headingRef} className="process__title display reveal">
            PROCES
          </h2>
        </div>

        <ol className="process__list">
          {STEPS.map((step, i) => (
            <ProcessStep key={step.number} step={step} index={i} />
          ))}
        </ol>
      </div>
    </section>
  )
}
