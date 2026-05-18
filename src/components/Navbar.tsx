"use client";

import { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Packages", href: "#packages" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Handle scroll → backdrop blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver → active section highlight
  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.getElementById(link.href.slice(1))
    ).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setIsMobileOpen(false);
      const target = document.getElementById(href.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    },
    []
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-brown-800/90 backdrop-blur-lg shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-20">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, "#home")}
            className="flex items-center gap-2"
          >
            <Image
              src="/logo/al-jannat-logo.png"
              alt="Al Jannat Farmhouse Booking"
              width={180}
              height={60}
              className="h-12 w-auto sm:h-14 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              priority
            />
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeSection === link.href.slice(1)
                    ? "text-cream-300"
                    : "text-cream-100/80 hover:text-cream-100"
                }`}
              >
                {link.label}
                {activeSection === link.href.slice(1) && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-cream-300 transition-all duration-300" />
                )}
              </a>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="hidden rounded-full bg-amber-700 px-5 py-2 text-sm font-semibold text-cream-100 shadow-md transition-all duration-200 hover:bg-amber-800 hover:shadow-lg active:scale-95 sm:inline-flex"
            >
              Book Now
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-cream-100 transition-colors hover:bg-white/10 md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          isMobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-cream-100/10 bg-brown-800/95 backdrop-blur-lg px-4 pb-4 pt-2">
          {NAV_LINKS.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`block rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 ${
                activeSection === link.href.slice(1)
                  ? "bg-amber-700/20 text-cream-300"
                  : "text-cream-100/80 hover:bg-white/5 hover:text-cream-100"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="mt-2 block rounded-full bg-amber-700 px-5 py-3 text-center text-sm font-semibold text-cream-100 shadow-md transition-all duration-200 hover:bg-amber-800"
          >
            Book Now
          </a>
        </div>
      </div>
    </nav>
  );
}
