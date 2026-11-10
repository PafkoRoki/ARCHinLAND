import { CSSProperties, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'

// Napis wypełniany od dołu "cieczą" z falującą powierzchnią — poziom = postęp wczytywania (0–1).
// Wyszarzony napis w tle, na nim biała fala przycięta do kształtu liter (clipPath z <text>).

interface Props {
  text: string
  progress: number // 0–1
  fontWeight?: number
}

const FONT_SIZE = 200 // jednostki SVG; rzeczywisty rozmiar ustala szerokość .app-loader__brand
// wysokość wielkich liter Inter Tight (0.727 em) + zapas na kropkę nad "i"; napis stoi na linii bazowej y = 0
const CAP = FONT_SIZE * 0.76
const PAD = FONT_SIZE * 0.02

interface Box {
  x: number
  y: number
  width: number
  height: number
}

/** Fala od x0 do x1 na wysokości 0, wypełniona w dół do `depth` (ścieżka powtarzalna co `length`). */
function wavePath(x0: number, x1: number, length: number, amp: number, depth: number) {
  let d = `M ${x0} 0`
  for (let x = x0; x < x1; x += length) {
    d += ` q ${length / 4} ${-amp} ${length / 2} 0 t ${length / 2} 0`
  }
  return `${d} V ${depth} H ${x0} Z`
}

export default function LoaderLiquidText({ text, progress, fontWeight = 900 }: Props) {
  const textRef = useRef<SVGTextElement>(null)
  const [box, setBox] = useState<Box | null>(null)
  const clipId = useId().replace(/:/g, '')

  const fontStyle = useMemo<CSSProperties>(
    () => ({
      fontFamily: "'Inter Tight Variable', 'Inter Tight', Arial, sans-serif",
      fontSize: `${FONT_SIZE}px`,
      fontWeight,
      letterSpacing: '-0.04em',
    }),
    [fontWeight],
  )

  // zmierz napis (po wczytaniu kroju jeszcze raz) i dopasuj viewBox
  useLayoutEffect(() => {
    const el = textRef.current
    if (!el) return
    const measure = () => {
      try {
        const b = el.getBBox()
        if (b.width > 0) setBox({ x: b.x, y: b.y, width: b.width, height: b.height })
      } catch {
        /* SVG jeszcze niewyrenderowane */
      }
    }
    measure()
    document.fonts?.ready?.then(measure)
  }, [text, fontWeight])

  // pionowo liczymy tylko wielkie litery (bez pustego miejsca na wydłużenia dolne/górne w linii tekstu)
  const h = CAP
  const length = h * 1.1 // długość fali
  const amp = h * 0.09 // wysokość fali
  const top = -CAP
  const bottom = 0
  // poziom cieczy: od podstawy liter (0) do ponad ich górę (1) — z zapasem na grzbiet fali
  const p = Math.min(1, Math.max(0, progress))
  // przy 0 grzbiet fali jest pod literami, przy 1 dolina fali nad nimi
  const level = bottom + amp - p * (bottom - top + amp * 2)
  const x0 = (box?.x ?? 0) - length * 2
  const x1 = (box ? box.x + box.width : 1000) + length * 2
  const depth = h * 2

  const viewBox = box
    ? `${box.x - PAD} ${-CAP - PAD} ${box.width + PAD * 2} ${CAP + PAD * 2}`
    : `0 ${-CAP - PAD} 1000 ${CAP + PAD * 2}`

  const textProps = {
    x: 0,
    y: 0,
    style: fontStyle,
  }

  return (
    <svg viewBox={viewBox} className="loader-liquid-text" aria-hidden="true" overflow="hidden">
      <defs>
        <clipPath id={clipId}>
          <text {...textProps}>{text}</text>
        </clipPath>
      </defs>

      {/* napis w tle — wyszarzony */}
      <text ref={textRef} {...textProps} fill="rgba(255, 255, 255, 0.16)">
        {text}
      </text>

      {/* ciecz: dwie fale przesunięte względem siebie, przycięte do liter */}
      <g clipPath={`url(#${clipId})`}>
        <g className="loader-liquid-text__level" style={{ transform: `translateY(${level}px)` }}>
          <path
            className="loader-liquid-text__wave loader-liquid-text__wave--back"
            d={wavePath(x0, x1, length, amp, depth)}
            fill="rgba(255, 255, 255, 0.45)"
            style={{ '--wave-length': `${length}px` } as CSSProperties}
          />
          <path
            className="loader-liquid-text__wave"
            d={wavePath(x0, x1, length, amp * 0.8, depth)}
            fill="#ffffff"
            style={{ '--wave-length': `${length}px` } as CSSProperties}
          />
        </g>
      </g>
    </svg>
  )
}
