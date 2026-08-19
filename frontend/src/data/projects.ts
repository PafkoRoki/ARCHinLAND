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
    id: 'house-land',
    number: '01',
    name: 'HOUSE / LAND',
    location: 'Mazury, Poland',
    year: '2025',
    category: 'Private residence',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80&auto=format&fit=crop',
    size: 'large',
    orientation: 'horizontal',
  },
  {
    id: 'courtyard-house',
    number: '02',
    name: 'COURTYARD HOUSE',
    location: 'Warsaw, Poland',
    year: '2024',
    category: 'Urban infill',
    image:
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80&auto=format&fit=crop',
    size: 'medium',
    orientation: 'vertical',
  },
  {
    id: 'landscape-residence',
    number: '03',
    name: 'LANDSCAPE RESIDENCE',
    location: 'Kraków, Poland',
    year: '2024',
    category: 'Private residence',
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80&auto=format&fit=crop',
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
