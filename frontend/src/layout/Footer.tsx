"use client";

import { FaInstagram } from "react-icons/fa";
import { SiSketchfab } from "react-icons/si";
import { FiArrowUp, FiHome, FiMail, FiPhone } from "react-icons/fi";
import React from "react";
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

interface FooterLink {
  label: string; // napis widoczny po najechaniu
  href: string;
  icon: React.ReactNode;
}

interface SocialLink {
  href: string;
  icon: React.ReactNode;
  ariaLabel: string; // także napis widoczny po najechaniu
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

// Komórka stopki: ikona, a po najechaniu (lub fokusie) napis w jej miejscu
const AnimatedIconLink = ({
  href,
  icon,
  label,
  className
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
}) => {
  const external = href.startsWith("http");
  return (
    <motion.div
      className={cn("group relative overflow-hidden", className)}
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
        aria-label={label}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="absolute inset-0 z-10 flex items-center justify-center text-white outline-offset-[-2px]"
      >
        <span className="transition duration-300 ease-out group-hover:-translate-y-3 group-hover:opacity-0 group-focus-within:-translate-y-3 group-focus-within:opacity-0">
          {icon}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-x-2 text-center text-sm text-[var(--orange)] translate-y-3 opacity-0 transition duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
        >
          {label}
        </span>
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
    { label: "E-mail", href: "mailto:ARCHinLAND@wp.pl", icon: <FiMail size={28} /> },
    { label: "790 820 114", href: "tel:+48790820114", icon: <FiPhone size={28} /> },
    { label: "Do góry", href: "#top", icon: <FiArrowUp size={28} /> },
    { label: "Projekty", href: "#projects", icon: <FiHome size={28} /> }
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
                label={link.ariaLabel}
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
              label={link.ariaLabel}
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
              <AnimatedIconLink
                key={link.label}
                href={link.href}
                icon={link.icon}
                label={link.label}
                className={cn(
                  "aspect-square flex items-center justify-center",
                  i % 2 === 0 ? "border-r border-[var(--border-inverse)]" : "",
                  i < 2 ? "border-b border-[var(--border-inverse)]" : ""
                )}
              />
            ))}
          </div>

          {links.slice(0, 2).map((link, i) => (
            <AnimatedIconLink
              key={link.label}
              href={link.href}
              icon={link.icon}
              label={link.label}
              className={cn(
                "hidden min-[1250px]:flex min-[1250px]:col-span-1 min-[1250px]:row-span-1 border-b border-[var(--border-inverse)] aspect-square items-center justify-center",
                i === 0 ? "border-r border-[var(--border-inverse)]" : ""
              )}
            />
          ))}

          <div className="px-4 py-6 min-[1250px]:py-8 min-[1250px]:col-span-10 min-[1250px]:row-span-1 border-b min-[1250px]:border-b-0 min-[1250px]:border-r border-[var(--border-inverse)] text-xs text-white/70 leading-relaxed">
            <p>{companyDescription}</p>
          </div>

          {links.slice(2, 5).map((link, i) => (
            <AnimatedIconLink
              key={link.label}
              href={link.href}
              icon={link.icon}
              label={link.label}
              className={cn(
                "hidden min-[1250px]:flex min-[1250px]:col-span-1 min-[1250px]:row-span-1 aspect-square items-center justify-center",
                i < links.slice(2, 5).length - 1 ? "border-r border-[var(--border-inverse)]" : ""
              )}
            />
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