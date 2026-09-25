// Zdjęcia realizacji leżą w src/assets/realizacje/<slug>/01.jpg, 02.jpg, …
// Vite wczytuje je automatycznie (import.meta.glob) — żeby dodać zdjęcie, wystarczy wrzucić
// kolejny plik do folderu realizacji. Kolejność = kolejność nazw plików; 01.jpg to zdjęcie główne.
// Zdjęcia warto zmniejszyć do ~2000 px szerokości przed dodaniem (duże pliki spowalniają stronę).
const photoFiles = import.meta.glob<string>('../assets/realizacje/*/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

const photosOf = (slug: string) =>
  Object.keys(photoFiles)
    .filter((file) => file.includes(`/realizacje/${slug}/`))
    .sort()
    .map((file) => photoFiles[file])

/** Zakładka w sekcji Realizacje */
export type RealizationGroup = 'apartamenty' | 'osiedla' | 'domy'

export interface Project {
  id: string
  slug: string // = nazwa folderu ze zdjęciami w src/assets/realizacje/
  number: string
  name: string
  location: string
  year: string
  category: string
  group: RealizationGroup // zakładka: Apartamentowce / Hotele, Osiedla, Domy jednorodzinne
  /** Zdjęcie główne (01.jpg) — pierwsze w akordeonie i w galerii szczegółów. */
  image: string
  /** Wszystkie zdjęcia z folderu realizacji. */
  gallery: string[]
  description?: string
  /** Nazwa w podpisie galerii (sekcja Realizacje) w zwykłej pisowni, np. "Baltic Cliff"; domyślnie name. */
  displayName?: string
}

type ProjectInfo = Omit<Project, 'image' | 'gallery'>

const info: ProjectInfo[] = [
  {
    id: 'Baltic Cliff',
    slug: 'baltic-cliff',
    group: 'apartamenty',
    number: '01',
    name: 'BALTIC CLIFF',
    displayName: 'Baltic Cliff',
    location: 'Niechorze, Poland',
    year: '2015',
    category: 'Hotele',
    description: '', // krótki opis pod nazwą w galerii (pusty = niewyświetlany)
  },
  {
    id: 'Osiedle Panorama',
    slug: 'osiedle-panorama',
    group: 'osiedla',
    number: '02',
    name: 'OSIEDLE PANORAMA',
    displayName: 'Osiedle Panorama',
    location: 'Gryfice, Poland',
    year: '2020',
    category: 'Osiedla mieszkaniowe',
    description: '', // krótki opis pod nazwą w galerii (pusty = niewyświetlany)
  },
  {
    id: 'Sjås',
    slug: 'sjas',
    group: 'domy',
    number: '03',
    name: 'SJÅS',
    displayName: 'Sjås',
    location: 'Kronoberg, Szwecja', // działka Elmehult 16, gm. Tingsryd, region Kronoberg
    year: '2026',
    category: 'Dom jednorodzinny',
    description: '', // krótki opis pod nazwą w galerii (pusty = niewyświetlany)
  },
  {
    id: 'Apartamentowce Dziwnów',
    slug: 'apartamentowce',
    group: 'apartamenty',
    number: '04',
    name: 'APARTAMENTOWCE',
    displayName: 'Apartamentowce',
    location: 'Dziwnów, Poland',
    year: '2018', // uzupełnij rok (pusty = niewyświetlany)
    category: 'Apartamentowce',
    description: '', // krótki opis pod nazwą w galerii (pusty = niewyświetlany)
  },
  {
    id: 'Baltic Riviera',
    slug: 'baltic-riviera',
    group: 'apartamenty',
    number: '05',
    name: 'BALTIC RIVIERA',
    displayName: 'Baltic Riviera',
    location: 'Dziwnówek, Poland',
    year: '2019',
    category: 'Apartamentowce',
    description: '', // krótki opis pod nazwą w galerii (pusty = niewyświetlany)
  },
]

export const projects: Project[] = info.map((p) => {
  const gallery = photosOf(p.slug)
  return { ...p, image: gallery[0], gallery }
})
