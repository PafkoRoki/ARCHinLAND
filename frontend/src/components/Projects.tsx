/// <reference types="vite/client" />
// @ts-nocheck

import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'
import { useReveal } from '../hooks/useReveal'
import AccordionGallery from './AccordionGallery'
import './Projects.css'

const items = [
  { image: '/images/baltic-cliff.jpg', label: 'BALTIC CLIFF', link: '#' },
  { image: '/images/baltic-riviera.jpg', label: 'BALTIC RIVIERA', link: '#' },
  { image: '/images/osiedle-panorama.jpg', label: 'OSIEDLE PANORAMA', link: '#' },
  { image: '/images/budynek-uslugowo-mieszkalny.jpg', label: 'BUDYNEK USŁUGOWO MIESZKALNY', link: '#' },
  { image: '/images/dom-w-konstrukcji-szkieletowej.jpg', label: 'DOM SZKIELETOWY', link: '#' }
];

export default function Projects() {
  const headingRef = useReveal<HTMLHeadingElement>()

  return (
    <section id="projects" className="section section-border projects">
      <div className="container">

        <div className="projects__header">
          <h2 ref={headingRef} className="projects__title display reveal">
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
