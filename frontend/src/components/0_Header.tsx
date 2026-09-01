import StaggeredMenu from './StaggeredMenu'
import './0_Header.css'
import logoUrl from '../assets/logo.svg'

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home section', link: '#top' },
  { label: 'About', ariaLabel: 'Go to about section', link: '#about' },
  { label: 'Projects', ariaLabel: 'Go to projects section', link: '#projects' },
  { label: 'Process', ariaLabel: 'Go to process section', link: '#process' },
  { label: '____________', ariaLabel: '___', link: '#' },
  { label: 'Kontakt', ariaLabel: 'Go to contact section', link: '#contact' },
  { label: "790 820 114", ariaLabel: "Call me",  link: "tel:+48790820114" },
  { label: "534 498 293", ariaLabel: "Call me",  link: "tel:+48534498293" }
]

const socialItems = [
  { label: 'Instagram', link: 'https://instagram.com' },
  { label: 'Sketchfab', link: 'https://sketchfab.com/ARCHinLAND' }
]

function Header() {
  return (

        <div style={{ height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 1000, pointerEvents: 'none'}}>
          <StaggeredMenu
            position="right"
            items={menuItems}
            socialItems={socialItems}
            displaySocials={true}
            displayItemNumbering={true}
            menuButtonColor="#2d2d2d"
            openMenuButtonColor="#FE5000"
            changeMenuColorOnOpen={true}
            colors={["#f0f0f0", "#f0f0f0", "#FE5000"]}
            logoUrl={logoUrl}
            accentColor="#FE5000"
          />
        </div>
  )
}

export default Header