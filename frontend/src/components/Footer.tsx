import './Footer.css'

const NAV = [
  { label: 'Home', href: '#top' },
  { label: 'Work', href: '#work' },
]

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
]

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer__grid-bg" aria-hidden="true" />

      <div className="container footer__cta">
        <p className="eyebrow footer__eyebrow">
          <span className="footer__dot" />
          Let&apos;s talk
        </p>

        <div className="footer__cta-row">
          <h2 className="display footer__heading">
            Got a site
            <br />
            worth <span className="text-orange">building</span> on?
          </h2>

          <a href="mailto:archinland@wp.pl" className="btn-outline footer__cta-btn">
            Start a project <span className="plus">+</span>
          </a>
        </div>
      </div>

      <div className="container footer__cols">
        <div className="footer__col">
          <p className="footer__col-title">Index</p>
          <ul className="footer__list">
            {NAV.map((item) => (
              <li key={item.label}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <p className="footer__col-title">Elsewhere</p>
          <ul className="footer__list">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a href={social.href} target="_blank" rel="noreferrer">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col footer__col--wide">
          <p className="footer__col-title">Studio</p>
          <p className="footer__address">Kamień Pomorski, Poland</p>
          <a href="mailto:archinland@wp.pl" className="footer__email">
            archinland@wp.pl
          </a>
        </div>
      </div>

      <div className="container footer__base">
        <a href="#top" className="footer__wordmark display">
          ARCHinLAND
        </a>

        <div className="footer__base-meta">
          <p className="footer__copyright">© {new Date().getFullYear()} ARCHinLAND. All rights reserved.</p>
          <a href="#top" className="footer__totop">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
