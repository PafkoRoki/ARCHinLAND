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
    id: 'Dom na wyspie',
    number: '04',
    name: 'DOM NA WYSPIE',
    location: 'Poland',
    year: '',
    category: 'Dom jednorodzinny',
    image: '/images/dom-na-wyspie.jpg',
    size: 'large',
    orientation: 'vertical',
  },
  {
    id: 'Budynek usługowo-mieszkalny',
    number: '05',
    name: 'BUDYNEK USŁUGOWO-MIESZKALNY',
    location: 'Gryfice, Poland',
    year: '2025',
    category: 'Dom jednorodzinny',
    image: '/images/budynek-uslugowo-mieszkalny.jpg',
    size: 'small',
    orientation: 'horizontal',
  },
  {
    id: 'Dom w konstrukcji szkieletowej',
    number: '06',
    name: 'DOM W KONSTRUKCJI SZKIELETOWEJ',
    location: 'Sweden',
    year: '2026',
    category: 'Dom jednorodzinny',
    image: '/images/dom-w-konstrukcji-szkieletowej.jpg',
    size: 'medium',
    orientation: 'vertical',
  },
]
