import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

// Płynne przewijanie całej strony (jak na lusion.co): kółko myszy nie skacze po 100 px,
// tylko strona dojeżdża miękko do celu. Na dotyku zostaje natywne przewijanie telefonu
// (z jego bezwładnością), więc nic nie przeszkadza palcom.
// Pozycja przewinięcia to dalej zwykłe window.scrollY, więc sticky i wszystkie efekty
// oparte na zdarzeniu "scroll" działają bez zmian.

const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const lenis: Lenis | null =
  typeof window === 'undefined' || reduced
    ? null
    : new Lenis({
        lerp: 0.09, // jak szybko strona dogania cel (mniejsze = płynniej, dłużej)
        smoothWheel: true,
        syncTouch: false, // palec: natywne przewijanie
        anchors: true, // linki #sekcja (menu) też jadą płynnie
        autoRaf: true,
      })

// podgląd w trybie deweloperskim (testy przewijania)
if (import.meta.env.DEV && lenis) (window as unknown as { __lenis: Lenis }).__lenis = lenis

/** Przewiń do elementu albo pozycji: płynnie (Lenis) albo, bez Lenisa, zwyczajnie. */
export function scrollToTarget(target: HTMLElement | number, opts: { immediate?: boolean; offset?: number } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { immediate: opts.immediate, offset: opts.offset ?? 0 })
    return
  }
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY
  window.scrollTo({ top: top + (opts.offset ?? 0), behavior: opts.immediate ? 'auto' : 'smooth' })
}
