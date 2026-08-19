import ImageGrid from './ImageGrid'
import StrokeText from './StrokeText';
import ScrollExpand from './ScrollExpand';
import './Hero.css'

export default function Hero() {
  return (
    <section id="top" className="hero">


<ScrollExpand
  src="/hero.jpg"
  alt="Product hero"
  title="Built to scale"
  scrollHint="Scroll inside the frame"
  useWindowScroll
>
  <h2>Every pixel, everywhere</h2>
  <p>The frame opens up as you scroll and hands the whole stage to your media.</p>
</ScrollExpand>

<div style={{ height: '520px' }}>
  <ScrollExpand src="/hero.jpg" title="Built to scale" 
  startWidth={42}
  startHeight={58}
  startRadius={24}
  endRadius={0}
  mediaZoom={1.35}
  scrollDistance={1.2}
  holdDistance={0.35}
  smoothing={0.1}
  overlayScrim={0.45}
  enabled
/>
</div>

      <div className="container">
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
      </div>

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
