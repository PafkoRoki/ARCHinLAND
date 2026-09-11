
import x1 from '../assets/Projects/1.jpg';
import x2 from '../assets/Projects/2.jpg';
import x3 from '../assets/Projects/3.jpg';
import x4 from '../assets/Projects/4.jpg';
import MagicBento from './MagicBento'
import DepthCarousel from './DepthCarousel';
import "./2_About.css";

const items = [
  {
    image: x1,
    caption: 'ARCHITECTURE in LAND DEVELOPMENT'
  },
  {
    image: x2,
    caption: "Biuro prowadzone przez Andrzeja Kurkę",
  },
  {
    image: x3,
    caption: 'Od 30 lat łączymy projektowanie architektoniczne z wiedzą techniczną'
  },
  {
    image: x4,
    caption: '˚ ✶ ⋆｡˚ ➷'
  }
];

const About = () => {
  return (
    <section className="about" id="about" aria-labelledby="about-heading">
    <div className="container">

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
  );
};

export default About;
