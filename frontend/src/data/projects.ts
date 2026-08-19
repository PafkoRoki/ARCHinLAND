export interface Project {
  id: string
  number: string
  name: string
  location: string
  year: string
  category: string
  image: string
  size: 'large' | 'medium' | 'small'
  orientation: 'horizontal' | 'vertical'
}

export const projects: Project[] = [
  {
    id: 'Baltic Cliff',
    number: '01',
    name: 'BALTIC CLIFF',
    location: 'Niechorze, Poland',
    year: '2015',
    category: 'Hotele',
    image: '/images/baltic-cliff.jpg',
    size: 'large',
    orientation: 'horizontal',
  },
  {
    id: 'Baltic Riviera',
    number: '02',
    name: 'BALTIC RIVIERA',
    location: 'Dziwnówek, Poland',
    year: '2019',
    category: 'Apartamentowce',
    image: '/images/baltic-riviera.jpg',
    size: 'medium',
    orientation: 'vertical',
  },
  {
    id: 'Osiedle Panorama',
    number: '03',
    name: 'OSIEDLE PANORAMA',
    location: 'Gryfice, Poland',
    year: '2020',
    category: 'Osiedla mieszkaniowe',
    image: '/images/osiedle-panorama.jpg',
    size: 'small',
    orientation: 'horizontal',
  },
  {
    id: 'rural-retreat',
    number: '04',
    name: 'RURAL RETREAT',
    location: 'Podlasie, Poland',
    year: '2023',
    category: 'Guest house',
    image:
      'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=1600&q=80&auto=format&fit=crop',
    size: 'large',
    orientation: 'vertical',
  },
  {
    id: 'timber-pavilion',
    number: '05',
    name: 'TIMBER PAVILION',
    location: 'Kashubia, Poland',
    year: '2023',
    category: 'Cultural space',
    image:
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80&auto=format&fit=crop',
    size: 'small',
    orientation: 'horizontal',
  },
  {
    id: 'orchard-studio',
    number: '06',
    name: 'ORCHARD STUDIO',
    location: 'Lubuskie, Poland',
    year: '2022',
    category: 'Studio & workshop',
    image:
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&q=80&auto=format&fit=crop',
    size: 'medium',
    orientation: 'vertical',
  },
]
