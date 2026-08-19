/// <reference types="vite/client" />
// @ts-nocheck

import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'
import { useReveal } from '../hooks/useReveal'
import AccordionGallery from './AccordionGallery'
import './Projects.css'

const items = [
  { image: 'https://picsum.photos/id/1015/900/1200', label: 'Canyon', link: '#' },
  { image: 'https://picsum.photos/id/1018/900/1200', label: 'Ridgeline', link: '#' },
  { image: 'https://picsum.photos/id/1039/900/1200', label: 'Falls', link: '#' },
  { image: 'https://picsum.photos/id/1043/900/1200', label: 'Harbour', link: '#' },
  { image: 'https://picsum.photos/id/1044/900/1200', label: 'Skyline', link: '#' }
];

export default function Projects() {
  const headingRef = useReveal<HTMLHeadingElement>()

  return (
    <section id="projects" className="section section-border projects">
      <AccordionGallery
  items={items}
  defaultIndex={2}
  expandRatio={0.52}
  trigger="hover"
  accentColor="#ffffff"
  overlayColor="#060010"
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
      <div className="container">
        <div className="projects__header">
          <span className="eyebrow">02 — portfolio</span>
          <h2 ref={headingRef} className="projects__title display reveal">
            WYBRANE
            <br />
            <span className="text-orange">PROJEKTY</span>
          </h2>
        </div>

        <div className="projects__grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
