import { useMemo, useState } from "react";
import type { Project } from "../../data/projects";
import "./ProjectCatalog.css";

interface ProjectCatalogProps {
  projects: Project[];
}

type SortOption =
  | "recommended"
  | "priceAsc"
  | "priceDesc"
  | "areaAsc"
  | "areaDesc";

export function ProjectCatalog({
  projects,
}: ProjectCatalogProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Wszystkie");
  const [floors, setFloors] = useState("Wszystkie");
  const [roof, setRoof] = useState("Wszystkie");
  const [garage, setGarage] = useState("Wszystkie");
  const [area, setArea] = useState("Wszystkie");
  const [sort, setSort] = useState<SortOption>("recommended");

  const filteredProjects = useMemo(() => {
    const result = projects.filter((project) => {
      const searchMatch =
        project.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        project.category
          .toLowerCase()
          .includes(search.toLowerCase());

      const categoryMatch =
        category === "Wszystkie" ||
        project.category === category;

      const floorsMatch =
        floors === "Wszystkie" ||
        project.floors.toString() === floors;

      const roofMatch =
        roof === "Wszystkie" ||
        project.roofType === roof;

      const garageMatch =
        garage === "Wszystkie" ||
        project.garage.toString() === garage;

      let areaMatch = true;

      if (area === "do-100") {
        areaMatch = project.usableArea <= 100;
      }

      if (area === "100-150") {
        areaMatch =
          project.usableArea > 100 &&
          project.usableArea <= 150;
      }

      if (area === "150-200") {
        areaMatch =
          project.usableArea > 150 &&
          project.usableArea <= 200;
      }

      if (area === "200-plus") {
        areaMatch = project.usableArea > 200;
      }

      return (
        searchMatch &&
        categoryMatch &&
        floorsMatch &&
        roofMatch &&
        garageMatch &&
        areaMatch
      );
    });

    return [...result].sort((a, b) => {
      switch (sort) {
        case "priceAsc":
          return a.price - b.price;

        case "priceDesc":
          return b.price - a.price;

        case "areaAsc":
          return a.usableArea - b.usableArea;

        case "areaDesc":
          return b.usableArea - a.usableArea;

        default:
          return 0;
      }
    });
  }, [
    projects,
    search,
    category,
    floors,
    roof,
    garage,
    area,
    sort,
  ]);

  const clearFilters = () => {
    setSearch("");
    setCategory("Wszystkie");
    setFloors("Wszystkie");
    setRoof("Wszystkie");
    setGarage("Wszystkie");
    setArea("Wszystkie");
    setSort("recommended");
  };

  return (
    <section className="catalog">
      <header className="catalogHeader">
        <div>
          <span className="catalogEyebrow">
            PROJEKTY ARCHITEKTONICZNE
          </span>

          <h1>Znajdź swój projekt</h1>

          <p>
            Przeglądaj projekty domów według powierzchni,
            konstrukcji i najważniejszych parametrów.
          </p>
        </div>

        <div className="catalogCount">
          <strong>{filteredProjects.length}</strong>
          <span>projektów</span>
        </div>
      </header>

      <div className="catalogToolbar">
        <div className="searchBox">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>

          <input
            type="search"
            placeholder="Szukaj projektu..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
        >
          <option>Wszystkie</option>
          <option value="do 70m²">do 70m²</option>
          <option value="Tradycyjny">Tradycyjny</option>
          <option value="Stodoła">Stodoła</option>
          <option value="Parterowy">Parterowy</option>
        </select>

        <select
          value={area}
          onChange={(event) =>
            setArea(event.target.value)
          }
        >
          <option value="Wszystkie">
            Pow. użytkowa
          </option>
          <option value="do-100">do 100 m²</option>
          <option value="100-150">100–150 m²</option>
          <option value="150-200">150–200 m²</option>
          <option value="200-plus">powyżej 200 m²</option>
        </select>

        <select
          value={floors}
          onChange={(event) =>
            setFloors(event.target.value)
          }
        >
          <option>Wszystkie</option>
          <option value="1">Parterowy</option>
          <option value="2">2 kondygnacje</option>
        </select>

        <select
          value={roof}
          onChange={(event) =>
            setRoof(event.target.value)
          }
        >
          <option>Wszystkie</option>
          <option value="🡶">Dwuspadowy</option>
          <option value="🡵">Czterospadowy</option>
          <option value="🡲">Płaski</option>
        </select>

        <select
          value={garage}
          onChange={(event) =>
            setGarage(event.target.value)
          }
        >
          <option>Wszystkie</option>
          <option value="0">Bez garażu</option>
          <option value="1">1 stanowisko</option>
          <option value="2">2 stanowiska</option>
        </select>

        <select
          className="sortSelect"
          value={sort}
          onChange={(event) =>
            setSort(event.target.value as SortOption)
          }
        >
          <option value="recommended">
            Polecane
          </option>
          <option value="priceAsc">
            Cena: rosnąco
          </option>
          <option value="priceDesc">
            Cena: malejąco
          </option>
          <option value="areaAsc">
            Powierzchnia: rosnąco
          </option>
          <option value="areaDesc">
            Powierzchnia: malejąco
          </option>
        </select>
      </div>

      <div className="catalogResults">
        <div className="resultsInfo">
          <span>
            {filteredProjects.length} wyników
          </span>

          {(search ||
            category !== "Wszystkie" ||
            floors !== "Wszystkie" ||
            roof !== "Wszystkie" ||
            garage !== "Wszystkie" ||
            area !== "Wszystkie") && (
            <button onClick={clearFilters}>
              Wyczyść filtry
            </button>
          )}
        </div>

        {filteredProjects.length > 0 ? (
          <div className="projectsGrid">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        ) : (
          <div className="emptyState">
            <strong>Nie znaleziono projektów</strong>
            <span>
              Spróbuj zmienić kryteria wyszukiwania.
            </span>

            <button onClick={clearFilters}>
              Wyczyść filtry
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
}: {
  project: Project;
}) {
  return (
    <article className="projectCard">
      <div className="projectImage">
        <img
          src={project.image}
          alt={project.name}
          loading="lazy"
        />

        <div className="projectImageOverlay">
          <span>{project.category}</span>

          <button
            className="favoriteButton"
            aria-label={`Dodaj ${project.name} do ulubionych`}
          >
            ♡
          </button>
        </div>
      </div>

      <div className="projectContent">
        <div className="projectTitle">
          <div>
            <span className="projectNumber">
              {project.id.toUpperCase()}
            </span>

            <h2>{project.name}</h2>
          </div>

          <span className="standardBadge">
            {project.standard}
          </span>
        </div>

        <div className="mainArea">
          <span>Powierzchnia użytkowa</span>
          <strong>
            {project.usableArea.toLocaleString("pl-PL", {
              minimumFractionDigits: 1,
            })}{" "}
            m²
          </strong>
        </div>

        <div className="areaGrid">
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
        </div>

        <div className="technicalDetails">
          <div>
            <span>Kondygnacje</span>
            <strong>
              {project.floors === 1
                ? "Parterowy"
                : `${project.floors}`}
            </strong>
          </div>

          <div>
            <span>Dach</span>
            <strong>{project.roofType}</strong>
          </div>

          <div>
            <span>Kąt dachu</span>
            <strong>{project.roofAngle}°</strong>
          </div>

          <div>
            <span>Garaż</span>
            <strong>
              {project.garage === 0
                ? "Brak"
                : `${project.garage} stan.`}
            </strong>
          </div>
        </div>

        <div className="projectFooter">
          <div className="price">
            <span>Cena projektu</span>
            <strong>
              {project.price.toLocaleString("pl-PL")} zł
            </strong>
          </div>

          <button className="detailsButton">
            Zobacz projekt
            <span>→</span>
          </button>
        </div>
      </div>
    </article>
  );
}