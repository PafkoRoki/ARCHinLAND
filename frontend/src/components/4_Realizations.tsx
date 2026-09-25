/// <reference types="vite/client" />
// @ts-nocheck

import { projects } from '../data/realizations'
import AccordionGallery from './AccordionGallery'
import SectionHeader from './SectionHeader'
import './4_Realizations.css'

// Kolejne akordeony w sekcji — każdy pokazuje wszystkie zdjęcia (gallery) jednej realizacji
const GALLERY_SLUGS = ['baltic-cliff', 'osiedle-panorama', 'szwecja']

const galleries = GALLERY_SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean)

const itemsFor = (project) =>
  project.gallery.map((image, i) => ({
    image,
    label: `${project.name} · ${i + 1}/${project.gallery.length}`,
    link: `/realizacje/${project.slug}`,
    alt: `${project.name} — ${project.category}, ${project.location}${project.year ? `, ${project.year}` : ''} (zdjęcie ${i + 1})`,
  }))

export default function Realizations() {
  return (
    <section id="realizations" className="section realizations" aria-labelledby="realizations-title">
      <div className="container">
        <SectionHeader index="02" label="Realizacje" id="realizations-title" />
        <div className="realizations__galleries">
          {galleries.map((project) => (
            <AccordionGallery
              key={project.slug}
              items={itemsFor(project)}
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
          ))}
        </div>
      </div>
    </section>
  )
}
