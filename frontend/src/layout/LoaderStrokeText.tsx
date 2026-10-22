import { useLayoutEffect, useRef, useState, useMemo, CSSProperties } from 'react'

interface LoaderStrokeTextProps {
  text: string
  progress: number // 0-1
  strokeColor?: string
  fillColor?: string
  strokeWidth?: number
  fontSize?: number
  fontWeight?: number
}

export default function LoaderStrokeText({
  text,
  progress,
  strokeColor = '#ffffff',
  fillColor = '#ffffff',
  strokeWidth = 2,
  fontSize = 64,
  fontWeight = 800,
}: LoaderStrokeTextProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const textRef = useRef<SVGTextElement>(null)
  const [pathLength, setPathLength] = useState(1000)
  const [viewBox, setViewBox] = useState('0 0 100 100')

  const fontStyle = useMemo<CSSProperties>(
    () => ({
      fontFamily: "'Inter Tight Variable', 'Inter Tight', Arial, sans-serif",
      fontSize: `${fontSize}px`,
      fontWeight,
      letterSpacing: '-0.03em',
    }),
    [fontSize, fontWeight]
  )

  // Zmierz tekst i ustaw viewBox
  useLayoutEffect(() => {
    const textEl = textRef.current
    if (!textEl) return

    // Poczekaj na załadowanie fontu
    const measure = () => {
      try {
        const bbox = textEl.getBBox()
        if (bbox.width > 0) {
          const pad = strokeWidth * 2
          setViewBox(`${bbox.x - pad} ${bbox.y - pad} ${bbox.width + pad * 2} ${bbox.height + pad * 2}`)
          // Oszacuj długość ścieżki (dla strokeDashoffset)
          setPathLength(bbox.width * 3)
        }
      } catch {}
    }

    measure()
    document.fonts?.ready?.then(measure)
  }, [text, fontSize, fontWeight, strokeWidth])

  // Oblicz strokeDashoffset na podstawie progress
  const dashOffset = pathLength * (1 - progress)
  const fillOpacity = progress >= 1 ? 1 : 0

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      className="loader-stroke-text"
      aria-hidden="true"
    >
      {/* Stroke - rysuje się proporcjonalnie do progress */}
      <text
        ref={textRef}
        x="0"
        y="0"
        dominantBaseline="central"
        textAnchor="start"
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
        style={{
          ...fontStyle,
          transition: 'stroke-dashoffset 0.3s ease-out',
        }}
      >
        {text}
      </text>

      {/* Fill - pojawia się gdy progress = 100% */}
      <text
        x="0"
        y="0"
        dominantBaseline="central"
        textAnchor="start"
        fill={fillColor}
        stroke="none"
        style={{
          ...fontStyle,
          opacity: fillOpacity,
          transition: 'opacity 0.4s ease-out',
        }}
      >
        {text}
      </text>
    </svg>
  )
}
