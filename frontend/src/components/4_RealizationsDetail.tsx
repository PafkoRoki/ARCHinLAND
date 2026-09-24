import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { projects } from '../data/realizations'
import './4_RealizationsDetail.css'

export default function RealizationsDetail() {
  const { slug } = useParams<{ slug: string }>()
  const index = projects.findIndex((p) => p.slug === slug)
  const project = index !== -1 ? projects[index] : undefined

  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    setActiveImage(0)
  }, [slug])

  if (!project) {
    return <Navigate to="/#realizations" replace />
  }

  const images = project.gallery && project.gallery.length > 0 ? project.gallery : [project.image]
  const prevProject = projects[(index - 1 + projects.length) % projects.length]
  const nextProject = projects[(index + 1) % projects.length]

  return (
    <section className="realizationDetail">
      <div className="realizationDetail__breadcrumb">
        <Link to="/#realizations">← Wszystkie realizacje</Link>
      </div>

      <header className="realizationDetail__header">
        <div>
          <span className="realizationDetail__eyebrow">
            {project.number} · {project.category}
          </span>
          <h1>{project.name}</h1>
        </div>

        <div className="realizationDetail__meta">
          <div>
            <span>Lokalizacja</span>
            <strong>{project.location}</strong>
          </div>
          {project.year && (
            <div>
              <span>Rok</span>
              <strong>{project.year}</strong>
            </div>
          )}
        </div>
      </header>

      <div className="realizationDetail__gallery">
        <div className="realizationDetail__mainImage">
          <img
            src={images[activeImage]}
            alt={`${project.name} — ${project.category}, ${project.location}`}
          />
        </div>

        {images.length > 1 && (
          <div className="realizationDetail__thumbs">
            {images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                className={i === activeImage ? 'isActive' : ''}
                onClick={() => setActiveImage(i)}
                aria-label={`Zdjęcie ${i + 1} z ${images.length}`}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      {project.description && (
        <div className="realizationDetail__description">
          <h2>Opis realizacji</h2>
          <p>{project.description}</p>
        </div>
      )}

      <nav className="realizationDetail__pager">
        <Link to={`/realizacje/${prevProject.slug}`} className="realizationDetail__pagerLink">
          <span>← Poprzednia</span>
          <strong>{prevProject.name}</strong>
        </Link>
        <Link to={`/realizacje/${nextProject.slug}`} className="realizationDetail__pagerLink realizationDetail__pagerLink--next">
          <span>Następna →</span>
          <strong>{nextProject.name}</strong>
        </Link>
      </nav>
    </section>
  )
}
