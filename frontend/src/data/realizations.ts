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

export interface Project {
  id: string
  slug: string // = nazwa folderu ze zdjęciami w src/assets/realizacje/
  number: string
  name: string
  location: string
  year: string
  category: string
  /** Zdjęcie główne (01.jpg) — pierwsze w akordeonie i w galerii szczegółów. */
  image: string
  /** Wszystkie zdjęcia z folderu realizacji. */
  gallery: string[]
  description?: string
}

type ProjectInfo = Omit<Project, 'image' | 'gallery'>

const info: ProjectInfo[] = [
  {
    id: 'Baltic Cliff',
    slug: 'baltic-cliff',
    number: '01',
    name: 'BALTIC CLIFF',
    location: 'Niechorze, Poland',
    year: '2015',
    category: 'Hotele',
  },
  {
    id: 'Osiedle Panorama',
    slug: 'osiedle-panorama',
    number: '02',
    name: 'OSIEDLE PANORAMA',
    location: 'Gryfice, Poland',
    year: '2020',
    category: 'Osiedla mieszkaniowe',
  },
  {
    id: 'Szwecja',
    slug: 'szwecja',
    number: '03',
    name: 'SZWECJA',
    location: 'Sweden',
    year: '2026',
    category: 'Dom jednorodzinny',
  },
]

export const projects: Project[] = info.map((p) => {
  const gallery = photosOf(p.slug)
  return { ...p, image: gallery[0], gallery }
})
