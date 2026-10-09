// Dane SEO stron publicznych (strona główna + realizacje) w jednym miejscu.
// Korzystają z nich:
//  - useSeo (w przeglądarce): tytuł karty, opis, canonical, Open Graph przy zmianie podstrony,
//  - scripts/prerender.mjs (przy budowaniu): osobny plik HTML dla każdej realizacji + sitemap.xml,
//    żeby wyszukiwarki i podglądy linków (Facebook, Messenger) widziały treść bez JavaScriptu.
// Katalog projektów (/projekty) jest za hasłem — celowo go tu nie ma (noindex, robots.txt).
import { projects, type Project } from '../data/realizations'

export const SITE_URL = 'https://archinland.pl'
export const SITE_NAME = 'ARCHinLAND'
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`

export interface PageMeta {
  path: string // np. "/realizacje/baltic-cliff"
  title: string
  description: string
  image: string // pełny adres URL
  imageAlt: string
  /** Zdjęcia strony (pełne adresy) — do sitemap.xml */
  images: string[]
  jsonLd: object[]
  /** Treść HTML dla robotów bez JavaScriptu; React podmienia ją po starcie */
  bodyHtml: string
  noindex?: boolean
}

const ORG_ID = `${SITE_URL}/#organization`

export const absolute = (src: string) => (/^https?:\/\//.test(src) ? src : SITE_URL + src)

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** "Niechorze, Poland" → "Niechorze"; samo "Poland" → "" */
const placeOf = (p: Project) => {
  const city = p.location.split(',')[0].trim()
  return /^(poland|polska)$/i.test(city) ? '' : city
}

const nameOf = (p: Project) => p.displayName ?? p.name

export const realizationPath = (p: Project) => `/realizacje/${p.slug}`

export function realizationMeta(p: Project): PageMeta {
  const name = nameOf(p)
  const place = placeOf(p)
  const where = place ? ` — ${place}` : ''
  const year = p.year ? ` (${p.year})` : ''
  const path = realizationPath(p)
  const url = SITE_URL + path
  const images = p.gallery.map(absolute)

  // opis z danych; gdy pusty — składany z kategorii, miejsca i roku
  const description =
    p.description?.trim() ||
    `${name}: ${p.category.toLowerCase()}${place ? ` w miejscowości ${place}` : ''}${p.year ? `, ${p.year}` : ''}. ` +
      `Realizacja biura architektonicznego ARCHinLAND — Andrzej Kurka, Kamień Pomorski.`

  const imageAlt = `${name} — ${p.category}${place ? `, ${place}` : ''}`

  return {
    path,
    title: `${name}${where} — ${p.category}${year} | ${SITE_NAME}`,
    description,
    image: images[0] ?? DEFAULT_IMAGE,
    imageAlt,
    images,
    noindex: false,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        '@id': `${url}#realizacja`,
        name,
        genre: p.category,
        description,
        url,
        image: images,
        ...(p.year && { dateCreated: p.year }),
        ...(place && { locationCreated: { '@type': 'Place', name: place, address: { '@type': 'PostalAddress', addressLocality: place, addressCountry: 'PL' } } }),
        creator: { '@id': ORG_ID },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Realizacje', item: `${SITE_URL}/#realizations` },
          { '@type': 'ListItem', position: 3, name, item: url },
        ],
      },
    ],
    bodyHtml: `<main>
  <p><a href="/">${SITE_NAME}</a> › <a href="/#realizations">Realizacje</a></p>
  <h1>${escapeHtml(name)}</h1>
  <p>${escapeHtml(p.category)}${place ? ` · ${escapeHtml(place)}` : ''}${p.year ? ` · ${p.year}` : ''}</p>
  <p>${escapeHtml(description)}</p>
  ${p.gallery.map((src, i) => `<img src="${src}" alt="${escapeHtml(imageAlt)}${i ? ` — zdjęcie ${i + 1}` : ''}" width="2000" loading="lazy">`).join('\n  ')}
  <nav><h2>Inne realizacje</h2><ul>${projects
    .filter((o) => o.slug !== p.slug)
    .map((o) => `<li><a href="${realizationPath(o)}">${escapeHtml(nameOf(o))}</a></li>`)
    .join('')}</ul></nav>
</main>`,
  }
}

export function homeMeta(): PageMeta {
  return {
    path: '/',
    title: 'ARCHinLAND — Biuro Architektoniczne Andrzej Kurka | Kamień Pomorski',
    description:
      'ARCHinLAND (Architecture in Land Development) — biuro architektoniczne Andrzeja Kurki w Kamieniu Pomorskim. ' +
      '35 lat doświadczenia: osiedla, budynki wielorodzinne i jednorodzinne, apartamentowce, hotele i obiekty użyteczności publicznej.',
    image: DEFAULT_IMAGE,
    imageAlt: 'ARCHinLAND — biuro architektoniczne',
    images: [DEFAULT_IMAGE],
    jsonLd: [], // dane firmy są na stałe w index.html
    bodyHtml: `<main>
  <h1>ARCHinLAND — Architecture in Land Development</h1>
  <p>Biuro architektoniczne Andrzeja Kurki, Kamień Pomorski. 35 lat doświadczenia, 180 000 m² zaprojektowanych powierzchni.
  Pełnobranżowe projekty: architektura, konstrukcje, instalacje sanitarne i elektryczne.</p>
  <nav><h2>Realizacje</h2><ul>${projects
    .map((p) => `<li><a href="${realizationPath(p)}">${escapeHtml(nameOf(p))} — ${escapeHtml(p.category)}${placeOf(p) ? `, ${escapeHtml(placeOf(p))}` : ''}</a></li>`)
    .join('')}</ul></nav>
</main>`,
  }
}

export const publicPages = (): PageMeta[] => [homeMeta(), ...projects.map(realizationMeta)]
