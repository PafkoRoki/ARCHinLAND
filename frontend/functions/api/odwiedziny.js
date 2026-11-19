// Licznik odwiedzin w stopce: GET /api/odwiedziny -> { "visits": 1234 }
// Działa na serwerze Cloudflare (Pages Functions), więc klucz API nigdy nie trafia do przeglądarki.
//
// Skąd liczba: Cloudflare Web Analytics (te same dane co w panelu Cloudflare). Przy małym ruchu
// Cloudflare je szacuje, więc licznik jest przybliżony.
// "Od początku": szczegółowe dane Cloudflare trzyma tylko kilka miesięcy, dlatego sumę zamkniętych
// dni zapisujemy w bazie KV (wiązanie VISITS) i co dzień dopisujemy wczorajsze wizyty; dzisiejsze
// doliczamy na bieżąco. Bez bazy KV liczymy wszystko od nowa z API (wystarczy, dopóki Cloudflare
// ma dane od pierwszego dnia).
//
// Ustawienia w Cloudflare (Pages, projekt architecture-in-land-development):
//   CF_ANALYTICS_TOKEN  (sekret)  klucz API z uprawnieniem Account Analytics: Read
//   VISITS              (KV)      baza na sumę, wpisana w wrangler.jsonc

const ACCOUNT_ID = 'e234e112ac65fb7a8dfbc5fb85c14106'
const SITE_TAG = '54d83e21863545f4a5fdea7d16eec87a' // archinland.pl w Web Analytics
const START = '2026-10-22' // pierwszy dzień pomiaru
const CACHE_SECONDS = 3600 // liczba odświeża się co godzinę
const CHUNK_DAYS = 30 // jedno zapytanie obejmuje najwyżej tyle dni

const DAY = 86400e3
const isoDay = (t) => new Date(t).toISOString().slice(0, 10)
const dayStart = (d) => Date.parse(d + 'T00:00:00Z')

const QUERY = `query($a: string!, $f: AccountRumPageloadEventsAdaptiveGroupsFilter_InputObject) {
  viewer { accounts(filter: { accountTag: $a }) {
    rumPageloadEventsAdaptiveGroups(filter: $f, limit: 1) { sum { visits } }
  } }
}`

/** Suma wizyt (bez botów) w przedziale [from, to) w milisekundach */
async function visitsBetween(token, from, to) {
  let total = 0
  for (let a = from; a < to; a += CHUNK_DAYS * DAY) {
    const b = Math.min(to, a + CHUNK_DAYS * DAY)
    const filter = {
      AND: [
        { datetime_geq: new Date(a).toISOString(), datetime_lt: new Date(b).toISOString() },
        { siteTag: SITE_TAG },
        { bot: 0 },
      ],
    }
    const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { a: ACCOUNT_ID, f: filter } }),
    })
    const json = await res.json()
    if (!res.ok || json.errors?.length) throw new Error('analytics ' + res.status)
    total += json.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups?.[0]?.sum?.visits ?? 0
  }
  return total
}

async function countAll(env) {
  const token = env.CF_ANALYTICS_TOKEN
  const now = Date.now()
  const today = dayStart(isoDay(now))
  if (!env.VISITS) return visitsBetween(token, dayStart(START), now)

  // zamknięte dni: suma zapisana w KV, dopisujemy brakujące dni do wczoraj włącznie
  const saved = (await env.VISITS.get('total', 'json')) ?? { total: 0, through: isoDay(dayStart(START) - DAY) }
  const from = dayStart(saved.through) + DAY
  if (from < today) {
    saved.total += await visitsBetween(token, from, today)
    saved.through = isoDay(today - DAY)
    await env.VISITS.put('total', JSON.stringify(saved))
  }
  return saved.total + (await visitsBetween(token, today, now))
}

export async function onRequestGet(context) {
  const { env, request } = context
  const cache = caches.default
  const key = new Request(new URL('/api/odwiedziny', request.url).toString())
  const hit = await cache.match(key)
  if (hit) return hit

  if (!env.CF_ANALYTICS_TOKEN) return new Response(null, { status: 204 })
  try {
    const visits = await countAll(env)
    const res = new Response(JSON.stringify({ visits }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': `public, max-age=${CACHE_SECONDS}` },
    })
    context.waitUntil(cache.put(key, res.clone()))
    return res
  } catch {
    // brak danych: stopka po prostu nie pokaże licznika
    return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } })
  }
}
