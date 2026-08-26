import { useReveal } from '../hooks/useReveal'
import ScrollStack, { ScrollStackItem } from './ScrollStack'
import './Process.css'

const STEPS = [
  {
    number: '01',
    title: 'POZNANIE POTRZEB',
    text: 'Pierwsze spotkanie z klientem, dokładna analiza potrzeb, stylu życia, oczekiwań oraz możliwości, jakie daje dana przestrzeń.',
    image: '/images/1.png',
  },
  {
    number: '02',
    title: 'FAZA KONCEPCYJA',
    text: 'Na podstawie zebranych informacji tworzymy kierunek projektu, układ funkcjonalny i pierwsze decyzje dotyczące charakteru przyszłej architektury.',
    image: '/images/2.png',
  },
  {
    number: '03',
    title: 'MODELOWANIE\n3D',
    text: 'Przekształcamy pomysł w przestrzeń, strukturę i materiał, sprawdzając proporcje, światło oraz relacje budynku z otoczeniem.',
    image: '/images/3.png',
  },
  {
    number: '04',
    title: 'PROJEKT BUDOWLANY',
    text: 'Dopracowujemy rozwiązania techniczne i planistyczne, koordynujemy branże oraz przygotowujemy projekt zgodny z wymaganiami formalnymi.',
    image: '/images/4.png',
  },
  {
    number: '05',
    title: 'DOKUMENTACJA WYKONAWCZA',
    text: 'Finalizujemy wszystkie rysunki, zestawienia i detale potrzebne do sprawnego przeprowadzenia realizacji projektu w formie fizycznej.',
    image: '/images/4.png',
  },
]

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

        <ScrollStack useWindowScroll className="process__stack">
          {STEPS.map((step) => (
            <ScrollStackItem key={step.number} itemClassName="process__stack-card">
              <div className="process__content">
                <span className="process__number display">{step.number}</span>
                <h3 className="process__title-sm display">{step.title}</h3>
                <p className="process__text">{step.text}</p>
              </div>
              {step.image && (
                <div className="process__image-slot">
                  <img src={step.image} alt="" />
                </div>
              )}
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>

    </section>
  )
}
