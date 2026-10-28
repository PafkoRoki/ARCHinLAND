import { ReactNode } from 'react'

type Props = {
  index: string // "01" — kolejność sekcji (niewyświetlana)
  label: string // "Realizacje"
  id?: string // id nazwy sekcji, do aria-labelledby
  aside?: ReactNode // treść po prawej, np. ocena Google
}

// Nagłówek sekcji: widoczna nazwa (h2) i ewentualna treść `aside` po prawej — wygląd w globals.css (.section-head).
export default function SectionHeader({ label, id, aside }: Props) {
  return (
    <div className="section-head">
      <h2 id={id} className="section-head__title">
        {label}
      </h2>
      {aside && <div className="section-head__aside">{aside}</div>}
    </div>
  )
}
