"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./Footer.css";

gsap.registerPlugin(ScrollTrigger);

const links = [
  ["O NAS", "#about"],
  ["REALIZACJE", "#projects"],
  ["PROCES", "#process"],
  ["KONTAKT", "#contact"],
];

const socials = [
  { label: "INSTAGRAM", href: "https://instagram.com" },
  { label: "LINKEDIN", href: "https://linkedin.com" },
  { label: "EMAIL", href: "mailto:andrzejkurka70@wp.pl" },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const title = titleRef.current;
    const linksContainer = linksRef.current;

    if (!footer || !title || !linksContainer) return;

    const ctx = gsap.context(() => {
      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      gsap.fromTo(
        title,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: footer,
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        linksContainer.querySelectorAll(".footer__link"),
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: linksContainer,
            start: "top 90%",
            once: true,
          },
        }
      );
    }, footer);

    return () => ctx.revert();
  }, []);

  return (
    <footer id="contact" ref={footerRef} className="footer">
      <div className="footer__frame">
        <div className="footer__top">
          <div className="footer__brand">
            <h2>
              <span>
                ARCH
                <br />
              </span>
              <span>
                in
                <br />
              </span>
              <span>
                LAND
                <br />
              </span>
            </h2>

            <p>KAMIEŃ POMORSKI</p>
          </div>

          <div className="footer__column" ref={linksRef}>
            <h3>Nawigacja</h3>

            <nav className="footer__nav" aria-label="Nawigacja">
              {links.map(([label, href]) => (
                <a key={label} href={href} className="footer__link">
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div className="footer__column footer__contact">
            <h3>Kontakt</h3>

            <nav className="footer__nav" aria-label="Social media">
              {socials.map((social) => (
                <a key={social.label} href={social.href} className="footer__link">
                  {social.label}
                </a>
              ))}
            </nav>

            <form
              className="footer__email"
              onSubmit={(event) => event.preventDefault()}
            >
              <label htmlFor="footer-email">E-MAIL</label>

              <div className="footer__email-row">
                <input
                  id="footer-email"
                  type="email"
                  placeholder="Twój adres e-mail"
                  required
                />
                <button type="submit">WYŚLIJ ↗</button>
              </div>
            </form>
          </div>
        </div>

        <div className="footer__hero">
          <h2 ref={titleRef}>ARCHinLAND</h2>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()}</span>
          <span>WSZELKIE PRAWA ZASTRZEŻONE</span>
          <a href="#top">BACK UP ↑</a>
        </div>
      </div>
    </footer>
  );
}
