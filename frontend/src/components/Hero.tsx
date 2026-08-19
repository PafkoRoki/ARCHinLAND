import ImageGrid from './ImageGrid'
import StrokeText from './StrokeText';
import ScrollExpand from './ScrollExpand';
import './Hero.css'

export default function Hero() {
  return (
    <section id="top" className="hero">

      <ScrollExpand
        src="/images/budynek-uslugowo-mieszkalny.jpg"
        alt="Product hero"
          title={
            <StrokeText
              text="ARCH in LAND"
              strokeColor="#2d2d2d"
              fillColor="#2d2d2d"
              strokeWidth={1}
              drawDuration={1.6}
              fillDelay={0.2}
              stagger={0.095}
              ease="power2.out"
              trigger="mount"
              fillMode="wipe"
              fontSize={150}
              fontWeight={900}
              letterSpacing={-5}
              reverse={false}
            />
          }
        scrollHint="Scroll inside the frame"
        useWindowScroll
      >
        <h2>OD 30 LAT</h2>
        <p>TWORZYMY ARCHITEKTURE</p>
      </ScrollExpand>


      <div className="container hero__composition">
        <ImageGrid />
      </div>

      <div className="container hero__scroll">
        <span>Scroll</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </div>
    </section>
  )
}