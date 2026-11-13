import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { gsap } from 'gsap'
import { modelReady } from '../lib/modelControls'
import './AppLoader.css'

const NUM_POINTS = 5
const DELAY_POINTS_MAX = 0.3
const DELAY_PER_PATH = 0.25
const DURATION = 1.9

// Na stronie głównej ekran ładowania czeka na model 3D (BackgroundModel),
// ale nie dłużej niż MAX_WAIT_MS — przy wolnym łączu strona pokazuje się bez modelu,
// a model dorysowuje się w soczewce, gdy dojdzie (plik ma ~8.6 MB).
const MAX_WAIT_MS = 4000
// po wczytaniu modelu krótka chwila, zanim plansza zacznie schodzić
const BAR_FINISH_MS = 450
// na model czekamy tylko przy wejściu na górę strony głównej — z adresem sekcji
// (np. /#realizations) model jest poza ekranem, więc nie ma na co czekać
const isHome = () => window.location.pathname === '/' && !window.location.hash
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Strona pod planszą (rodzeństwo .app-loader w #root) jest niedostępna, dopóki loader stoi; sam loader zostaje
 *  dostępny — ma komunikat o wczytywaniu. Zwraca funkcję, która to cofa. */
function blockSiblings(loader: Element) {
  const hasInertSupport = 'inert' in document.createElement('div')
  const attr = hasInertSupport ? 'inert' : 'aria-hidden'
  const blocked: Element[] = []
  for (const child of Array.from(loader.parentElement?.children ?? [])) {
    if (child === loader || child.hasAttribute(attr)) continue
    child.setAttribute(attr, hasInertSupport ? '' : 'true')
    blocked.push(child)
  }
  return () => blocked.forEach((node) => node.removeAttribute(attr))
}

// Tylko `bun run dev`: /?loader=40 zatrzymuje loader na 40% (lokalnie model wczytuje się w ułamku sekundy),
// kliknięcie w ekran uruchamia wyjście. W buildzie produkcyjnym import.meta.env.DEV = false i kodu nie ma.
const DEV_PREVIEW = import.meta.env.DEV ? new URLSearchParams(window.location.search).get('loader') : null

function waitForPage() {
  if (DEV_PREVIEW !== null) {
    return new Promise<void>((resolve) => window.addEventListener('pointerdown', () => resolve(), { once: true }))
  }
  if (!isHome()) return Promise.resolve()
  return Promise.race([modelReady, wait(MAX_WAIT_MS)]).then(() => wait(BAR_FINISH_MS))
}

type AppLoaderAnimationProps = {
  start: Promise<void> // animacja odsłonięcia rusza, gdy się spełni
  onStart: () => void
  onComplete: () => void
}

function AppLoaderAnimation({
  start,
  onStart,
  onComplete,
}: AppLoaderAnimationProps) {
  const overlayRef = useRef<SVGSVGElement | null>(null)

  useLayoutEffect(() => {
    const overlay = overlayRef.current

    if (!overlay) return

    const paths = Array.from(
      overlay.querySelectorAll<SVGPathElement>(
        '.shape-overlays__path',
      ),
    )

    const numPaths = paths.length
    const pointsDelay: number[] = []
    const allPoints: number[][] = []

    let isOpened = true


    for (let i = 0; i < numPaths; i++) {
      const points: number[] = []

      allPoints.push(points)

      for (let j = 0; j < NUM_POINTS; j++) {
        points.push(100)
      }
    }

    function render() {
      for (let i = 0; i < numPaths; i++) {
        const path = paths[i]
        const points = allPoints[i]

        let d = ''

        d += isOpened
          ? `M 0 0 V ${points[0]} C`
          : `M 0 ${points[0]} C`

        for (
          let j = 0;
          j < NUM_POINTS - 1;
          j++
        ) {
          const p =
            ((j + 1) / (NUM_POINTS - 1)) * 100

          const cp =
            p -
            (1 / (NUM_POINTS - 1) / 2) * 100

          d += ` ${cp} ${points[j]} ${cp} ${points[j + 1]} ${p} ${points[j + 1]}`
        }

        d += isOpened
          ? ' V 100 H 0'
          : ' V 0 H 0'

        path.setAttribute('d', d)
      }
    }

    render()

    let cancelled = false

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        paused: true, // rusza dopiero, gdy strona (model 3D) jest gotowa
        onUpdate: render,
        defaults: {
          ease: 'power2.inOut',
          duration: DURATION,
        },
      })

      function toggle() {
        timeline.progress(0).clear()

        for (let i = 0; i < NUM_POINTS; i++) {
          pointsDelay[i] =
            Math.random() * DELAY_POINTS_MAX
        }

        for (let i = 0; i < numPaths; i++) {
          const points = allPoints[i]

          const pathDelay =
            DELAY_PER_PATH *
            (isOpened
              ? i
              : numPaths - i - 1)

          for (
            let j = 0;
            j < NUM_POINTS;
            j++
          ) {
            const delay = pointsDelay[j]

            timeline.to(
              points,
              {
                [j]: 0,
              },
              delay + pathDelay,
            )
          }
        }

        isOpened = !isOpened
      }

      toggle()
      // plansza zakrywa cały ekran już w trakcie czekania (przed startem animacji)
      render()

      timeline.eventCallback(
        'onComplete',
        onComplete,
      )

      start.then(() => {
        if (cancelled) return
        onStart()
        // ograniczony ruch: bez fali — plansza znika od razu
        if (prefersReducedMotion()) onComplete()
        else timeline.play()
      })
    }, overlay)

    return () => {
      cancelled = true
      context.revert()
    }
  }, [start, onStart, onComplete])

  return (
    <svg
      ref={overlayRef}
      className="shape-overlays"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* jasna plansza w kolorach strony (bez gradientów): na wierzchu tło strony (#f0f0f0),
          pod nią fala o ton ciemniejsza, żeby zejście planszy było widać */}
      <path
        className="shape-overlays__path"
        fill="#e2e1dd"
      />

      <path
        className="shape-overlays__path"
        fill="#f0f0f0"
      />
    </svg>
  )
}

// Ekran ładowania na każdej stronie taki sam: jasna plansza w kolorach strony, która schodzi falą.
// Na górze strony głównej plansza czeka na model 3D (najwyżej MAX_WAIT_MS), na pozostałych schodzi od razu.
function AppLoader() {
  const [isVisible, setIsVisible] = useState(true)
  const [isWaiting, setIsWaiting] = useState(true)
  const start = useMemo(waitForPage, [])
  const loaderRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!isVisible || !loaderRef.current) return
    return blockSiblings(loaderRef.current)
  }, [isVisible])

  const handleStart = useCallback(() => {
    setIsWaiting(false)
  }, [])

  const handleComplete = useCallback(() => {
    setIsVisible(false)
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <div ref={loaderRef} className="app-loader" style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
      <p className="visually-hidden" role="status">
        {isWaiting ? 'Wczytywanie strony…' : 'Strona wczytana'}
      </p>
      <AppLoaderAnimation start={start} onStart={handleStart} onComplete={handleComplete} />
    </div>
  )
}

export default AppLoader
