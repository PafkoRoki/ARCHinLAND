import { PointerEvent, useRef } from 'react'
import MagicBento from './MagicBento'
import SectionHeader from './SectionHeader'
import { modelControls } from '../lib/modelControls'
import './2_About.css'

const DRAG_SPEED = 0.008 // radiany na piksel przeciągnięcia

const About = () => {
  const lastX = useRef<number | null>(null)

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    lastX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (lastX.current === null) return
    modelControls.dragRotation += (e.clientX - lastX.current) * DRAG_SPEED
    lastX.current = e.clientX
  }
  const onUp = () => {
    lastX.current = null
  }

  return (
    <section className="section about" id="about" aria-labelledby="about-heading">
      <div className="container">
        <SectionHeader
          index="01"
          label="O nas"
          id="about-heading"
        />

        {/* puste pole nad modelem 3D z tła — tu można go obracać myszką */}
        <div
          id="about-stage"
          className="about__stage"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <span className="label about__hint">Przeciągnij, aby obrócić model</span>
        </div>

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
