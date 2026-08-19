import type { Project } from '../data/projects'
import { useReveal } from '../hooks/useReveal'
import './ProjectCard.css'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const ref = useReveal<HTMLElement>()

  return (
    <article
      ref={ref}
      className={`project-card project-card--${project.size} project-card--${project.orientation} reveal`}
    >
      <a href={`#${project.id}`} className="project-card__link" aria-label={`View project ${project.name}`}>
        <div className="project-card__frame">
          <img src={project.image} alt={`${project.name}, ${project.location}`} loading="lazy" />
          <span className="project-card__view" aria-hidden="true">View project</span>
        </div>

        <div className="project-card__meta">
          <span className="project-card__number">{project.number}</span>
          <div className="project-card__text">
            <h3 className="project-card__name">{project.name}</h3>
            <p className="project-card__details">
              {project.location} — {project.year} — {project.category}
            </p>
          </div>
        </div>
      </a>
    </article>
  )
}
