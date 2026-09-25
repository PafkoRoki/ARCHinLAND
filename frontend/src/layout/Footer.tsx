"use client";

import { FaInstagram } from "react-icons/fa";
import { SiSketchfab } from "react-icons/si";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import RippleDistortion from "../components/RippleDistortion";

const cn = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

const Link = ({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a href={href} {...props}>
    {children}
  </a>
);

interface ShinyTextProps {
  text?: string;
  isShining?: boolean;
  speed?: number;
  className?: string;
  children?: React.ReactNode;
}

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  href: string;
  icon: React.ReactNode;
  ariaLabel: string;
}

interface FooterProps {
  socialLinks?: SocialLink[];
  links?: FooterLink[];
  companyDescription?: string;
  copyright?: {
    companyName?: string;
    year?: number;
    additionalText?: string;
  };
}

const ShinyText = ({
  text,
  children,
  isShining = false,
  speed = 1,
  className = ''
}: ShinyTextProps) => {
  const content = children || text;

  return (
    <div
      className={cn("text-inherit bg-clip-text inline-block transition-opacity", className)}
      style={{
        backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundPosition: isShining ? '-100%' : '110%',
        transition: isShining ? `background-position ${speed}s linear` : 'none',
      }}
    >
      {content}
    </div>
  );
};

const DecryptText = ({
  text,
  className,
  isDecrypting = false,
  duration = 0.1
}: {
  text: string;
  className?: string;
  isDecrypting?: boolean;
  duration?: number;
}) => {
  const [displayText, setDisplayText] = useState(text);
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?/";

  useEffect(() => {
    if (!isDecrypting) {
      setDisplayText(text);
      return;
    }

    let interval: NodeJS.Timeout | undefined;
    let iteration = 0;

    if (interval) {
      clearInterval(interval);
    }

    interval = setInterval(() => {
      setDisplayText(prev =>
        prev.split("").map((char, index) => {
          if (char === " ") return " ";

          if (index < iteration) return text[index];

          return characters[Math.floor(Math.random() * characters.length)];
        }).join("")
      );

      iteration += 1 / 3;

      if (iteration >= text.length) {
        if (interval) {
          clearInterval(interval);
        }
        setDisplayText(text);
      }
    }, duration * 1000 / text.length);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isDecrypting, text, duration]);

  return <span className={className}>{displayText}</span>;
};

const AnimatedLink = ({
  href,
  children,
  className
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const textContent = typeof children === 'string' ? children : '';

  return (
    <motion.div
      className="relative overflow-hidden"
      whileHover="hover"
      initial="initial"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="absolute inset-0 bg-white/10 z-0"
        variants={{
          initial: { x: "-100%" },
          hover: { x: 0 }
        }}
        transition={{ duration: 0.3 }}
      />
      <Link
        href={href}
        className={cn("z-10 relative h-full", className)}
      >
        {typeof children === 'string' ? (
          <ShinyText isShining={isHovered} speed={1}>
            <DecryptText text={textContent} isDecrypting={isHovered} />
          </ShinyText>
        ) : children}
      </Link>
    </motion.div>
  );
};

const AnimatedIconLink = ({
  href,
  icon,
  ariaLabel,
  className
}: {
  href: string;
  icon: React.ReactNode;
  ariaLabel: string;
  className?: string;
}) => {
  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      whileHover="hover"
      initial="initial"
    >
      <motion.div
        className="absolute inset-0 bg-white/10 z-0"
        variants={{
          initial: { x: "-100%" },
          hover: { x: 0 }
        }}
        transition={{ duration: 0.3 }}
      />
      <Link
        href={href}
        aria-label={ariaLabel}
        className="text-white hover:text-[var(--orange)] transition-colors z-10 relative"
      >
        {icon}
      </Link>
    </motion.div>
  );
};

export function Footer({
  socialLinks = [
    {
      href: "https://instagram.com",
      icon: <FaInstagram size={32} />,
      ariaLabel: "Instagram"
    },
    {
      href: "https://sketchfab.com/ARCHinLAND",
      icon: <SiSketchfab size={32} />,
      ariaLabel: "Sketchfab"
    }
  ],
  links = [
    { label: "Mail", href: "mailto:ARCHinLAND@wp.pl" },
    { label: "790 820 114", href: "tel:+48790820114" },
    { label: "Back to top", href: "#top" },
    { label: "Projekty", href: "#projects" }
  ],
  companyDescription = "ARCHITECTURE in LAND DEVELOPMENT",
  copyright = {
    companyName: "ARCHinLAND",
    year: new Date().getFullYear(),
    additionalText: "ARCHITECTURE in LAND DEVELOPMENT"
  }
}: FooterProps) {
  return (
  <footer className="w-full bg-[#2d2d2d] text-white relative z-50">
      <div className="w-full pb-8 min-[1250px]:pb-16">
        {/* szerokość jak w reszcie sekcji: --container i --gutter z globals.css */}
        <div className="container">
        <div className="grid grid-cols-1 min-[1250px]:grid-cols-12 min-[1250px]:grid-rows-2 border-t border-b border-[var(--border-inverse)]">

          <div className="flex min-[1250px]:hidden border-b border-[var(--border-inverse)]">
            {socialLinks.slice(0, 2).map((link, i) => (
              <AnimatedIconLink
                key={link.ariaLabel}
                href={link.href}
                icon={link.icon}
                ariaLabel={link.ariaLabel}
                className={cn(
                  "flex-1 aspect-square flex items-center justify-center",
                  i < socialLinks.length - 1 ? "border-r border-[var(--border-inverse)]" : ""
                )}
              />
            ))}
          </div>

          {socialLinks.slice(0, 2).map((link) => (
            <AnimatedIconLink
              key={link.ariaLabel}
              href={link.href}
              icon={link.icon}
              ariaLabel={link.ariaLabel}
              className="hidden min-[1250px]:flex min-[1250px]:col-span-1 min-[1250px]:row-span-1 border-r border-b border-[var(--border-inverse)] aspect-square items-center justify-center"
            />
          ))}

          <div className="h-40 min-[1250px]:h-auto min-[1250px]:col-span-8 min-[1250px]:row-span-1 border-b border-[var(--border-inverse)] min-[1250px]:border-r relative">
            <RippleDistortion
              src="/images/osiedle-panorama.jpg"
              brushSize={170}
              strength={0.16}
              swirl={0.9}
              rings={4}
              spread={5}
              fade={3.5}
              spacing={24}
              tint="#FE5000"
              tintAmount={0.1}
              grayscale
              trigger="both"
              quality="low"
              clickStrength={2}
              className="h-full w-full"
            />
          </div>

          <div className="grid grid-cols-2 min-[1250px]:hidden border-b border-[var(--border-inverse)]">
            {links.slice(0, 4).map((link, i) => (
              <AnimatedLink
                key={link.label}
                href={link.href}
                className={cn(
                  "aspect-square flex items-center justify-center text-sm text-white hover:text-[var(--orange)] transition-colors w-full",
                  i % 2 === 0 ? "border-r border-[var(--border-inverse)]" : "",
                  i < 2 ? "border-b border-[var(--border-inverse)]" : ""
                )}
              >
                {link.label}
              </AnimatedLink>
            ))}
          </div>

          {links.slice(0, 2).map((link, i) => (
            <AnimatedLink
              key={link.label}
              href={link.href}
              className={cn(
                "hidden min-[1250px]:flex min-[1250px]:col-span-1 min-[1250px]:row-span-1 border-b border-[var(--border-inverse)] aspect-square items-center justify-center text-sm text-white hover:text-[var(--orange)] transition-colors w-full",
                i === 0 ? "border-r border-[var(--border-inverse)]" : ""
              )}
            >
              {link.label}
            </AnimatedLink>
          ))}

          <div className="px-4 py-6 min-[1250px]:py-8 min-[1250px]:col-span-10 min-[1250px]:row-span-1 border-b min-[1250px]:border-b-0 min-[1250px]:border-r border-[var(--border-inverse)] text-xs text-white/70 leading-relaxed">
            <p>{companyDescription}</p>
          </div>

          {links.slice(2, 5).map((link, i) => (
            <AnimatedLink
              key={link.label}
              href={link.href}
              className={cn(
                "hidden min-[1250px]:flex min-[1250px]:col-span-1 min-[1250px]:row-span-1 aspect-square items-center justify-center text-sm text-white hover:text-[var(--orange)] transition-colors w-full",
                i < links.slice(2, 5).length - 1 ? "border-r border-[var(--border-inverse)]" : ""
              )}
            >
              {link.label}
            </AnimatedLink>
          ))}
        </div>

        <div className="py-6 min-[1250px]:py-8 text-center text-xs text-white/50">
          <p>{copyright.companyName} ©{copyright.year} All rights reserved</p>
          {copyright.additionalText && <p className="mt-2">{copyright.additionalText}</p>}
        </div>
        </div>
      </div>

    </footer>
  );
}

export default Footer;