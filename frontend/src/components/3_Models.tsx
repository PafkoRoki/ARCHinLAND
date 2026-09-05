import { useReveal } from '../hooks/useReveal'
import './3_Models.css'

const modelUrl = 'https://sketchfab.com/models/5dc597aedf3a4c1ea654c8d5cbb73c85/embed?autostart=0&annotations_visible=0&preload=0&transparent=0&ui_theme=dark'

export default function Models() {
  const headingRef = useReveal<HTMLHeadingElement>()

  return (
    <section id="models" className="section section-border projects">
      <div className="container">

        <div className="projects__header">
          <h2 ref={headingRef} className="projects__title display reveal">
            MODELE 3D
            <br />
          </h2>
        </div>

 

        <div className="models__feature">
          <div className="models__embed-wrap">
            <iframe
              title="GRYF - Bliźniak Dom jednorodzinny"
              src={modelUrl}
              loading="lazy"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen; xr-spatial-tracking; execution-while-in-viewport; execution-while-not-rendered; web-share"
            />
          </div>

        </div>


      </div>
    </section>
  )
}
