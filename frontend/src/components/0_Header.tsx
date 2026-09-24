import StaggeredMenu from './StaggeredMenu'
import './0_Header.css'

// kolejność = kolejność sekcji na stronie, numeracja 01–07 zgadza się z SectionHeader
const menuItems = [
  { label: 'O nas', ariaLabel: 'Przejdź do sekcji O nas', link: '#about' },
  { label: 'Realizacje', ariaLabel: 'Przejdź do realizacji', link: '#realizations' },
  { label: 'Modele 3D', ariaLabel: 'Przejdź do modeli 3D', link: '#models' },
  { label: 'Projekty', ariaLabel: 'Przejdź do katalogu projektów', link: '#projects' },
  { label: 'Proces', ariaLabel: 'Przejdź do sekcji Proces', link: '#process' },
  { label: 'Opinie', ariaLabel: 'Przejdź do opinii klientów', link: '#reviews' },
  { label: 'Kontakt', ariaLabel: 'Przejdź do kontaktu', link: '#contact' },
]

const socialItems = [
  { label: '790 820 114', link: 'tel:+48790820114' },
  { label: 'ARCHinLAND@wp.pl', link: 'mailto:ARCHinLAND@wp.pl' },
  { label: 'Instagram', link: 'https://instagram.com' },
  { label: 'Sketchfab', link: 'https://sketchfab.com/ARCHinLAND' },
]

export default function Header() {
  return (
    <div className="site-header">
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        socialsTitle="Kontakt"
        displaySocials
        displayItemNumbering
        menuButtonColor="#2d2d2d"
        openMenuButtonColor="#FE5000"
        changeMenuColorOnOpen
        colors={['var(--bg-alt)', 'var(--orange)']}
        accentColor="var(--orange)"
      />
    </div>
  )
}
