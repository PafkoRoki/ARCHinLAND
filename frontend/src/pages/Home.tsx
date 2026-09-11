import Header from '../components/0_Header'
import Hero from '../components/1_Hero'
import About from '../components/2_About'
import Models from '../components/3_Models'
import Realizations from '../components/4_Realizations'
import Projects from '../components/5_Projects'
import Reviews from '../components/7_Reviews'
import Footer from '../components/10_Footer'

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
        <Realizations />
        <Models />
        <Projects /> 
        <Reviews />
      </main>
      <Footer/>
    </>
  )
}
