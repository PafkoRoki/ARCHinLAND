import { useEffect } from 'react'
import { lenis } from './smoothScroll'

// "Magnes" przewijania na stronie głównej: gdy przestajesz przewijać tuż PRZED ważnym momentem,
// strona miękko dojeżdża do niego. Punkty:
//   - góra strony (bryły w Hero),
//   - "Projektujemy od 1991": początek przytrzymania tekstu z miniaturą,
//   - duża ramka ZOBACZ ARCHITEKTURĘ stoi na środku ekranu,
//   - początki sekcji: Architektura, Projekty, Opinie, Kontakt.
// Magnes ciągnie tylko w stronę, w którą przewijasz, nigdy z powrotem. Gdy stoisz na sekcji
// i lekko przewiniesz dalej, strona nie wraca na sekcję: łatwo z niej wyjść, a jeśli następny
// punkt jest blisko, magnes wręcz pomaga do niego dojechać.
// Tylko z myszą/touchpadem (pointer: fine); na telefonie zostaje natywne przewijanie.
const INTRO_TOP = 72 // tyle px od góry stoi przyklejony tekst O nas (About.css: .about__intro top)
const REACH = 0.2 // przyciąga z odległości 1/5 ekranu (tylko punkt przed tobą)
const IDLE_MS = 260 // po tylu ms bez przewijania
const MIN_GAP = 4 // px: już na punkcie

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export function useMagnet() {
  useEffect(() => {
    const l = lenis
    if (!l || !window.matchMedia('(pointer: fine)').matches) return
    let points: number[] = []
    let timer = 0
    let dir = 0 // ostatni kierunek przewijania użytkownika: 1 w dół, -1 w górę
    let lastY = l.scroll
    let snapping = false

    const docTop = (el: Element | null) => (el ? el.getBoundingClientRect().top + window.scrollY : null)
    const placePoints = () => {
      const vh = window.innerHeight
      const list: (number | null)[] = [0]
      // przytrzymanie w O nas: tekst przykleja się 72 px od góry
      const hold = docTop(document.querySelector('.about__hold'))
      list.push(hold === null ? null : hold - INTRO_TOP)
      // duża ramka: przyklejona, gdy jej góra stoi (vh - wysokość) / 2 od góry ekranu
      const stage = document.querySelector<HTMLElement>('.about__stage')
      const reel = docTop(document.querySelector('.about__reel'))
      if (stage && reel !== null) list.push(reel - (vh - stage.offsetHeight) / 2)
      for (const id of ['realizations', 'projects', 'reviews', 'contact']) list.push(docTop(document.getElementById(id)))
      points = list
        .filter((v): v is number => v !== null && Number.isFinite(v))
        .map((v) => Math.max(0, Math.round(v)))
    }

    const settle = () => {
      timer = 0
      if (snapping || !dir) return
      const y = l.scroll
      const reach = window.innerHeight * REACH
      // tylko punkty przed nami w kierunku przewijania i w zasięgu magnesu
      let best: number | null = null
      for (const p of points) {
        const ahead = (p - y) * dir
        if (ahead > MIN_GAP && ahead <= reach && (best === null || ahead < (best - y) * dir)) best = p
      }
      if (best === null) return
      snapping = true
      l.scrollTo(best, {
        duration: 0.8,
        easing: easeOut,
        onComplete: () => {
          snapping = false
        },
      })
    }

    const onScroll = () => {
      const y = l.scroll
      if (!snapping && y !== lastY) dir = y > lastY ? 1 : -1
      lastY = y
      clearTimeout(timer)
      timer = window.setTimeout(settle, IDLE_MS)
    }
    // kółko w czasie dojazdu magnesu: oddajemy przewijanie użytkownikowi (bez walki z nim)
    const onWheel = () => {
      snapping = false
    }

    placePoints()
    const off = l.on('scroll', onScroll)
    window.addEventListener('wheel', onWheel, { passive: true })
    // układ strony zmienia się po wczytaniu zdjęć i czcionek: punkty liczymy wtedy od nowa
    const ro = new ResizeObserver(() => placePoints())
    ro.observe(document.body)
    window.addEventListener('resize', placePoints)
    return () => {
      off()
      clearTimeout(timer)
      ro.disconnect()
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', placePoints)
    }
  }, [])
}
