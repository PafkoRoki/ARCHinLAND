import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { MdOutlineBed, MdOutlineGarage, MdOutlineStairs } from "react-icons/md";
import type { Project } from "../data/projects";
import "./ProjectDetail.css";

/**
 * Karta projektu — układ danych wzorowany na archi-projekt.com.pl:
 *   1. galeria + boks z najważniejszymi danymi (pomieszczenia, powierzchnie, działka, koszt)
 *   2. "Rzuty" — zestawienie pomieszczeń per kondygnacja (project.floorRooms)
 *   3. opis
 *   4. "Technologia i konstrukcja" | "Powierzchnie i wymiary"
 *   5. model 3D
 * Pola opcjonalne opisane są w data/projects.ts; brakujące wiersze/sekcje się nie pokazują.
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

const TECHNOLOGY_LABELS: Record<keyof NonNullable<Project["technology"]>, string> = {
  walls: "Ściany",
  ceiling: "Strop",
  roofCovering: "Pokrycie dachu",
  roofInsulation: "Ocieplenie poddasza",
  wallInsulation: "Ocieplenie ścian",
  plaster: "Tynk",
  foundation: "Fundamenty",
  heating: "Ogrzewanie",
};

const ROOF_NAMES: Record<Project["roofType"], string> = {
  "▲": "dwuspadowy",
  "◆": "wielospadowy",
  "▬": "płaski",
};

// do nagłówka "Rzuty parteru i poddasza"
const FLOOR_GENITIVE: Record<string, string> = {
  Parter: "parteru",
  Piętro: "piętra",
  Poddasze: "poddasza",
  "Poddasze do adaptacji": "poddasza",
  "Poddasze użytkowe": "poddasza",
  Antresola: "antresoli",
  Piwnica: "piwnicy",
};

type Spec =[label: string, value: string | undefined];

const num = (value: number, digits = 2) =>
  value.toLocaleString("pl-PL", { maximumFractionDigits: digits });

const m2 = (value?: number) => (value == null ? undefined : `${num(value)} m²`);
const m3 = (value?: number) => (value == null ? undefined : `${num(value)} m³`);
const m = (value?: number) => (value == null ? undefined : `${num(value)} m`);

function SpecList({ items }: { items: Spec[] }) {
  const visible = items.filter(([, value]) => value);
  return (
    <dl className="projectDetail__specList">
      {visible.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ProjectDetail({ projects }: ProjectDetailProps) {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  const [activeTab, setActiveTab] = useState<GalleryTab>("visualizations");
  const [activeImage, setActiveImage] = useState(0);
  const [mirrored, setMirrored] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setMirrored(false);
    setLightbox(null);
    setActiveTab("visualizations");
    setActiveImage(0);
  }, [slug]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

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

  const plot = `${num(project.plotWidth)} m × ${num(project.plotLength)} m`;
  const floorsLabel =
    project.floors === 1
      ? "parterowy"
      : project.floors === "Antresola"
        ? "z antresolą"
        : `${project.floors} kondygnacje`;

  const technology: Spec[] = [
    ...(Object.keys(TECHNOLOGY_LABELS) as (keyof typeof TECHNOLOGY_LABELS)[]).map(
      (key): Spec => [TECHNOLOGY_LABELS[key], project.technology?.[key]]
    ),
    ["Dach", ROOF_NAMES[project.roofType]],
    ["Kąt nachylenia dachu", `${project.roofAngle}°`],
    ["Standard", project.standard],
  ];

  const dimensions: Spec[] = [
    ["Powierzchnia użytkowa domu", m2(project.usableArea)],
    ["Powierzchnia mieszkalna", m2(project.residentialArea)],
    ["Powierzchnia garażu", m2(project.garageArea)],
    ["Powierzchnia kotłowni", m2(project.boilerRoomArea)],
    ["Powierzchnia strychu", m2(project.atticArea)],
    ["Powierzchnia tarasu", m2(project.terraceArea)],
    ["Powierzchnia zabudowy", m2(project.buildingArea)],
    ["Powierzchnia całkowita", m2(project.totalArea)],
    ["Powierzchnia netto", m2(project.netArea)],
    ["Powierzchnia dachu", m2(project.roofArea)],
    ["Minimalne wymiary działki", plot],
    ["Kubatura ogrzewana", m3(project.heatedVolume)],
    ["Wysokość budynku", m(project.buildingHeight)],
    ["Wysokość okapu", m(project.eavesHeight)],
  ];

  const summary: Spec[] = [
    ["Powierzchnia domu", m2(project.usableArea)],
    ["Powierzchnia zabudowy", m2(project.buildingArea)],
    [
      "Garaż",
      project.garageArea != null
        ? m2(project.garageArea)
        : project.garage === 0
          ? "brak"
          : `${project.garage}-stanowiskowy`,
    ],
    ["Kotłownia", m2(project.boilerRoomArea)],
    ["Min. wymiary działki", plot],
  ];

  // Rzuty: zestawienie pomieszczeń, a bez niego same obrazki rzutów z galerii
  const floors = project.floorRooms ?? [];
  const planImages = gallery?.floorPlans ?? [];
  const floorsTitle =
    floors.length > 0
      ? `Rzuty ${floors.map((floor) => FLOOR_GENITIVE[floor.name] ?? floor.name.toLowerCase()).join(" i ")}`
      : "Rzuty";

  const elevations = gallery?.elevations ?? [];

  // Podobne: najpierw ta sama kategoria, potem najbliższa powierzchnia użytkowa
  const similar = projects
    .filter((item) => item.slug !== project.slug)
    .sort(
      (a, b) =>
        Number(a.category !== project.category) - Number(b.category !== project.category) ||
        Math.abs(a.usableArea - project.usableArea) - Math.abs(b.usableArea - project.usableArea)
    )
    .slice(0, 4);

  const mirrorButton = (
    <button
      type="button"
      className={`projectDetail__mirror${mirrored ? " isActive" : ""}`}
      aria-pressed={mirrored}
      onClick={() => setMirrored((value) => !value)}
    >
      <span aria-hidden="true">⇋</span> Lustrzane odbicie
    </button>
  );

  return (
    <section className={`projectDetail${mirrored ? " isMirrored" : ""}`}>
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
          <strong>{m2(project.usableArea)}</strong>
        </div>
      </header>

      <div className="projectDetail__top">
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

          {(availableTabs.length > 1 || images.length > 0) && (
            <div className="projectDetail__tabs">
              {availableTabs.length > 1 && availableTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={tab === activeTab ? "isActive" : ""}
                  onClick={() => handleTabChange(tab)}
                >
                  {TAB_LABELS[tab]} ({gallery[tab].length})
                </button>
              ))}
              {mirrorButton}
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

        <aside className="projectDetail__summary">
          <div className="projectDetail__summaryBlock">
            <h3>Pomieszczenia</h3>
            <p>
              {project.roomsSummary ??
                `${project.rooms} pomieszczenia, dom ${floorsLabel}`}
            </p>
          </div>

          <div className="projectDetail__summaryBlock">
            <h3>Powierzchnia</h3>
            <SpecList items={summary} />
          </div>

          {project.rawStateCost != null && (
            <div className="projectDetail__summaryCost">
              <span>Koszt stanu surowego</span>
              <strong>{num(project.rawStateCost, 0)} zł</strong>
            </div>
          )}
        </aside>
      </div>

      <div className="projectDetail__body">
        {/* ---------- Rzuty ---------- */}
        {(floors.length > 0 || planImages.length > 0) && (
          <div className="projectDetail__section">
            <h2 className="projectDetail__title">{floorsTitle}</h2>

            {floors.length > 0 ? (
              <div className="projectDetail__floors">
                {floors.map((floor) => (
                  <div key={floor.name} className="projectDetail__floor">
                    {floor.plan ? (
                      <ZoomImage
                        src={floor.plan}
                        alt={`${project.name} — ${floor.name}`}
                        className="projectDetail__floorPlan"
                        onOpen={setLightbox}
                      />
                    ) : (
                      <div />
                    )}

                    <div className="projectDetail__floorRooms">
                      <div className="projectDetail__floorHead">
                        <h3>{floor.name}</h3>
                        {mirrorButton}
                      </div>
                      <ul>
                        {floor.rooms.map((room, index) => (
                          <li key={`${room.name}-${index}`}>
                            <span>{room.name}</span>
                            <strong>
                              {m2(room.area)}
                              {room.extraArea != null && ` (${m2(room.extraArea)})`}
                            </strong>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="projectDetail__floorHead">
                  <span />
                  {mirrorButton}
                </div>
                <div className="projectDetail__plansGrid">
                  {planImages.map((src, index) => (
                    <ZoomImage
                      key={src}
                      src={src}
                      alt={`${project.name} — rzut ${index + 1}`}
                      className="projectDetail__floorPlan"
                      onOpen={setLightbox}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ---------- Opis + tabele ---------- */}
        <div className="projectDetail__section">
          <h2 className="projectDetail__title">Opis</h2>
          <div className="projectDetail__descriptionGrid">
            <div className="projectDetail__description">
              <h3>Układ funkcjonalno-przestrzenny</h3>
              <p>
                {project.description ??
                  `${project.name} to dom ${floorsLabel} o powierzchni użytkowej ${m2(
                    project.usableArea
                  )}, z dachem ${ROOF_NAMES[project.roofType]}m o kącie nachylenia ${
                    project.roofAngle
                  }°.`}
              </p>
            </div>

            <div className="projectDetail__tables">
              <h3>Technologia i konstrukcja</h3>
              <SpecList items={technology} />
              <h3>Powierzchnie i wymiary</h3>
              <SpecList items={dimensions} />
            </div>
          </div>
        </div>

        {/* ---------- Działka i elewacje ---------- */}
        <div className="projectDetail__section">
          <h2 className="projectDetail__title">Działka i elewacje</h2>
          <div className="projectDetail__facades">
            <div className="projectDetail__plot">
              <h4>Działka</h4>
              {project.plotImage ? (
                <ZoomImage
                  src={project.plotImage}
                  alt={`${project.name} — działka`}
                  className="projectDetail__plotImage"
                  onOpen={setLightbox}
                />
              ) : (
                <div className="projectDetail__plotScheme">
                  <div
                    className="projectDetail__plotRect"
                    style={{ aspectRatio: `${project.plotWidth} / ${project.plotLength}` }}
                  >
                    <span className="projectDetail__plotW">{num(project.plotWidth)} m</span>
                    <span className="projectDetail__plotL">{num(project.plotLength)} m</span>
                    <span className="projectDetail__plotHouse">
                      {m2(project.buildingArea)}
                      <small>pow. zabudowy</small>
                    </span>
                  </div>
                  <p>Minimalne wymiary działki: {plot}</p>
                </div>
              )}
            </div>

            <div className="projectDetail__elevations">
              <h4>Elewacje</h4>
              {elevations.length > 0 ? (
                <div className="projectDetail__elevationsGrid">
                  {elevations.map((src, index) => (
                    <ZoomImage
                      key={src}
                      src={src}
                      alt={`${project.name} — elewacja ${index + 1}`}
                      className="projectDetail__elevation"
                      onOpen={setLightbox}
                    />
                  ))}
                </div>
              ) : (
                <div className="projectDetail__noImage projectDetail__noImage--box">
                  Elewacje wkrótce
                </div>
              )}
            </div>
          </div>
        </div>

        {project.sketchfabUrl && (
          <div className="projectDetail__section projectDetail__model3d">
            <h2 className="projectDetail__title">Model 3D</h2>
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

        {/* ---------- Podobne projekty ---------- */}
        {similar.length > 0 && (
          <div className="projectDetail__section">
            <h2 className="projectDetail__title">Podobne projekty</h2>
            <div className="projectDetail__similar">
              {similar.map((item) => (
                <Link
                  key={item.slug}
                  to={`/projekty/${item.slug}`}
                  className="similarCard"
                >
                  <div className="similarCard__image">
                    <img src={item.image} alt={item.name} loading="lazy" />
                    <span>{item.category}</span>
                  </div>
                  <div className="similarCard__body">
                    <div className="similarCard__head">
                      <h3>{item.name}</h3>
                      <span>Szczegóły »</span>
                    </div>
                    <p className="similarCard__area">
                      {m2(item.usableArea)}
                      {item.garageArea != null && ` + Garaż: ${m2(item.garageArea)}`}
                    </p>
                    <div className="similarCard__attrs">
                      <span title="Pomieszczenia">
                        <MdOutlineBed aria-hidden="true" /> {item.rooms}
                      </span>
                      <span title="Kondygnacje">
                        <MdOutlineStairs aria-hidden="true" />{" "}
                        {item.floors === "Antresola" ? "A" : item.floors}
                      </span>
                      <span title="Garaż">
                        <MdOutlineGarage aria-hidden="true" /> {item.garage}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="projectDetail__lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Powiększenie"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="" />
          <button type="button" aria-label="Zamknij" onClick={() => setLightbox(null)}>
            ×
          </button>
        </div>
      )}
    </section>
  );
}

function ZoomImage({
  src,
  alt,
  className,
  onOpen,
}: {
  src: string;
  alt: string;
  className: string;
  onOpen: (src: string) => void;
}) {
  return (
    <button
      type="button"
      className={`projectDetail__zoom ${className}`}
      onClick={() => onOpen(src)}
      aria-label={`Powiększ: ${alt}`}
    >
      <img src={src} alt={alt} loading="lazy" />
    </button>
  );
}
