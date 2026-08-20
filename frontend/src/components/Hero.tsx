import ImageGrid from './ImageGrid'
import StrokeText from './StrokeText';
import ScrollExpand from './ScrollExpand';
import './Hero.css'

export default function Hero() {
  return (
    <section id="top" className="hero">

      <ScrollExpand
        src="https://raw.githubusercontent.com/PafkoRoki/ARCHinLAND/main/frontend/public/images/osiedle-panorama.jpg"
        alt="Product hero"
          title={
            <StrokeText
              text="ARCH in LAND"
              strokeColor="#ff7600"
              fillColor="#fffffff0"
              strokeWidth={1.4}
              drawDuration={2.6}
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