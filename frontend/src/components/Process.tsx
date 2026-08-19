import { useReveal } from '../hooks/useReveal'
import './Process.css'

const STEPS = [
  {
    number: '01',
    title: 'Poznanie potrzeb',
    text: 'Zaczynamy od rozmowy, analizy działki lub inwestycji oraz ustalenia budżetu, priorytetów i oczekiwań.',
  },
  {
    number: '02',
    title: 'IDEA',
    text: 'Developing the architectural concept.',
  },
  {
    number: '03',
    title: 'DESIGN',
    text: 'Translating the idea into space, structure and material.',
  },
  {
    number: '04',
    title: 'DEVELOPMENT',
    text: 'Working through technical and planning requirements.',
  },
  {
    number: '05',
    title: 'REALIZATION',
    text: 'Bringing the project into physical form.',
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
          <span className="eyebrow">03 — How we work</span>
          <h2 ref={headingRef} className="process__title display reveal">
            PROCESS
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
