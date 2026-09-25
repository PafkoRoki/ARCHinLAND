import Header from '../layout/Header'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Realizations from '../sections/Realizations'
import Projects from '../sections/Projects'
import Process from '../sections/Process'
import Reviews from '../sections/Reviews'
import Contact from '../sections/Contact'
import Footer from '../layout/Footer'
import { lazy, Suspense } from 'react'

// three.js ładowany osobno, żeby nie blokował pierwszego renderu
const BackgroundModel = lazy(() => import('../sections/BackgroundModel'))

export default function Home() {
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
        <About />
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
