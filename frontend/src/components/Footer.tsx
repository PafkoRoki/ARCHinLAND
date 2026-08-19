import './Footer.css'

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Email', href: 'mailto:andrzejkurka70@wp.pl' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <a href="#top" className="footer__wordmark">
          ARCHinLAND
        </a>

        <ul className="footer__socials">
          {SOCIALS.map((social) => (
            <li key={social.label}>
              <a href={social.href} target="_blank" rel="noreferrer">
                {social.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="footer__copyright">© {new Date().getFullYear()} ARCHinLAND. All rights reserved.</p>
      </div>
    </footer>
  )
}
