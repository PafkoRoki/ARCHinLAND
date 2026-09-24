// Realne pliki, które faktycznie są w src/assets — importowane przez Vite,
// więc trafią do bundla z poprawnym hashem/URL. Trzymamy je tutaj (a nie w
// komponencie sekcji), żeby zarówno akordeon na stronie głównej, jak i
// RealizationsDetail miały dostęp do tych samych, rozwiązanych obrazków.
import osiedlePanorama_0 from '../assets/Projects/osiedle-panorama_0.jpg'
import osiedlePanorama_1 from '../assets/Projects/osiedle-panorama_1.jpg'
import osiedlePanorama_2 from '../assets/Projects/osiedle-panorama_2.jpg'
import osiedlePanorama_3 from '../assets/Projects/osiedle-panorama_3.jpg'
import osiedlePanorama_4 from '../assets/Projects/osiedle-panorama_4.jpg'
import osiedlePanorama_5 from '../assets/Projects/osiedle-panorama_5.jpg'
import osiedlePanorama_6 from '../assets/Projects/osiedle-panorama_6.jpg'
import budynekUslugowoImg from '../assets/Projects/budynek-uslugowo-mieszkalny.jpg'
import balticcliff_0 from '../assets/Projects/baltic-cliff_0.jpg'
import balticcliff_1 from '../assets/Projects/baltic-cliff_1.jpg'
import balticcliff_2 from '../assets/Projects/baltic-cliff_2.jpg'
import balticcliff_3 from '../assets/Projects/baltic-cliff_3.jpg'
import balticcliff_4 from '../assets/Projects/baltic-cliff_4.jpg'
import balticcliff_5 from '../assets/Projects/baltic-cliff_5.jpg'
import balticrivieraImg from '../assets/Projects/baltic-riviera.jpg'
import domnawyspieImg from '../assets/Projects/wyspa.jpg'
import szwedImg from '../assets/Projects/Sjas.jpg'
// TODO: podmienić na docelowe zdjęcia realizacji, gdy będą dostępne.
import placeholderImg from '../assets/render.webp'

// Jeśli masz dodatkowe zdjęcia danej realizacji w src/assets/Projects,
// zaimportuj je tutaj tak samo jak powyżej i dopisz do tablicy `gallery`
// tego projektu, np.:
//   import balticCliffImg2 from '../assets/Projects/Baltic-cliff-2.jpg'
//   ...
//   gallery: [balticCliffImg, balticCliffImg2],

export interface Project {
  id: string
  slug: string
  number: string
  name: string
  location: string
  year: string
  category: string
  /** Zdjęcie główne — używane w akordeonie na stronie głównej i jako pierwsze w galerii szczegółów. */
  image: string
  /** Wszystkie zdjęcia pokazywane na stronie szczegółów (miniatury pod dużym zdjęciem). */
  gallery: string[]
  description?: string
  size: 'large' | 'medium' | 'small'
  orientation: 'horizontal' | 'vertical'
}

export const projects: Project[] = [
  {
    id: 'Baltic Cliff',
    slug: 'baltic-cliff',
    number: '01',
    name: 'BALTIC CLIFF',
    location: 'Niechorze, Poland',
    year: '2015',
    category: 'Hotele',
    image: balticcliff_0,
    gallery: [balticcliff_0, balticcliff_1, balticcliff_2, balticcliff_3, balticcliff_4, balticcliff_5],
    size: 'large',
    orientation: 'horizontal',
  },
  {
    id: 'Baltic Riviera',
    slug: 'baltic-riviera',
    number: '02',
    name: 'BALTIC RIVIERA',
    location: 'Dziwnówek, Poland',
    year: '2019',
    category: 'Apartamentowce',
    image: balticrivieraImg,
    gallery: [balticrivieraImg],
    size: 'medium',
    orientation: 'vertical',
  },
  {
    id: 'Osiedle Panorama',
    slug: 'osiedle-panorama',
    number: '03',
    name: 'OSIEDLE PANORAMA',
    location: 'Gryfice, Poland',
    year: '2020',
    category: 'Osiedla mieszkaniowe',
    image: osiedlePanorama_0,
    gallery: [osiedlePanorama_0, osiedlePanorama_1, osiedlePanorama_2, osiedlePanorama_3, osiedlePanorama_4, osiedlePanorama_5, osiedlePanorama_6],
    size: 'small',
    orientation: 'horizontal',
  },
  {
    id: 'Dom na wyspie',
    slug: 'dom-na-wyspie',
    number: '04',
    name: 'DOM NA WYSPIE',
    location: 'Poland',
    year: '',
    category: 'Dom jednorodzinny',
    image: domnawyspieImg,
    gallery: [domnawyspieImg],
    size: 'large',
    orientation: 'vertical',
  },
  {
    id: 'Budynek usługowo-mieszkalny',
    slug: 'budynek-uslugowo-mieszkalny',
    number: '05',
    name: 'BUDYNEK USŁUGOWO-MIESZKALNY',
    location: 'Gryfice, Poland',
    year: '2025',
    category: 'Dom jednorodzinny',
    image: budynekUslugowoImg,
    gallery: [budynekUslugowoImg],
    size: 'small',
    orientation: 'horizontal',
  },
  {
    id: 'Szwecja',
    slug: 'szwecja',
    number: '06',
    name: 'SZWECJA',
    location: 'Sweden',
    year: '2026',
    category: 'Dom jednorodzinny',
    image: szwedImg,
    gallery: [szwedImg],
    size: 'medium',
    orientation: 'vertical',
  },
]

export const placeholderImage = placeholderImg
