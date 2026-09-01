import { useReveal } from '../hooks/useReveal'
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


      </div>

    </section>
  )
}
