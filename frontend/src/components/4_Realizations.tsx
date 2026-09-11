/// <reference types="vite/client" />
// @ts-nocheck

import { projects } from '../data/realizations'
import AccordionGallery from './AccordionGallery'
import './4_Realizations.css'

// Realne pliki, które faktycznie są w src/assets — importowane przez Vite,
// więc trafią do bundla z poprawnym hashem/URL (w przeciwieństwie do
// wcześniejszych ścieżek "/images/..." wskazujących na pliki, których nie ma).

import balticCliffImg1 from '../assets/Projects/Baltic-cliff1.jpg'
import balticCliffImg2 from '../assets/Projects/Baltic-cliff2.jpg'
import balticCliffImg3 from '../assets/Projects/Baltic-cliff3.jpg'
import balticCliffImg4 from '../assets/Projects/Baltic-cliff4.jpg'
import balticCliffImg5 from '../assets/Projects/Baltic-cliff5.jpg'
// TODO: podmienić na docelowe zdjęcia realizacji, gdy będą dostępne.
// Na razie używamy render.png jako tymczasowego zastępstwa, żeby galeria
// nie wyświetlała złamanych obrazków (404 szkodzi UX i SEO).
import placeholderImg from '../assets/render.webp'

const projectImageMap: Record<string, string> = {
  'Baltic Cliff': balticCliffImg1,
  'Baltic Cliff': balticCliffImg2,
  'Baltic Cliff': balticCliffImg3,
  'Baltic Cliff': balticCliffImg4,
  'Baltic Cliff': balticCliffImg5,
}

const items = projects.map((project) => ({
  image: projectImageMap[project.id] ?? placeholderImg,
  label: project.name,
  link: '#',
  alt: `${project.name} — ${project.category}, ${project.location}${project.year ? `, ${project.year}` : ''}`,
}))

export default function Projects() {
  return (
    <section id="realizations" className="section section-border projects">
      <div className="container">

 
      <div>
        <AccordionGallery
          items={items}
          defaultIndex={1}
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
        <br/><br/>
        <AccordionGallery
          items={items}
          defaultIndex={1}
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
        <br/><br/>
        <AccordionGallery
          items={items}
          defaultIndex={1}
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
      </div>

    </section>
  )
}
