
import MagicBento from './MagicBento'
import "./2_About.css";


const About = () => {
  return (
    <section className="about" id="about" aria-labelledby="about-heading" style={{ paddingTop: '5rem' }}>
    <div className="container">
<div>
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
    </div>
    </section>
  );
};

export default About;
