import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  to: number
  duration?: number // sekundy
  /** Sterowanie z zewnątrz (np. tekst w przypiętej scenie, który jest na ekranie, ale jeszcze niewidoczny).
      Bez tego licznik startuje, gdy liczba wjedzie na ekran. */
  start?: boolean
}

// polski zapis z odstępem tysięcy: 180 000 (spacja nierozdzielająca)
const format = (n: number) => n.toLocaleString('pl-PL').replace(/\s/g, ' ')
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/** Liczba rosnąca od 0 do `to` — raz, przy pierwszym pokazaniu. */
export default function CountUp({ to, duration = 1.8, start }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [inView, setInView] = useState(false)
  const [value, setValue] = useState(0)

  // tryb domyślny: start po wjechaniu na ekran
  useEffect(() => {
    if (start !== undefined || !ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [start])

  const active = start ?? inView

  useEffect(() => {
    if (!active) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setValue(to)
      return
    }
    let frame = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / (duration * 1000))
      setValue(Math.round(easeOutCubic(t) * to))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, to, duration])

  return (
    <span ref={ref} className="count-up">
      {/* czytniki ekranu dostają od razu wartość końcową */}
      <span aria-hidden="true">{format(value)}</span>
      <span className="visually-hidden">{format(to)}</span>
    </span>
  )
}
