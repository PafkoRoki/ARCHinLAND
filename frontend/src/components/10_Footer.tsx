"use client";

import { FaInstagram } from "react-icons/fa";
import { SiSketchfab } from "react-icons/si";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import RippleDistortion from "./RippleDistortion";

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
  heading?: {
    line1?: string;
    line2?: string;
    line3?: string;
  };
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
        className="text-white hover:text-white/70 transition-colors z-10 relative"
      >
        {icon}
      </Link>
    </motion.div>
  );
};

export function Footer({
  heading = {
    
  },
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
    { label: "Biuro", href: "/link3" },
    { label: "Modele 3D", href: "/link4" },
    { label: "Realizacje", href: "/link5" }
  ],
  companyDescription = "ARCHITECTURE in LAND DEVELOPMENT tel. 790 820 114",
  copyright = {
    companyName: "Company Name",
    year: new Date().getFullYear(),
    additionalText: "Optional additional text"
  }
}: FooterProps) {
  return (
  <footer className="w-full bg-[#2d2d2d] text-white relative z-50">
      <div className="w-full py-8 min-[1250px]:py-16">
        <div className="text-center mb-8 min-[1250px]:mb-16">
          <h2 className="text-4xl min-[1250px]:text-7xl font-light leading-tight">
            {heading.line1}<br />
            {heading.line2}<br />
            {heading.line3}
          </h2>
        </div>

        <div className="grid grid-cols-1 min-[1250px]:grid-cols-12 min-[1250px]:grid-rows-2 border-t border-b border-white/20">

          <div className="flex min-[1250px]:hidden border-b border-white/20">
            {socialLinks.slice(0, 2).map((link, i) => (
              <AnimatedIconLink
                key={link.ariaLabel}
                href={link.href}
                icon={link.icon}
                ariaLabel={link.ariaLabel}
                className={cn(
                  "flex-1 py-6 flex items-center justify-center",
                  i < socialLinks.length - 1 ? "border-r border-white/20" : ""
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
              className="hidden min-[1250px]:flex min-[1250px]:col-span-1 min-[1250px]:row-span-1 border-r border-b border-white/20 py-8 items-center justify-center"
            />
          ))}

          <div className="h-40 min-[1250px]:h-40 min-[1250px]:col-span-8 min-[1250px]:row-span-1 border-b border-white/20 min-[1250px]:border-r relative">
            <RippleDistortion
              src="/images/osiedle-panorama.jpg"
              brushSize={180}
              strength={0.28}
              swirl={1.2}
              rings={5}
              spread={6}
              fade={3}
              spacing={18}
              tint="#FE5000"
              tintAmount={0.35}
              grayscale
              trigger="both"
              quality="medium"
              className="h-full w-full"
            />
          </div>

          <div className="grid grid-cols-2 min-[1250px]:hidden border-b border-white/20">
            {links.slice(0, 4).map((link, i) => (
              <AnimatedLink
                key={link.label}
                href={link.href}
                className={cn(
                  "py-6 flex items-center justify-center text-sm text-white hover:text-white/70 transition-colors w-full",
                  i % 2 === 0 ? "border-r border-white/20" : "",
                  i < 2 ? "border-b border-white/20" : ""
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
                "hidden min-[1250px]:flex min-[1250px]:col-span-1 min-[1250px]:row-span-1 border-b border-white/20 py-8 items-center justify-center text-sm text-white hover:text-white/70 transition-colors w-full",
                i === 0 ? "border-r border-white/20" : ""
              )}
            >
              {link.label}
            </AnimatedLink>
          ))}

          <div className="px-4 py-6 min-[1250px]:py-8 min-[1250px]:col-span-9 min-[1250px]:row-span-1 border-b min-[1250px]:border-b-0 min-[1250px]:border-r border-white/20 text-xs text-white/70 leading-relaxed">
            <p>{companyDescription}</p>
          </div>

          {links.slice(2, 5).map((link, i) => (
            <AnimatedLink
              key={link.label}
              href={link.href}
              className={cn(
                "hidden min-[1250px]:flex min-[1250px]:col-span-1 min-[1250px]:row-span-1 py-8 items-center justify-center text-sm text-white hover:text-white/70 transition-colors w-full",
                i < 2 ? "border-r border-white/20" : ""
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
    </footer>
  );
}

export default Footer;