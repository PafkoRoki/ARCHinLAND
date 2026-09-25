import { ProjectCatalog } from '../components/ProjectCatalog'
import { ProjectDetail } from './ProjectDetail'
import { projects } from '../data/projects'

// Strony katalogu ładowane osobno (lazy) — dane i zdjęcia projektów pobierają się
// dopiero po odblokowaniu hasłem (ProjectGate).
export function CatalogPage() {
  return <ProjectCatalog projects={projects} />
}

export function DetailPage() {
  return <ProjectDetail projects={projects} />
}

// katalog w sekcji Projekty na stronie głównej (nagłówek daje SectionHeader)
export function CatalogSection() {
  return <ProjectCatalog projects={projects} hideHeader />
}
