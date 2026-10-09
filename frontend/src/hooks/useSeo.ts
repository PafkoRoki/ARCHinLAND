import { useEffect } from 'react'
import { SITE_URL, type PageMeta } from '../seo/meta'

type Meta = Pick<PageMeta, 'path' | 'title' | 'description' | 'image' | 'imageAlt' | 'noindex'>

// znajdź (albo utwórz) znacznik w <head> i ustaw mu wartość
function setTag(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

const meta = (key: 'name' | 'property', name: string, value: string) =>
  setTag(
    `meta[${key}="${name}"]`,
    () => {
      const m = document.createElement('meta')
      m.setAttribute(key, name)
      return m
    },
    'content',
    value,
  )

/** Tytuł karty, opis, canonical i Open Graph bieżącej podstrony (SPA — przy każdej zmianie adresu). */
export function useSeo(page: Meta | null) {
  useEffect(() => {
    if (!page) return
    const url = SITE_URL + page.path
    document.title = page.title
    meta('name', 'description', page.description)
    meta('name', 'robots', page.noindex ? 'noindex, nofollow' : 'index, follow')
    setTag('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), 'href', url)
    meta('property', 'og:url', url)
    meta('property', 'og:title', page.title)
    meta('property', 'og:description', page.description)
    meta('property', 'og:image', page.image)
    meta('property', 'og:image:alt', page.imageAlt)
    meta('name', 'twitter:title', page.title)
    meta('name', 'twitter:description', page.description)
    meta('name', 'twitter:image', page.image)
  }, [page])
}
