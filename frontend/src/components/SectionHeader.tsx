import { ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

type Props = {
  index: string // "01"
  label: string // "Realizacje"
  title: ReactNode
  lead?: ReactNode
  id?: string // id tytułu, do aria-labelledby sekcji
  aside?: ReactNode // treść po prawej, np. ocena Google
}

// Wspólny nagłówek każdej sekcji — wygląd w globals.css (.section-head)
export default function SectionHeader({ index, label, title, lead, id, aside }: Props) {
  const ref = useReveal<HTMLDivElement>()

  return (
    <div ref={ref} className="section-head reveal">
      <div className="section-head__main">
        <span className="eyebrow">
          <span className="eyebrow__index">{index}</span> / {label}
        </span>
        <h2 id={id} className="section-head__title display stroke-title">
          {title}
        </h2>
        {lead && <p className="section-head__lead body-lg">{lead}</p>}
      </div>
      {aside && <div className="section-head__aside">{aside}</div>}
    </div>
  )
}
