// Zdjęcia realizacji leżą w src/assets/realizacje/<slug>/01.jpg, 02.jpg, …
// Vite wczytuje je automatycznie (import.meta.glob) — żeby dodać zdjęcie, wystarczy wrzucić
// kolejny plik do folderu realizacji. Kolejność = kolejność nazw plików; 01.jpg to zdjęcie główne.
// Zdjęcia warto zmniejszyć do ~2000 px szerokości przed dodaniem (duże pliki spowalniają stronę);
// oryginały trzymamy w ARCHinLAND/zdjecia-oryginaly/<slug>/ (poza repozytorium).
const photoFiles = import.meta.glob<string>('../assets/realizacje/*/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

// zdjęcie z `cover` idzie na początek, reszta według nazw plików
const photosOf = (slug: string, cover?: string) =>
  Object.keys(photoFiles)
    .filter((file) => file.includes(`/realizacje/${slug}/`))
    .sort()
    .sort((a, b) => Number(b.endsWith(`/${cover}`)) - Number(a.endsWith(`/${cover}`)))
    .map((file) => photoFiles[file])

/** Zakładka w sekcji Realizacje */
export type RealizationGroup = 'apartamenty' | 'osiedla' | 'domy'

export interface Project {
  slug: string // = nazwa folderu ze zdjęciami w src/assets/realizacje/ i adres /realizacje/<slug>
  /** Numer porządkowy "01", "02", … — nadawany automatycznie według kolejności na stronie. */
  number: string
  name: string // wersalikami: nagłówek podstrony, podpisy zdjęć
  /** Nazwa w zwykłej pisowni (podpis galerii, SEO), np. "Baltic Cliff"; domyślnie name. */
  displayName?: string
  location: string // "Miejscowość, Kraj"
  year: string // pusty = niewyświetlany, realizacja trafia na koniec listy
  category: string
  group: RealizationGroup // zakładka: Apartamentowce / Hotele, Osiedla, Domy jednorodzinne
  description?: string // krótki opis pod nazwą (pusty = niewyświetlany)
  /** Plik zdjęcia czołowego (np. "07.jpg") — zamiast 01.jpg pierwsze w akordeonie, na podstronie i w Google. */
  cover?: string
  /** Zdjęcie główne (cover albo 01.jpg) — pierwsze w akordeonie i na podstronie. */
  image: string
  /** Wszystkie zdjęcia z folderu realizacji. */
  gallery: string[]
}

type ProjectInfo = Omit<Project, 'number' | 'image' | 'gallery'>

// Lista ułożona tak jak na stronie: chronologicznie, od najstarszej; bez roku — na końcu.
const info: ProjectInfo[] = [
  {
    slug: 'baltic-cliff',
    name: 'BALTIC CLIFF',
    displayName: 'Baltic Cliff',
    location: 'Niechorze, Polska',
    year: '2010',
    category: 'Hotele',
    group: 'apartamenty',
    description: '',
  },
  {
    slug: 'inwestycja-klifowa',
    cover: '05.jpg',
    name: 'INWESTYCJA KLIFOWA',
    displayName: 'Inwestycja Klifowa',
    location: 'Rewal, Polska',
    year: '2011',
    category: 'Apartamentowce',
    group: 'apartamenty',
    description: '',
  },
  {
    slug: 'apartamentowce',
    name: 'APARTAMENTOWCE',
    displayName: 'Apartamentowce',
    location: 'Dziwnów, Polska',
    year: '2016',
    category: 'Apartamentowce',
    group: 'apartamenty',
    description: '',
  },
  {
    slug: 'baltic-riviera',
    name: 'BALTIC RIVIERA',
    displayName: 'Baltic Riviera',
    location: 'Dziwnówek, Polska',
    year: '2019',
    category: 'Apartamentowce',
    group: 'apartamenty',
    description: '',
  },
  {
    slug: 'osiedle-panorama',
    cover: '03.jpg',
    name: 'OSIEDLE PANORAMA',
    displayName: 'Osiedle Panorama',
    location: 'Gryfice, Polska',
    year: '2020',
    category: 'Osiedla mieszkaniowe',
    group: 'osiedla',
    description: '',
  },
  {
    slug: 'blizniak-gryfice',
    name: 'BLIŹNIAK GRYFICE',
    displayName: 'Bliźniak Gryfice',
    location: 'Gryfice, Polska',
    year: '2024',
    category: 'Dom w zabudowie bliźniaczej',
    group: 'domy',
    description: '',
  },
  {
    slug: 'sjas',
    name: 'SJÅS',
    displayName: 'Sjås',
    location: 'Kronoberg, Szwecja', // działka Elmehult 16, gm. Tingsryd, region Kronoberg
    year: '2026',
    category: 'Dom jednorodzinny',
    group: 'domy',
    description: '',
  },
  {
    slug: 'zolcino',
    name: 'ŻÓŁCINO',
    displayName: 'Żółcino',
    location: 'Żółcino, Polska',
    year: '', // TODO: rok
    category: 'Koncepcja urbanistyczna',
    group: 'osiedla',
    description: '',
  },
  {
    slug: 'dom-na-wyspie',
    name: 'DOM NA WYSPIE',
    displayName: 'Dom na wyspie',
    location: 'Polska', // TODO: miejscowość
    year: '', // TODO: rok
    category: 'Dom jednorodzinny',
    group: 'domy',
    description: '',
  },
  {
    slug: 'wioska-rybacka-przytor',
    cover: '04.jpg',
    name: 'WIOSKA RYBACKA',
    displayName: 'Wioska Rybacka',
    location: 'Świnoujście-Przytór, Polska',
    year: '', // TODO: rok
    category: 'Koncepcja urbanistyczna',
    group: 'osiedla',
    description: '',
  },
  {
    slug: 'kamienica-kamien-pomorski',
    name: 'KAMIENICA',
    displayName: 'Kamienica',
    location: 'Kamień Pomorski, Polska',
    year: '', // TODO: rok
    category: 'Budynek mieszkalno-usługowy',
    group: 'osiedla',
    description: '',
  },
]

// sortowanie zabezpiecza kolejność, gdyby nowa realizacja trafiła w złe miejsce listy
const yearOf = (p: ProjectInfo) => Number(p.year) || Number.MAX_SAFE_INTEGER
const byYear = (a: ProjectInfo, b: ProjectInfo) => yearOf(a) - yearOf(b)

export const projects: Project[] = [...info].sort(byYear).map((p, i) => {
  const gallery = photosOf(p.slug, p.cover)
  return { ...p, number: String(i + 1).padStart(2, '0'), image: gallery[0], gallery }
})

// Zakładka "Wybrane" w sekcji Realizacje (pierwsza na stronie) i zdjęcia strony głównej dla Google —
// w tej kolejności. Czołowe zdjęcie każdej realizacji ustawia pole `cover`.
const FEATURED_SLUGS = ['osiedle-panorama', 'wioska-rybacka-przytor', 'baltic-cliff', 'sjas']

export const featuredProjects: Project[] = FEATURED_SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter(
  (p): p is Project => !!p && p.gallery.length > 0,
)
