/// <reference types="vite/client" />
// @ts-nocheck

import { projects } from '../data/realizations'
import AccordionGallery from './AccordionGallery'
import './4_Realizations.css'

// Realne pliki, które faktycznie są w src/assets — importowane przez Vite,
// więc trafią do bundla z poprawnym hashem/URL (w przeciwieństwie do
// wcześniejszych ścieżek "/images/..." wskazujących na pliki, których nie ma).
import osiedlePanoramaImg from '../assets/projects/osiedle-panorama.jpg'
import budynekUslugowoImg from '../assets/projects/budynek-uslugowo-mieszkalny.jpg'
import balticCliffImg from '../assets/projects/Baltic-cliff.jpg'
import balticrivieraImg from '../assets/projects/Baltic-riviera.jpg'
import domnawyspieImg from '../assets/projects/wyspa.jpg'
import szwedImg from '../assets/projects/sjas.jpg'
// TODO: podmienić na docelowe zdjęcia realizacji, gdy będą dostępne.
// Na razie używamy render.png jako tymczasowego zastępstwa, żeby galeria
// nie wyświetlała złamanych obrazków (404 szkodzi UX i SEO).
import placeholderImg from '../assets/render.webp'

const projectImageMap: Record<string, string> = {
  'Osiedle Panorama': osiedlePanoramaImg,
  'Budynek usługowo-mieszkalny': budynekUslugowoImg,
  'Baltic Cliff': balticCliffImg,
  'Baltic Riviera': balticrivieraImg,
  'Dom na wyspie': domnawyspieImg,
  'Dom w konstrukcji szkieletowej': szwedImg,
}

const items = projects.map((project) => ({
  image: projectImageMap[project.id] ?? placeholderImg,
  label: project.name,
  link: '#',
  alt: `${project.name} — ${project.category}, ${project.location}${project.year ? `, ${project.year}` : ''}`,
}))

export default function Projects() {
  return (
    <section id="projects" className="section section-border projects">
      <div className="container">

        <div className="projects__header">
          <h2 className="projects__title display">
            PROJEKTY
            <br />
          </h2>
        </div>

 

        <AccordionGallery
          items={items}
          defaultIndex={2}
          expandRatio={0.52}
          trigger="hover"
          accentColor="#ffffff"
          overlayColor="#2d2d2d"
          textColor="#ffffff"
          grayscale
          showLabels
          duration={0.6}
          ease="power3.out"
          parallax={0.5}
          tilt={8}
          stagger={0.06}
          height={460}
          gap={10}
          radius={16}
          orientation="horizontal"
        />


      </div>

    </section>
  )
}
