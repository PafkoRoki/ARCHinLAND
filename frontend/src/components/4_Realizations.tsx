/// <reference types="vite/client" />
// @ts-nocheck

import { projects } from '../data/realizations'
import AccordionGallery from './AccordionGallery'
import './4_Realizations.css'

const items = projects.map((project) => ({
  image: project.image,
  label: project.name,
  link: `/realizacje/${project.slug}`,
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
          radius={0}
          orientation="horizontal"
        />
      </div>
      </div>

    </section>
  )
}