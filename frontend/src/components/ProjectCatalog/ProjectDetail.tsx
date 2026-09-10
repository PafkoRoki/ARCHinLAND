import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import type { Project } from "../../data/projects";
import "./ProjectDetail.css";

/**
 * WYMAGANE ROZSZERZENIE TYPU `Project` (w data/projects.ts):
 *
 * interface Project {
 *   // ...istniejące pola (id, name, usableArea, buildingArea, itd.)
 *   slug: string;                 // do URL, np. "dom-120-parterowy"
 *   gallery: {
 *     visualizations: string[];   // wizualizacje 3D
 *     floorPlans: string[];       // rzuty (parter, piętro...)
 *     elevations: string[];       // elewacje
 *   };
 *   description?: string;
 *   sketchfabUrl?: string;        // pełny URL embed, np.
 *                                 // "https://sketchfab.com/models/<UID>/embed"
 * }
 *
 * Jeśli dla któregoś projektu nie masz jeszcze danej kategorii zdjęć,
 * po prostu zostaw pustą tablicę [] — zakładka się wtedy nie pokaże.
 */

interface ProjectDetailProps {
  projects: Project[];
}

type GalleryTab = "visualizations" | "floorPlans" | "elevations";

const TAB_LABELS: Record<GalleryTab, string> = {
  visualizations: "Wizualizacje",
  floorPlans: "Rzuty",
  elevations: "Elewacje",
};

export function ProjectDetail({ projects }: ProjectDetailProps) {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  const [activeTab, setActiveTab] = useState<GalleryTab>("visualizations");
  const [activeImage, setActiveImage] = useState(0);

  if (!project) {
    return <Navigate to="/projekty" replace />;
  }

  const gallery = project.gallery;
  const availableTabs = (Object.keys(TAB_LABELS) as GalleryTab[]).filter(
    (tab) => gallery?.[tab] && gallery[tab].length > 0
  );

  const images = gallery?.[activeTab] ?? [];

  const handleTabChange = (tab: GalleryTab) => {
    setActiveTab(tab);
    setActiveImage(0);
  };

  return (
    <section className="projectDetail">
      <div className="projectDetail__breadcrumb">
        <Link to="/projekty">← Wszystkie projekty</Link>
      </div>

      <header className="projectDetail__header">
        <div>
          <span className="projectDetail__eyebrow">
            {project.id.toUpperCase()} · {project.category}
          </span>
          <h1>{project.name}</h1>
        </div>

        <div className="projectDetail__headerStat">
          <span>Powierzchnia użytkowa</span>
          <strong>{project.usableArea} m²</strong>
        </div>
      </header>

      <div className="projectDetail__gallery">
        <div className="projectDetail__mainImage">
          {images.length > 0 ? (
            <img
              src={images[activeImage]}
              alt={`${project.name} — ${TAB_LABELS[activeTab]}`}
            />
          ) : (
            <div className="projectDetail__noImage">
              Brak zdjęć w tej kategorii
            </div>
          )}
        </div>

        {availableTabs.length > 1 && (
          <div className="projectDetail__tabs">
            {availableTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={tab === activeTab ? "isActive" : ""}
                onClick={() => handleTabChange(tab)}
              >
                {TAB_LABELS[tab]} ({gallery[tab].length})
              </button>
            ))}
          </div>
        )}

        {images.length > 1 && (
          <div className="projectDetail__thumbs">
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                className={index === activeImage ? "isActive" : ""}
                onClick={() => setActiveImage(index)}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="projectDetail__body">
        <div className="projectDetail__statsGrid">
          <div>
            <span>Pow. zabudowy</span>
            <strong>{project.buildingArea} m²</strong>
          </div>
          <div>
            <span>Pow. mieszkalna</span>
            <strong>{project.residentialArea} m²</strong>
          </div>
          <div>
            <span>Pow. całkowita</span>
            <strong>{project.totalArea} m²</strong>
          </div>
          <div>
            <span>Pomieszczenia</span>
            <strong>{project.rooms}</strong>
          </div>
          <div>
            <span>Kondygnacje</span>
            <strong>
              {project.floors === 1 ? "Parterowy" : project.floors}
            </strong>
          </div>
          <div>
            <span>Dach</span>
            <strong>
              {project.roofType} · {project.roofAngle}°
            </strong>
          </div>
          <div>
            <span>Garaż</span>
            <strong>
              {project.garage === 0 ? "Brak" : `${project.garage} stan.`}
            </strong>
          </div>
          <div>
            <span>Standard</span>
            <strong>{project.standard}</strong>
          </div>
        </div>

        {project.description && (
          <div className="projectDetail__description">
            <h2>Opis projektu</h2>
            <p>{project.description}</p>
          </div>
        )}

        {project.sketchfabUrl && (
          <div className="projectDetail__model3d">
            <h2>Model 3D</h2>
            <div className="projectDetail__model3dFrame">
              <iframe
                title={`Model 3D — ${project.name}`}
                src={project.sketchfabUrl}
                frameBorder="0"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <p className="projectDetail__model3dCredit">
              Model 3D via{" "}
              <a
                href="https://sketchfab.com"
                target="_blank"
                rel="noreferrer"
              >
                Sketchfab
              </a>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
