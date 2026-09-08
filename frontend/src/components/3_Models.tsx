import { useReveal } from '../hooks/useReveal'
import './3_Models.css'

const models = [
  {
    title: 'GRYF - Bliźniak Dom jednorodzinny',
    url: 'https://sketchfab.com/models/f031c0e298f74d72bffa57cc8f346c1b/embed?autostart=0&annotations_visible=0&preload=0&transparent=0&ui_theme=dark',
  },
  {
    title: 'Model architektoniczny 2',
    url: 'https://sketchfab.com/models/ee3ad68e9bd242ea980e04a0d437ad9d/embed?autostart=0&annotations_visible=0&preload=0&transparent=0&ui_theme=dark',
  },
  {
    title: 'Model architektoniczny 3',
    url: 'https://sketchfab.com/models/070bb56b3d4347e081efe243e89d1506/embed?autostart=0&annotations_visible=0&preload=0&transparent=0&ui_theme=dark',
  },
]

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

 

        <div className="models__grid">
          {models.map((model) => (
            <article className="models__feature" key={model.url}>
              <div className="models__embed-wrap">
                <iframe
                  title={model.title}
                  src={model.url}
                  loading="lazy"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; fullscreen; xr-spatial-tracking; execution-while-in-viewport; execution-while-not-rendered; web-share"
                />
              </div>
            </article>
          ))}
        </div>


      </div>
    </section>
  )
}
