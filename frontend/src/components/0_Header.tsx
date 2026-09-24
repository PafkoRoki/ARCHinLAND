import StaggeredMenu from './StaggeredMenu'
import './0_Header.css'
import logoUrl from '../assets/logo.svg'

const menuItems = [
  { label: '˚ ✶ ⋆｡˚ ➷', ariaLabel: 'Go to about section', link: '#about' },
  { label: 'Projekty', ariaLabel: 'Go to projects section', link: '#projects' },
  { label: 'Modele 3D', ariaLabel: 'Go to 3D models section', link: '#models' },
  { label: 'Kontakt', ariaLabel: 'Go to contact section', link: '#contact' },
  { label: "790 820 114", ariaLabel: "Call me",  link: "tel:+48790820114" }
]

const socialItems = [
  { label: 'Instagram', link: 'https://instagram.com' },
  { label: 'Sketchfab', link: 'https://sketchfab.com/ARCHinLAND' },
  { label: "ARCHinLAND@wp.pl", ariaLabel: "Email me",  link: "mailto:ARCHinLAND@wp.pl" }
]

function Header() {
  return (

        <div style={{ height: '100svh', width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 1000, pointerEvents: 'none'}}>
          <StaggeredMenu
            position="right"
            items={menuItems}
            socialItems={socialItems}
            displaySocials={true}
            displayItemNumbering={true}
            menuButtonColor="var(--color-text)"
            openMenuButtonColor="var(--orange)"
            changeMenuColorOnOpen={true}
            colors={["#f0f0f0", "#f0f0f0", "var(--orange)"]}
            logoUrl={logoUrl}
            accentColor="var(--orange)"
          />
        </div>
  )
}

export default Header