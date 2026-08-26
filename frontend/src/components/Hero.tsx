
import StrokeText from './StrokeText';
import ScrollExpand from './ScrollExpand';
import './Hero.css'

export default function Hero() {
  return (
    <section id="top" className="hero">

      <ScrollExpand
        src="https://raw.githubusercontent.com/PafkoRoki/ARCHinLAND/main/frontend/public/images/osiedle-panorama.jpg"
        alt="Product hero"
        startRadius={0}
        scrollDistance={2}
        smoothing={0.0}
          title={
            <StrokeText
              text="ARCH in LAND"
              strokeColor="#2d2d2dbb"
              fillColor="#fff"
              strokeWidth={50}
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
      </ScrollExpand>

    </section>
  )
}