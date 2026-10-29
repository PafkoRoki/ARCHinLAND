/// <reference types="vite/client" />
// @ts-nocheck

import { useState } from 'react'
import { featuredProjects, projects } from '../data/realizations'
import MirGrid from '../components/MirGrid'
import SectionHeader from '../components/SectionHeader'
import './Realizations.css'

// Siatka w stylu mir.no — asymetryczny układ, duże zdjęcia, minimalistyczny overlay.
// Zakładki — realizacja trafia do zakładki według pola `group` w data/realizations.ts;
// "Wybrane" to lista featuredProjects (też z data/realizations.ts).

const FEATURED = 'wybrane'
const TABS = [
  { id: FEATURED, label: 'Wybrane' },
  { id: 'apartamenty', label: 'Apartamentowce / Hotele' },
  { id: 'osiedla', label: 'Osiedla' },
  { id: 'domy', label: 'Domy jednorodzinne' },
]

const galleries = projects.filter((p) => p.gallery.length > 0)
const projectsOf = (tab) => (tab === FEATURED ? featuredProjects : galleries.filter((p) => p.group === tab))

export default function Realizations() {
  const [tab, setTab] = useState(TABS[0].id)
  const visible = projectsOf(tab)

  return (
    <section id="realizations" className="section realizations" aria-labelledby="realizations-title">
      <div className="container">
        <SectionHeader index="02" label="Realizacje" id="realizations-title" />

        <div className="realizations__tabs" role="tablist" aria-label="Rodzaj realizacji">
          {TABS.map((t) => {
            const count = projectsOf(t.id).length
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
          className="realizations__grid"
          role="tabpanel"
          aria-labelledby={`realizations-tab-${tab}`}
        >
          <MirGrid projects={visible} />
        </div>
      </div>
    </section>
  )
}
