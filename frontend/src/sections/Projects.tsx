import { lazy, Suspense } from 'react'
import SectionHeader from '../components/SectionHeader'
import ProjectGate from '../components/ProjectGate'

// katalog ładowany dopiero po wpisaniu hasła — zdjęcia projektów nie obciążają strony głównej
const CatalogSection = lazy(() => import('../pages/ProjectPages').then((m) => ({ default: m.CatalogSection })))

export default function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeader index="03" label="Projekty" id="projects-title" />
        <ProjectGate inline>
          <Suspense fallback={null}>
            <CatalogSection />
          </Suspense>
        </ProjectGate>
      </div>
    </section>
  )
}
