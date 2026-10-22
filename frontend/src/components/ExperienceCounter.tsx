import { useEffect, useMemo, useRef, useState } from 'react'
import './ExperienceCounter.css'

interface ExperienceCounterProps {
  /** Data założenia firmy (YYYY-MM-DD lub Date) */
  since: Date | string
  /** Sterowanie z zewnątrz — bez tego startuje po wjechaniu na ekran */
  start?: boolean
  duration?: number // sekundy animacji
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const pad = (n: number) => n.toString().padStart(2, '0')

/** Oblicza lata, miesiące, dni, godziny, minuty, sekundy od daty */
function calcExperience(since: Date, now: Date) {
  let years = now.getFullYear() - since.getFullYear()
  let months = now.getMonth() - since.getMonth()
  let days = now.getDate() - since.getDate()

  // korekta dni
  if (days < 0) {
    months--
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    days += prevMonth.getDate()
  }
  // korekta miesięcy
  if (months < 0) {
    years--
    months += 12
  }

  // czas w dniu
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()

  return { years, months, days, hours, minutes, seconds }
}

/**
 * Licznik doświadczenia: animuje lata, potem pokazuje żywy zegar
 * z miesiącami, dniami, godzinami, minutami i sekundami.
 */
export default function ExperienceCounter({
  since,
  start,
  duration = 1.8,
}: ExperienceCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [inView, setInView] = useState(false)
  const [animYears, setAnimYears] = useState(0)
  const [animDone, setAnimDone] = useState(false)

  const sinceDate = useMemo(
    () => (since instanceof Date ? since : new Date(since)),
    [since]
  )

  // żywy zegar — aktualizowany co sekundę
  const [time, setTime] = useState(() => calcExperience(sinceDate, new Date()))

  useEffect(() => {
    const tick = () => setTime(calcExperience(sinceDate, new Date()))
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [sinceDate])

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
      { threshold: 0.6 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [start])

  const active = start ?? inView

  // animacja licznika lat
  useEffect(() => {
    if (!active) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setAnimYears(time.years)
      setAnimDone(true)
      return
    }
    let frame = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / (duration * 1000))
      setAnimYears(Math.round(easeOutCubic(t) * time.years))
      if (t < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        setAnimDone(true)
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, time.years, duration])

  return (
    <span ref={ref} className="experience-counter">
      <span aria-hidden="true">
        {animYears} lat
      </span>
      {animDone && (
        <span className="experience-clock" aria-hidden="true">
          <span className="experience-clock__unit">
            <span className="experience-clock__num">{pad(time.months)}</span>
            <span className="experience-clock__label">mies</span>
          </span>
          <span className="experience-clock__unit">
            <span className="experience-clock__num">{pad(time.days)}</span>
            <span className="experience-clock__label">dni</span>
          </span>
          <span className="experience-clock__unit">
            <span className="experience-clock__num">{pad(time.hours)}</span>
            <span className="experience-clock__label">godz</span>
          </span>
          <span className="experience-clock__unit">
            <span className="experience-clock__num">{pad(time.minutes)}</span>
            <span className="experience-clock__label">min</span>
          </span>
          <span className="experience-clock__unit">
            <span className="experience-clock__num">{pad(time.seconds)}</span>
            <span className="experience-clock__label">sek</span>
          </span>
        </span>
      )}
      <span className="visually-hidden">
        {time.years} lat, {time.months} miesięcy, {time.days} dni, {time.hours} godzin, {time.minutes} minut, {time.seconds} sekund
      </span>
    </span>
  )
}
