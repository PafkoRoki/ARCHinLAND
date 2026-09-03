import Header from '../components/0_Header'
import Hero from '../components/1_Hero'
import About from '../components/2_About'
import Models from '../components/3_Models'
import Projects from '../components/4_Projects'
import Process from '../components/5_Process'
import Reviews from '../components/6_Reviews'
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
        <Models />
        <Projects />
        <Process />
        <Reviews />
      </main>
      <Footer />
    </>
  )
}
