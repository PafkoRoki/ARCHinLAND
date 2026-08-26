import Header from '../components/Header'
import Hero from '../components/Hero'
import About from '../components/About'
import Projects from '../components/Projects'
import Process from '../components/Process'
import Manifesto from '../components/Manifesto'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <a href="#about" className="visually-hidden">
        Skip to content
      </a>
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <Process />
        <Manifesto />
      </main>
      <Footer />
    </>
  )
}
