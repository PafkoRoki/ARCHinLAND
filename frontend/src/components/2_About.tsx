import MagicBento from './MagicBento'
import SectionHeader from './SectionHeader'
import './2_About.css'

const About = () => {
  return (
    <section className="section about" id="about" aria-labelledby="about-heading">
      <div className="container">
        <SectionHeader
          index="01"
          label="O nas"
          id="about-heading"
          title={<>Architecture<br />in land development</>}
        />
        <MagicBento
          textAutoHide={true}
          enableStars={false}
          enableSpotlight
          enableBorderGlow={false}
          enableTilt
          enableMagnetism
          clickEffect={false}
          spotlightRadius={800}
          particleCount={12}
          glowColor="254, 80, 0"
          disableAnimations={false}
        />
      </div>
    </section>
  )
}

export default About
