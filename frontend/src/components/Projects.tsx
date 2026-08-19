/// <reference types="vite/client" />
// @ts-nocheck

import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'
import { useReveal } from '../hooks/useReveal'
import './Projects.css'

export default function Projects() {
  const headingRef = useReveal<HTMLHeadingElement>()

  return (
    <section id="projects" className="section section-border projects">
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
