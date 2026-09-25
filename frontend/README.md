# ARCHinLAND

Strona pracowni ARCHinLAND (Architecture in Land Development). React 18 + TypeScript, Vite, Tailwind 4,
react-three-fiber (model 3D), GSAP. Hosting: Cloudflare Pages.

## Uruchomienie

```bash
npm install
npm run dev       # serwer deweloperski (http://localhost:5173)
npm run build     # sprawdzenie typów + build do dist/
npm run preview   # podgląd builda
```

Deploy odbywa się automatycznie po wypchnięciu zmian w `frontend/` na gałąź `main`
(`.github/workflows/deploy-frontend.yml`, instalacja przez `bun install --frozen-lockfile`).
Po dodaniu lub usunięciu paczki zaktualizuj **oba** pliki blokad: `bun.lock` i `package-lock.json`.

## Struktura

```
src/
  main.tsx            punkt wejścia (kroje Inter / Inter Tight, globals.css)
  App.tsx             routing: /, /projekty, /projekty/:slug, /realizacje/:slug
  pages/              podstrony z własnym adresem
    Home.tsx            strona główna — kolejność sekcji
    ProjectDetail.tsx   /projekty/:slug
    RealizationDetail.tsx  /realizacje/:slug
  layout/             elementy wspólne: Header (menu), Footer, AppLoader (ekran ładowania)
  sections/           sekcje strony głównej: Hero (przypięta scena z tekstem O nas), Realizations,
                      Projects, Process, Reviews, Contact + BackgroundModel (scena 3D z soczewką)
  components/         klocki wielokrotnego użytku: SectionHeader, ProjectCatalog (/ i /projekty),
                      StaggeredMenu, StrokeText, AccordionGallery, RippleDistortion
  data/               projects.ts (katalog projektów), realizations.ts (realizacje),
                      reviews.ts (opinie — wpisywane ręcznie)
  hooks/              useReveal — animacja pojawiania się przy przewijaniu
  lib/                modelControls — wspólny stan modelu 3D (obrót, postęp, gotowość)
  styles/globals.css  tokeny (kolory, kroje, odstępy, --container/--gutter) i reset
  assets/
    realizacje/<slug>/  zdjęcia realizacji 01.jpg, 02.jpg… — wczytywane automatycznie
    projekty/           zdjęcia katalogu projektów
public/
  models/Eryk.glb     model 3D (skompresowany: meshopt + tekstury WebP)
  images/             zdjęcie w stopce
```

## Wskazówki

- Wygląd całej strony ustawiają zmienne w `src/styles/globals.css` (`--bg`, `--orange`, `--black`,
  `--border`, `--font-display`, `--font-body`, `--container`, `--gutter`…).
- Nowa realizacja: dopisz ją w `src/data/realizations.ts` i dodaj folder `src/assets/realizacje/<slug>/`
  ze zdjęciami (warto zmniejszyć je do ~2000 px szerokości).
- Animacje respektują ustawienie `prefers-reduced-motion`.
