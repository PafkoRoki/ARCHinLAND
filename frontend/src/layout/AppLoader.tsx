import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { gsap } from 'gsap'
import { modelReady, onModelProgress } from '../lib/modelControls'
import './AppLoader.css'

const NUM_POINTS = 5
const DELAY_POINTS_MAX = 0.3
const DELAY_PER_PATH = 0.25
const DURATION = 1.9

// Na stronie głównej ekran ładowania czeka na model 3D (BackgroundModel),
// ale nie dłużej niż MAX_WAIT_MS — np. przy bardzo wolnym łączu.
const MAX_WAIT_MS = 20000
// po wczytaniu pasek postępu dopełnia się do 100% — chwila, żeby to było widać
const BAR_FINISH_MS = 450
// na model czekamy tylko przy wejściu na górę strony głównej — z adresem sekcji
// (np. /#realizations) model jest poza ekranem, więc nie ma na co czekać
const isHome = () => window.location.pathname === '/' && !window.location.hash
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

function waitForPage() {
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

  const gradientId = useId().replace(
    /[^a-zA-Z0-9_-]/g,
    '',
  )

  const gradient1Id = `${gradientId}-gradient1`
  const gradient2Id = `${gradientId}-gradient2`

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

    const appRoot = overlay.parentElement

    const hasInertSupport =
      'inert' in document.createElement('div')

    const wasInert =
      appRoot?.hasAttribute('inert') ?? false

    const hiddenSiblings: Element[] = []

    if (appRoot) {
      if (hasInertSupport) {
        appRoot.setAttribute('inert', '')
      } else {
        for (const child of Array.from(appRoot.children)) {
          if (child !== overlay) {
            hiddenSiblings.push(child)
            child.setAttribute('aria-hidden', 'true')
          }
        }
      }
    }

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
        timeline.play()
      })
    }, overlay)

    return () => {
      cancelled = true
      context.revert()

      if (appRoot) {
        if (hasInertSupport) {
          if (!wasInert) {
            appRoot.removeAttribute('inert')
          }
        } else {
          hiddenSiblings.forEach((node) =>
            node.removeAttribute('aria-hidden'),
          )
        }
      }
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
      <defs>
        <linearGradient
          id={gradient1Id}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop
            offset="0%"
            stopColor="#fad184"
          />
          <stop
            offset="100%"
            stopColor="#ffe4b1"
          />
        </linearGradient>

        <linearGradient
          id={gradient2Id}
          x1="100%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop
            offset="0%"
            stopColor="#111111"
          />
          <stop
            offset="100%"
            stopColor="#333333"
          />
        </linearGradient>
      </defs>

      <path
        className="shape-overlays__path"
        fill={`url(#${gradient2Id})`}
      />

      <path
        className="shape-overlays__path"
        fill={`url(#${gradient1Id})`}
      />
    </svg>
  )
}

function AppLoader() {
  const [isVisible, setIsVisible] = useState(true)
  const [isWaiting, setIsWaiting] = useState(true)
  const [progress, setProgress] = useState(0)
  const start = useMemo(waitForPage, [])
  const showStatus = useMemo(isHome, [])

  useEffect(() => onModelProgress(setProgress), [])
  // gotowe (albo limit czasu) → pasek dopełnia się do 100% przed odsłonięciem
  useEffect(() => {
    Promise.race([modelReady, wait(MAX_WAIT_MS)]).then(() => setProgress(1))
  }, [])

  const percent = Math.round(progress * 100)

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
    <div className="app-loader">
      <AppLoaderAnimation
        start={start}
        onStart={handleStart}
        onComplete={handleComplete}
      />
      {showStatus && isWaiting && (
        // pasek postępu wczytywania modelu 3D; bez znanego rozmiaru pliku — przesuwający się odcinek
        <div
          className={`app-loader__progress${progress > 0 ? '' : ' is-indeterminate'}`}
          role="progressbar"
          aria-label="Ładowanie modelu 3D"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress > 0 ? percent : undefined}
        >
          <div className="app-loader__row">
            <span className="app-loader__brand">ARCHinLAND</span>
            <span className="app-loader__percent">{progress > 0 ? `${percent}%` : ''}</span>
          </div>
          <div className="app-loader__track">
            <div className="app-loader__fill" style={{ transform: `scaleX(${progress})` }} />
          </div>
          <span className="app-loader__label">Ładowanie modelu 3D</span>
        </div>
      )}
    </div>
  )
}

export default AppLoader