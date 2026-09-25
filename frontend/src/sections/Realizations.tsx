/// <reference types="vite/client" />
// @ts-nocheck

import { useEffect, useState } from 'react'
import { projects } from '../data/realizations'
import AccordionGallery from '../components/AccordionGallery'
import SectionHeader from '../components/SectionHeader'
// krój nazw realizacji (jak w logo Baltic Cliff), tylko 800 italic
import '@fontsource/barlow/800-italic.css'
import './Realizations.css'

// Kolejność galerii w zakładkach (każdy akordeon = wszystkie zdjęcia jednej realizacji)
const GALLERY_SLUGS = ['baltic-cliff', 'apartamentowce', 'baltic-riviera', 'osiedle-panorama', 'sjas']

// Zakładki — realizacja trafia do zakładki według pola `group` w data/realizations.ts
const TABS = [
  { id: 'apartamenty', label: 'Apartamentowce / Hotele' },
  { id: 'osiedla', label: 'Osiedla' },
  { id: 'domy', label: 'Domy jednorodzinne' },
]

// telefon: w akordeonie tylko pierwsze zdjęcie (reszta na podstronie realizacji)
const MOBILE_QUERY = '(max-width: 520px)'

const galleries = GALLERY_SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean)

const itemsFor = (project) =>
  project.gallery.map((image, i) => ({
    image,
    label: `${project.name} · ${i + 1}/${project.gallery.length}`,
    link: `/realizacje/${project.slug}`,
    alt: `${project.name} — ${project.category}, ${project.location}${project.year ? `, ${project.year}` : ''} (zdjęcie ${i + 1})`,
  }))

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export default function Realizations() {
  const [tab, setTab] = useState(TABS[0].id)
  const mobile = useMediaQuery(MOBILE_QUERY)
  const visible = galleries.filter((p) => p.group === tab)

  return (
    <section id="realizations" className="section realizations" aria-labelledby="realizations-title">
      <div className="container">
        <SectionHeader index="02" label="Realizacje" id="realizations-title" />

        <div className="realizations__tabs" role="tablist" aria-label="Rodzaj realizacji">
          {TABS.map((t) => {
            const count = galleries.filter((p) => p.group === t.id).length
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`realizations-tab-${t.id}`}
                aria-controls="realizations-panel"
                aria-selected={tab === t.id}
                className={`btn${tab === t.id ? ' isActive' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label} <span className="realizations__count">({count})</span>
              </button>
            )
          })}
        </div>

        <div
          id="realizations-panel"
          className="realizations__galleries"
          role="tabpanel"
          aria-labelledby={`realizations-tab-${tab}`}
        >
          {visible.map((project) => (
            <figure className="realization" key={project.slug}>
              {/* podpis galerii jak opis na rysunku: nazwa + dane obiektu + krótki opis */}
              <figcaption className="realization__caption">
                <h3 className={`realization__name realization__name--${project.slug}`}>
                  {project.displayName ?? project.name}
                </h3>
                <dl className="realization__meta">
                  <div>
                    <dt>Lokalizacja</dt>
                    <dd>{project.location}</dd>
                  </div>
                  {project.year && (
                    <div>
                      <dt>Rok</dt>
                      <dd>{project.year}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Typ</dt>
                    <dd>{project.category}</dd>
                  </div>
                </dl>
                {project.description && <p className="realization__desc">{project.description}</p>}
              </figcaption>
              <AccordionGallery
                key={mobile ? 'mobile' : 'desktop'}
                items={mobile ? itemsFor(project).slice(0, 1) : itemsFor(project)}
                defaultIndex={0}
                expandRatio={0.52}
                trigger="hover"
                accentColor="#ffffff"
                overlayColor="#2d2d2d"
                textColor="#ffffff"
                grayscale
                showLabels={false}
                duration={0.6}
                ease="power3.out"
                parallax={0.5}
                tilt={8}
                stagger={0.06}
                height={460}
                gap={10}
                radius={0}
                orientation="horizontal"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
