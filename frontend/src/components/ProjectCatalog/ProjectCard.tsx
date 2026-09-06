import type { Project } from "../../data/projects";
import "./ProjectCard.css";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="projectCard">
      <div className="projectCard__image">
        <img src={project.image} alt={project.name} />

        {project.category && (
          <span className="projectCard__badge">
            {project.category}
          </span>
        )}
      </div>

      <div className="projectCard__content">
        <div className="projectCard__header">
          <div>
            <span className="projectCard__eyebrow">Projekt</span>
            <h3>{project.name}</h3>
          </div>
        </div>

        <div className="projectCard__mainStat">
          <span>Powierzchnia użytkowa</span>
          <strong>{project.area.usable} m²</strong>
        </div>

        <div className="projectCard__stats">
          <div>
            <span>Pow. zabudowy</span>
            <strong>{project.area.building} m²</strong>
          </div>

          <div>
            <span>Pow. mieszkalna</span>
            <strong>{project.area.residential} m²</strong>
          </div>
        </div>

        <div className="projectCard__details">
          <div>
            <span>Kondygnacje</span>
            <strong>{project.floors}</strong>
          </div>

          <div>
            <span>Dach</span>
            <strong>{project.roof.angle}°</strong>
          </div>
        </div>
      </div>
    </article>
  );
}