import Header from '../components/0_Header'
import Hero from '../components/1_Hero'
import About from '../components/2_About'
import Models from '../components/3_Models'
import Realizations from '../components/4_Realizations'
import Projects from '../components/5_Projects'
import Process from '../components/6_Process'
import Reviews from '../components/7_Reviews'
import Contact from '../components/Contact'
import Footer from '../components/10_Footer'
import { lazy, Suspense } from 'react'

// three.js ładowany osobno, żeby nie blokował pierwszego renderu
const BackgroundModel = lazy(() => import('../components/BackgroundModel'))

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
        <Models />
        <Projects />
        <Process />
        <Reviews />
        <Contact />
      </main>
      <Footer/>
    </>
  )
}
