import { useReveal } from '../hooks/useReveal'
import { ProjectCatalog } from "./ProjectCatalog/ProjectCatalog";
import { projects } from "../data/projects";
import './5_Projects.css'


export default function Process() {
  const headingRef = useReveal<HTMLHeadingElement>()

  return (
    <section id="projects" className="section section-border process">
      <div className="container">
        <div className="process__header">
          <h2 ref={headingRef} className="process__title display reveal">
            GOTOWE PROJEKTY
          </h2>
        </div>
<ProjectCatalog projects={projects} />

      </div>

    </section>
  )
}
