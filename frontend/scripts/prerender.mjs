// Po `vite build`: osobny plik HTML dla każdej publicznej podstrony + sitemap.xml.
// Strona to SPA — bez tego każdy adres dostaje ten sam index.html (ten sam tytuł i opis),
// a podglądy linków i roboty bez JavaScriptu nie widzą treści realizacji.
//
// Dane bierze z src/seo/meta.ts, zbudowanego wcześniej przez `vite build --ssr` do dist-seo/
// (te same adresy zdjęć z hashem co w dist/assets — hash zależy od zawartości pliku).
// Cloudflare Pages serwuje dist/realizacje/<slug>.html pod adresem /realizacje/<slug>.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const seoDir = path.join(root, 'dist-seo')

const { publicPages, SITE_URL } = await import(pathToFileURL(path.join(seoDir, 'meta.js')).href)

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

// podmiana wartości w istniejącym znaczniku; brak znacznika = błąd (ktoś zmienił index.html)
function setContent(html, selector, value) {
  const re = new RegExp(`(<${selector}[^>]*?(?:content|href)=")[^"]*(")`)
  if (!re.test(html)) throw new Error(`prerender: brak znacznika ${selector} w index.html`)
  return html.replace(re, (_, a, b) => a + attr(value) + b)
}

function render(page) {
  const url = SITE_URL + page.path
  let html = template.replace(/<title>[^<]*<\/title>/, () => `<title>${attr(page.title)}</title>`)
  html = setContent(html, 'meta\\s+name="description"', page.description)
  html = setContent(html, 'meta\\s+name="robots"', page.noindex ? 'noindex, nofollow' : 'index, follow')
  html = setContent(html, 'link\\s+rel="canonical"', url)
  html = setContent(html, 'meta\\s+property="og:url"', url)
  html = setContent(html, 'meta\\s+property="og:title"', page.title)
  html = setContent(html, 'meta\\s+property="og:description"', page.description)
  html = setContent(html, 'meta\\s+property="og:image"', page.image)
  html = setContent(html, 'meta\\s+name="twitter:title"', page.title)
  html = setContent(html, 'meta\\s+name="twitter:description"', page.description)
  html = setContent(html, 'meta\\s+name="twitter:image"', page.image)
  if (page.path !== '/') {
    // wymiary w index.html dotyczą og-image.jpg (1200×630), nie zdjęć realizacji
    html = html.replace(/\s*<meta\s+property="og:image:(?:width|height)"[^>]*>/g, '')
    html = html.replace(/(<meta\s+property="og:type"\s+content=")website(")/, '$1article$2')
  }
  const extraHead = [
    `<meta property="og:image:alt" content="${attr(page.imageAlt)}" />`,
    ...page.jsonLd.map((data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`),
  ].join('\n    ')
  html = html.replace('</head>', () => `    ${extraHead}\n  </head>`)
  if (page.bodyHtml) {
    if (!html.includes('<div id="root"></div>')) throw new Error('prerender: brak <div id="root"></div>')
    html = html.replace('<div id="root"></div>', () => `<div id="root">${page.bodyHtml}</div>`)
  }
  return html
}

const pages = publicPages()
for (const page of pages) {
  const file = page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`
  const out = path.join(dist, file)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, render(page))
}

// sitemap.xml ze zdjęciami (Google Images)
const today = new Date().toISOString().slice(0, 10)
const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .filter((p) => !p.noindex)
  .map(
    (p) => `  <url>
    <loc>${xml(SITE_URL + p.path)}</loc>
    <lastmod>${today}</lastmod>
${p.images.map((img) => `    <image:image><image:loc>${xml(img)}</image:loc></image:image>`).join('\n')}
  </url>`,
  )
  .join('\n')}
</urlset>
`
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap)
fs.rmSync(seoDir, { recursive: true, force: true })
console.log(`prerender: ${pages.length} stron + sitemap.xml`)
