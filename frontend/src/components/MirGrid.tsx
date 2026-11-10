import { Link } from 'react-router-dom'
import { srcsetOf, type Project } from '../data/realizations'
import './MirGrid.css'

interface MirGridProps {
  projects: Project[]
}

/**
 * mir.no-style asymmetric work grid.
 * Projects 1, 4, 7… span 2 columns (large), others are single column;
 * a last project left alone in its row is large too, so rows are always full.
 */
export default function MirGrid({ projects }: MirGridProps) {
  return (
    <div className="mir-grid">
      {projects.map((project, i) => {
        // Every 3rd item starting from 0 is large (spans 2 columns)
        const isLarge = i % 3 === 0
        return (
          <Link
            key={project.slug}
            to={`/realizacje/${project.slug}`}
            className={`mir-grid__item${isLarge ? ' mir-grid__item--large' : ''}`}
          >
            <div className="mir-grid__image-wrap">
              <img
                src={project.image}
                srcSet={srcsetOf(project.image) || undefined}
                // duży kafelek: dwie kolumny (cała szerokość), zwykły: jedna; telefon: jedna kolumna
                sizes={isLarge ? '(max-width: 768px) 100vw, 92vw' : '(max-width: 768px) 100vw, 46vw'}
                alt={`${project.displayName ?? project.name}, ${project.category}, ${project.location}`}
                className="mir-grid__image"
                loading="lazy"
              />
            </div>
            <div className="mir-grid__overlay">
              <div className="mir-grid__content">
                <span className="mir-grid__category">{project.category}</span>
                <h3 className="mir-grid__title">{project.displayName ?? project.name}</h3>
                <span className="mir-grid__location">{project.location}</span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
