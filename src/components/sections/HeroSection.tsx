"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronDown, Star, Play } from "lucide-react";
import Image from "next/image";

// ── HERO SLIDE IMAGES ──────────────────────────────────────────
// Put your images in /public/hero-slides/ as 1.jpg, 2.jpg, 3.jpg, etc.
// Add or remove entries here to match your files.
const HERO_SLIDES = [
  "/hero-slides/1.jpg",
  "/hero-slides/2.jpg",
  "/hero-slides/3.jpg",
  "/hero-slides/4.jpg",
  "/hero-slides/5.jpg",
];

interface HeroSectionProps {
  theme: "theme1" | "theme2" | "theme3";
}

export default function HeroSection({ theme }: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  // ── T3: Auto-sliding background image state ─────────────────
  const [slideIndex, setSlideIndex] = useState(0);
  const slideInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSlideshow = useCallback(() => {
    if (slideInterval.current) clearInterval(slideInterval.current);
    slideInterval.current = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
  }, []);

  useEffect(() => {
    if (theme === "theme3") {
      startSlideshow();
    } else {
      if (slideInterval.current) clearInterval(slideInterval.current);
    }
    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, [theme, startSlideshow]);

  // ── Replay entrance animations on theme change ──────────────
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const children = hero.querySelectorAll(".hero-animate");
    children.forEach((child) => {
      child.classList.remove("animate-fade-in-up");
      void (child as HTMLElement).offsetWidth;
    });
    children.forEach((child, index) => {
      (child as HTMLElement).style.animationDelay = `${index * 150}ms`;
      child.classList.add("animate-fade-in-up");
    });
  }, [theme]);

  return (
    <>

      {/* =========================================
          THEME 1: PRO MAX UI — VIDEO PLACEHOLDER
          ========================================= */}
      {theme === "theme1" && (
        <section
          id="home"
          ref={heroRef}
          className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brown-950"
        >
          {/* Video Placeholder */}
          <div className="absolute inset-0 z-0 h-full w-full">
            <div className="relative h-full w-full bg-gradient-to-br from-brown-950 via-brown-900 to-forest-950">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(252,211,77,0.03),transparent_70%)]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl transition-all duration-300 hover:bg-white/20 hover:scale-110">
                  <Play size={40} className="text-white/60 ml-1" />
                </div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/40">
                  Promo Video
                </p>
                <p
                  className="mt-1 text-lg font-semibold text-white/60"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Coming Soon
                </p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-brown-950/95" />
            <div className="absolute inset-0 bg-gradient-to-r from-brown-800/40 to-transparent" />
          </div>

          {/* Decorative Orbs */}
          <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
            <div className="absolute -top-40 right-10 h-96 w-96 rounded-full bg-cream-300 blur-[120px]" />
            <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-amber-700 blur-[100px]" />
          </div>

          {/* Content */}
          <HeroContent />

          {/* Stats Banner — Desktop */}
          <StatsBanner />

          {/* Scroll indicator — Mobile */}
          <ScrollIndicator />
        </section>
      )}

      {/* =========================================
          THEME 2: CLASSIC GRADIENT
          ========================================= */}
      {theme === "theme2" && (
        <section
          id="home"
          ref={heroRef}
          className="relative flex min-h-screen items-center justify-center overflow-hidden"
        >
          {/* Background — layered CSS gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-brown-800 via-forest-800 to-brown-900" />

          {/* Decorative overlay patterns */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(180,83,9,0.4),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(22,101,52,0.3),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(252,211,77,0.1),transparent_70%)]" />
          </div>

          {/* Dark gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-brown-900/80 via-transparent to-brown-800/40" />

          {/* Content */}
          <HeroContent />

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
            <a
              href="#packages"
              className="flex flex-col items-center gap-2 text-cream-100/50 transition-colors duration-300 hover:text-cream-300"
              aria-label="Scroll down"
            >
              <span className="text-xs font-medium uppercase tracking-widest">
                Scroll
              </span>
              <ChevronDown size={20} className="animate-bounce-gentle" />
            </a>
          </div>
        </section>
      )}

      {/* =========================================
          THEME 3: AUTO-SLIDING BACKGROUND IMAGES
          Put images in /public/hero-slides/ folder
          ========================================= */}
      {theme === "theme3" && (
        <section
          id="home"
          ref={heroRef}
          className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brown-950"
        >
          {/* Sliding Background Images */}
          <div className="absolute inset-0 z-0">
            {HERO_SLIDES.map((src, i) => (
              <div
                key={src}
                className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                style={{ opacity: i === slideIndex ? 1 : 0 }}
              >
                <Image
                  src={src}
                  alt={`Al Jannat Farmhouse - Slide ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={i === 0}
                />
              </div>
            ))}
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-brown-950/90 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-brown-800/30 to-transparent z-10" />
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-28 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:bottom-20">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setSlideIndex(i);
                  startSlideshow();
                }}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === slideIndex
                    ? "w-8 bg-cream-300"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Content */}
          <HeroContent />

          {/* Stats Banner — Desktop */}
          <StatsBanner />

          {/* Scroll indicator — Mobile */}
          <ScrollIndicator />
        </section>
      )}
    </>
  );
}

// ── Shared Hero Content (used by all 3 themes) ───────────────
function HeroContent() {
  return (
    <div className="relative z-20 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 pt-20 pb-32 md:pb-40">
      {/* Badge */}
      <div className="hero-animate mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 opacity-0 shadow-2xl backdrop-blur-md transition-all duration-300 hover:bg-white/20">
        <div className="flex gap-1 text-cream-300">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="currentColor" />
          ))}
        </div>
        <span className="h-4 w-px bg-white/30" />
        <span className="text-xs font-bold uppercase tracking-widest text-white sm:text-sm">
          32+ Years of Excellence
        </span>
      </div>

      {/* Headline */}
      <h1
        className="hero-animate mb-6 text-5xl font-extrabold leading-tight tracking-tight text-white opacity-0 sm:text-6xl md:text-7xl lg:text-8xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Welcome to <br className="sm:hidden" />
        <span className="bg-gradient-to-r from-cream-300 via-cream-100 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(252,211,77,0.3)]">
          Al Jannat
        </span>
      </h1>

      {/* Subheadline */}
      <p
        className="hero-animate mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-gray-200 opacity-0 sm:text-xl md:text-2xl font-light"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Pakistan&apos;s most trusted farmhouse booking agency — delivering
        premium solutions and property management since 1994. Where every
        stay becomes an unforgettable memory.
      </p>

      {/* CTA Buttons */}
      <div className="hero-animate flex flex-col items-center justify-center gap-4 opacity-0 sm:flex-row sm:gap-6">
        <a
          href="#packages"
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-700 to-amber-800 px-10 py-4 text-base font-bold text-cream-100 shadow-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(180,83,9,0.4)] active:scale-[0.98] sm:w-auto sm:text-lg"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative z-10 flex items-center gap-2">
            Explore Farmhouses
            <ChevronDown
              size={20}
              className="transition-transform duration-300 group-hover:translate-y-1"
            />
          </span>
        </a>
        <a
          href="#contact"
          className="flex w-full items-center justify-center rounded-full border border-white/40 bg-white/5 px-10 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:text-cream-300 active:scale-[0.98] sm:w-auto sm:text-lg"
        >
          Book Now
        </a>
      </div>
    </div>
  );
}

// ── Shared Stats Banner (Desktop) ────────────────────────────
function StatsBanner() {
  return (
    <div className="hero-animate absolute bottom-12 left-1/2 hidden -translate-x-1/2 md:block opacity-0 z-20">
      <div className="flex items-center gap-6 rounded-full border border-white/10 bg-black/40 px-8 py-3 backdrop-blur-xl shadow-2xl">
        <div className="text-center">
          <p className="text-xl font-bold text-cream-300">10,000+</p>
          <p className="text-[10px] uppercase tracking-wider text-gray-300">
            Happy Customers
          </p>
        </div>
        <div className="h-8 w-px bg-white/20" />
        <div className="text-center">
          <p className="text-xl font-bold text-cream-300">40+</p>
          <p className="text-[10px] uppercase tracking-wider text-gray-300">
            Premium Venues
          </p>
        </div>
        <div className="h-8 w-px bg-white/20" />
        <div className="text-center">
          <p className="text-xl font-bold text-cream-300">24/7</p>
          <p className="text-[10px] uppercase tracking-wider text-gray-300">
            Dedicated Support
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Shared Scroll Indicator (Mobile) ─────────────────────────
function ScrollIndicator() {
  return (
    <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 md:hidden">
      <a
        href="#packages"
        className="flex flex-col items-center gap-2 text-white/50 transition-colors duration-300 hover:text-cream-300"
        aria-label="Scroll down"
      >
        <ChevronDown size={24} className="animate-bounce-gentle" />
      </a>
    </div>
  );
}
