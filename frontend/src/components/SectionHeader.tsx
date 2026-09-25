import { ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

type Props = {
  index: string // "01" — kolejność sekcji (obecnie niewyświetlana)
  label: string // "Realizacje"
  id?: string // id nazwy sekcji, do aria-labelledby
  aside?: ReactNode // treść po prawej, np. ocena Google
}

// Nagłówek sekcji: nazwa tylko dla czytników ekranu i wyszukiwarek (bez widocznej tabliczki).
// Widoczna jest jedynie ewentualna treść `aside` — wygląd w globals.css (.section-head).
export default function SectionHeader({ label, id, aside }: Props) {
  const ref = useReveal<HTMLDivElement>()

  const title = (
    <h2 id={id} className="visually-hidden">
      {label}
    </h2>
  )

  if (!aside) return title

  return (
    <div ref={ref} className="section-head reveal">
      {title}
      <div className="section-head__aside">{aside}</div>
    </div>
  )
}
