import Header from '../layout/Header'
import Hero from '../sections/Hero'
import Realizations from '../sections/Realizations'
import Projects from '../sections/Projects'
import Process from '../sections/Process'
import Reviews from '../sections/Reviews'
import Contact from '../sections/Contact'
import Footer from '../layout/Footer'
import { lazy, Suspense, useEffect } from 'react'

// three.js ładowany osobno, żeby nie blokował pierwszego renderu
const BackgroundModel = lazy(() => import('../sections/BackgroundModel'))

export default function Home() {
  // adres z sekcją (np. /#realizations): przeglądarka próbuje przewinąć, zanim React zbuduje stronę,
  // więc po wyrenderowaniu przewijamy do sekcji sami (bez płynnej animacji)
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior })
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <>
      <a href="#about" className="visually-hidden">
        Skip to content
      </a>
      <Suspense fallback={null}>
        <BackgroundModel />
      </Suspense>
      <Header />
      <main className="page-content">
        <Hero />
        <Realizations />
        <Projects />
        <Process />
        <Reviews />
        <Contact />
      </main>
      <Footer/>
    </>
  )
}
