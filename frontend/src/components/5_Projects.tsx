import { ProjectCatalog } from './ProjectCatalog/ProjectCatalog'
import { projects } from '../data/projects'
import SectionHeader from './SectionHeader'

export default function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeader
          index="04"
          label="Projekty"
          id="projects-title"
          title="Znajdź swój projekt"
          lead="Przeglądaj projekty domów według powierzchni, konstrukcji i najważniejszych parametrów."
        />
        <ProjectCatalog projects={projects} hideHeader />
      </div>
    </section>
  )
}
