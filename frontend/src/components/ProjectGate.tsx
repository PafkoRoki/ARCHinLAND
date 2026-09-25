import { FormEvent, ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import { hasProjectAccess, unlockProjects } from '../lib/projectAccess'
import './ProjectGate.css'

type Props = {
  children: ReactNode
  // inline = formularz w sekcji Projekty na stronie głównej; domyślnie osobna strona (/projekty)
  inline?: boolean
}

// Katalog projektów widać dopiero po wpisaniu hasła (patrz lib/projectAccess.ts).
export default function ProjectGate({ children, inline = false }: Props) {
  const [unlocked, setUnlocked] = useState(hasProjectAccess)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)

  if (unlocked) return <>{children}</>

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setChecking(true)
    const ok = await unlockProjects(password)
    setChecking(false)
    if (ok) setUnlocked(true)
    else setError(true)
  }

  const inputId = inline ? 'project-password-inline' : 'project-password'
  const errorId = `${inputId}-error`
  // na stronie głównej h1 już jest (ARCHinLAND), a sekcja ma własne h2
  const Title = inline ? 'h3' : 'h1'
  const Wrapper = inline ? 'div' : 'main'

  return (
    <Wrapper className={`projectGate${inline ? ' projectGate--inline' : ''}`}>
      <form className="projectGate__box" onSubmit={onSubmit}>
        <span className="projectGate__eyebrow">PROJEKTY ARCHITEKTONICZNE</span>
        <Title className="projectGate__title">Katalog projektów</Title>
        <p>Katalog jest dostępny po podaniu hasła.</p>

        <label className="projectGate__label" htmlFor={inputId}>
          Hasło
        </label>
        <input
          id={inputId}
          className="projectGate__input"
          type="password"
          autoComplete="current-password"
          // w sekcji bez autofocusu — przewinąłby stronę główną do formularza
          autoFocus={!inline}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError(false)
          }}
          aria-invalid={error}
          aria-describedby={error ? errorId : undefined}
        />
        {error && (
          <p id={errorId} className="projectGate__error" role="alert">
            Nieprawidłowe hasło.
          </p>
        )}

        <div className="projectGate__actions">
          <button type="submit" className="btn" disabled={checking || !password}>
            Wejdź
          </button>
          {!inline && (
            <Link to="/" className="projectGate__back">
              ← Strona główna
            </Link>
          )}
        </div>
      </form>
    </Wrapper>
  )
}
