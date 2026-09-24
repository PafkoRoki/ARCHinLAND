import SectionHeader from './SectionHeader'
import './3_Models.css'

const models = [
  {
    title: 'ERYK - Dom jednorodzinny',
    url: 'https://sketchfab.com/models/f031c0e298f74d72bffa57cc8f346c1b/embed?autostart=0&annotations_visible=0&preload=0&transparent=0&ui_theme=dark',
  },
]

export default function Models() {
  return (
    <section id="models" className="section models" aria-labelledby="models-title">
      <div className="container">
        <SectionHeader index="03" label="Modele 3D" id="models-title" title="Modele 3D" />
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
