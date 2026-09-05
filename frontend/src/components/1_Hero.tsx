
import StrokeText from './StrokeText';
import ScrollExpand from './ScrollExpand';
import panorama from "../assets/osiedle-panorama.jpg";
import './1_Hero.css'

export default function Hero() {
  return (
    <section id="top" className="hero">

      <ScrollExpand
        src={panorama}
        alt="Osiedle mieszkaniowe zaprojektowane przez pracownię ARCHinLAND w Kamieniu Pomorskim — widok panoramiczny"
        startRadius={0}
        scrollDistance={2}
        smoothing={0.0}
        overlayScrim={0.7}
          title={
            <h1 className="hero__h1">
              <StrokeText
                text="ARCH in LAND"
                strokeColor="#2d2d2dbb"
                fillColor="#ffffff"
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
                showButton={true}
                buttonText="790 820 114"
                buttonHref="#contact"
              />
              <span className="visually-hidden">
                ARCHinLAND — biuro architektoniczne Andrzej Kurka, Kamień Pomorski
              </span>
            </h1>
          }
        scrollHint="Scroll inside the frame"
        useWindowScroll
      >
      </ScrollExpand>

    </section>
  )
}