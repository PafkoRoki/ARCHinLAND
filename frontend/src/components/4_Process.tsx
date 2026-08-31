import { useReveal } from '../hooks/useReveal'
import Stepper, { Step } from './Stepper';
import './4_Process.css'


export default function Process() {
  const headingRef = useReveal<HTMLHeadingElement>()

  return (
    <section id="process" className="section section-border process">
      <div className="container">
        <div className="process__header">
          <h2 ref={headingRef} className="process__title display reveal">
            PROCES
          </h2>
        </div>

          <Stepper
            initialStep={1}
            onStepChange={(step) => {
              console.log(step);
            }}
            onFinalStepCompleted={() => console.log("All steps completed!")}
            backButtonText="Previous"
            nextButtonText="Next"
          >
            <Step>
              <h2>POZNANIE POTRZEB</h2>
              <img style={{ height: '100px', width: '100%', objectFit: 'cover', objectPosition: 'center -70px', borderRadius: '15px', marginTop: '1em' }} src="/images/1.png" />
              <p>Pierwsze spotkanie z klientem, dokładna analiza potrzeb, stylu życia, oczekiwań oraz możliwości, jakie daje dana przestrzeń.</p>
            </Step>
            <Step>
              <h2>FAZA KONCEPCYJA</h2>
              <img style={{ height: '100px', width: '100%', objectFit: 'cover', objectPosition: 'center -70px', borderRadius: '15px', marginTop: '1em' }} src="/images/2.png" />
              <p>Na podstawie zebranych informacji tworzymy kierunek projektu, układ funkcjonalny i pierwsze decyzje dotyczące charakteru przyszłej architektury.</p>
            </Step>
            <Step>
              <h2>MODELOWANIE 3D</h2>
              <img style={{ height: '100px', width: '100%', objectFit: 'cover', objectPosition: 'center -70px', borderRadius: '15px', marginTop: '1em' }} src="/images/1.png" />
              <p>Przekształcamy pomysł w przestrzeń, strukturę i materiał, sprawdzając proporcje, światło oraz relacje budynku z otoczeniem.</p>
            </Step>
            <Step>
              <h2>PROJEKT BUDOWLANY</h2>
              <img style={{ height: '100px', width: '100%', objectFit: 'cover', objectPosition: 'center -70px', borderRadius: '15px', marginTop: '1em' }} src="/images/3.png" />
              <p>Dopracowujemy rozwiązania techniczne i planistyczne, koordynujemy branże oraz przygotowujemy projekt zgodny z wymaganiami formalnymi.</p>
            </Step>
            <Step>
              <h2>DOKUMENTACJA WYKONAWCZA</h2>
              <img style={{ height: '100px', width: '100%', objectFit: 'cover', objectPosition: 'center -70px', borderRadius: '15px', marginTop: '1em' }} src="/images/4.png" />
              <p>Finalizujemy wszystkie rysunki, zestawienia i detale potrzebne do sprawnego przeprowadzenia realizacji projektu w formie fizycznej.</p>
            </Step>
          </Stepper>
      </div>

    </section>
  )
}
