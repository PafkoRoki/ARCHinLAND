import StaggeredMenu from './StaggeredMenu'
import './Header.css'

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home section', link: '#top' },
  { label: 'About', ariaLabel: 'Go to about section', link: '#about' },
  { label: 'Projects', ariaLabel: 'Go to projects section', link: '#projects' },
  { label: 'Process', ariaLabel: 'Go to process section', link: '#process' },
  { label: 'Contact', ariaLabel: 'Go to contact section', link: '#contact' }
]

const socialItems = [
  { label: 'Instagram', link: 'https://instagram.com' }
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
            openMenuButtonColor="#ff8709"
            changeMenuColorOnOpen={true}
            colors={["#f0f0f0", "#f0f0f0", "#ff8709"]}
            accentColor="#ff8709"
          />
        </div>
  )
}

export default Header