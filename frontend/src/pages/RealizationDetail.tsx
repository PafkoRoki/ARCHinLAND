import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { projects, sizeOf, srcsetOf } from '../data/realizations'
import { scrollToTarget } from '../lib/smoothScroll'
import './RealizationDetail.css'

export default function RealizationDetail() {
  const { slug } = useParams<{ slug: string }>()
  const index = projects.findIndex((p) => p.slug === slug)
  const project = index !== -1 ? projects[index] : undefined

  useEffect(() => {
    scrollToTarget(0, { immediate: true })
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
        <Link to="/#realizations">← Architektura</Link>
      </div>

      <header className="realizationDetail__header">
        <div>
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

      {/* zdjęcia jedno pod drugim, w oryginalnych proporcjach — bez kadrowania i miniatur */}
      <div className="realizationDetail__gallery">
        {images.map((src, i) => (
          <img
            key={src + i}
            src={src}
            srcSet={srcsetOf(src) || undefined}
            sizes="(min-width: 1500px) 1400px, 100vw"
            width={sizeOf(src)?.width}
            height={sizeOf(src)?.height}
            alt={`${project.name}, zdjęcie ${i + 1} z ${images.length}, ${project.location}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ))}
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
