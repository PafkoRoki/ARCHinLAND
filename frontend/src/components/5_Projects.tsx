import { ProjectCatalog } from './ProjectCatalog/ProjectCatalog'
import { projects } from '../data/projects'
import SectionHeader from './SectionHeader'

export default function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeader
          index="03"
          label="Projekty"
          id="projects-title"
        />
        <ProjectCatalog projects={projects} hideHeader />
      </div>
    </section>
  )
}
