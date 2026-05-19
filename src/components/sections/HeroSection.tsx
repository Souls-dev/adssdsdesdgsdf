"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronDown, Star, Play } from "lucide-react";
import Image from "next/image";

interface HeroSectionProps {
  theme: "theme1" | "theme2" | "theme3";
  settings: {
    badgeText: string;
    headline: string;
    headlineAccent: string;
    subheadline: string;
    ctaPrimary: { text: string; href: string };
    ctaSecondary: { text: string; href: string };
    stats: { value: string; label: string }[];
    videoUrl: string;
    slides: string[];
  };
}

export default function HeroSection({ theme, settings }: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const slides = settings.slides && settings.slides.length > 0 ? settings.slides : [
    "/hero-slides/1.jpg",
    "/hero-slides/2.jpg",
    "/hero-slides/3.jpg",
    "/hero-slides/4.jpg",
    "/hero-slides/5.jpg",
  ];

  // ── T3: Auto-sliding background image state ─────────────────
  const [slideIndex, setSlideIndex] = useState(0);
  const slideInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSlideshow = useCallback(() => {
    if (slideInterval.current) clearInterval(slideInterval.current);
    slideInterval.current = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
  }, [slides.length]);

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
          className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-brown-950"
        >
          <div className="absolute inset-0 z-0 h-full w-full">
            <div className="relative h-full w-full bg-gradient-to-br from-brown-950 via-brown-900 to-forest-950">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(252,211,77,0.03),transparent_70%)]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
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

          <HeroContent settings={settings} />
          <StatsBanner stats={settings.stats} />
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
          <div className="absolute inset-0 bg-gradient-to-br from-brown-800 via-forest-800 to-brown-900" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(180,83,9,0.4),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(22,101,52,0.3),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(252,211,77,0.1),transparent_70%)]" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-brown-900/80 via-transparent to-brown-800/40" />

          <HeroContent settings={settings} />

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
          ========================================= */}
      {theme === "theme3" && (
        <section
          id="home"
          ref={heroRef}
          className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-brown-950"
        >
          <div className="absolute inset-0 z-0">
            {slides.map((src, i) => (
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
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-brown-950/90 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-brown-800/30 to-transparent z-10" />
          </div>

          <div className="absolute bottom-28 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:bottom-20">
            {slides.map((_, i) => (
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

          <HeroContent settings={settings} />
          <StatsBanner stats={settings.stats} />
          <ScrollIndicator />
        </section>
      )}
    </>
  );
}

function HeroContent({ settings }: { settings: HeroSectionProps["settings"] }) {
  return (
    <div className="relative z-20 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 pt-20 pb-32 md:pb-40">
      <div className="hero-animate mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 opacity-0 shadow-2xl backdrop-blur-md transition-all duration-300 hover:bg-white/20">
        <div className="flex gap-1 text-cream-300">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="currentColor" />
          ))}
        </div>
        <span className="h-4 w-px bg-white/30" />
        <span className="text-xs font-bold uppercase tracking-widest text-white sm:text-sm">
          {settings.badgeText}
        </span>
      </div>

      <h1
        className="hero-animate mb-6 text-5xl font-extrabold leading-tight tracking-tight text-white opacity-0 sm:text-6xl md:text-7xl lg:text-8xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {settings.headline} <br className="sm:hidden" />
        <span className="bg-gradient-to-r from-cream-300 via-cream-100 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(252,211,77,0.3)]">
          {settings.headlineAccent}
        </span>
      </h1>

      <p
        className="hero-animate mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-gray-200 opacity-0 sm:text-xl md:text-2xl font-light"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {settings.subheadline}
      </p>

      <div className="hero-animate flex flex-col items-center justify-center gap-4 opacity-0 sm:flex-row sm:gap-6">
        <a
          href={settings.ctaPrimary.href}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-700 to-amber-800 px-10 py-4 text-base font-bold text-cream-100 shadow-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(180,83,9,0.4)] active:scale-[0.98] sm:w-auto sm:text-lg"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative z-10 flex items-center gap-2">
            {settings.ctaPrimary.text}
            <ChevronDown
              size={20}
              className="transition-transform duration-300 group-hover:translate-y-1"
            />
          </span>
        </a>
        <a
          href={settings.ctaSecondary.href}
          className="flex w-full items-center justify-center rounded-full border border-white/40 bg-white/5 px-10 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:text-cream-300 active:scale-[0.98] sm:w-auto sm:text-lg"
        >
          {settings.ctaSecondary.text}
        </a>
      </div>
    </div>
  );
}

function StatsBanner({ stats }: { stats: { value: string; label: string }[] }) {
  if (!stats || stats.length === 0) return null;
  return (
    <div className="hero-animate relative z-20 mb-8 hidden md:block opacity-0">
      <div className="flex items-center gap-6 rounded-full border border-white/10 bg-black/40 px-8 py-3 backdrop-blur-xl shadow-2xl">
        {stats.map((st, i) => (
          <div key={i} className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xl font-bold text-cream-300">{st.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-300">
                {st.label}
              </p>
            </div>
            {i < stats.length - 1 && <div className="h-8 w-px bg-white/20" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function ScrollIndicator() {
  return (
    <div className="relative z-20 mb-6 md:hidden">
      <a
        href="#packages"
        className="flex flex-col items-center gap-2 text-white/50 transition-colors duration-200 hover:text-cream-300"
        aria-label="Scroll down"
      >
        <ChevronDown size={24} className="animate-bounce-gentle" />
      </a>
    </div>
  );
}
