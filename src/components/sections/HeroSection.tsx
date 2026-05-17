"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Star, Palette } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  
  // NOTE FOR AGENCY: To remove this theme switcher, simply delete the state below, 
  // delete the "THEME SWITCHER BUTTON" div, and remove the ternary operator {theme === "theme1" ? (...) : (...)}
  const [theme, setTheme] = useState<"theme1" | "theme2">("theme1");

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const children = hero.querySelectorAll(".hero-animate");
    // Reset animation classes when theme changes to replay animations
    children.forEach((child) => {
      child.classList.remove("animate-fade-in-up");
      // Trigger reflow
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
          THEME SWITCHER BUTTON (EASILY REMOVABLE)
          ========================================= */}
      <div className="fixed right-4 top-1/2 z-[100] flex -translate-y-1/2 flex-col items-center gap-3 rounded-full bg-black/40 p-2 backdrop-blur-md shadow-2xl border border-white/10">
        <div className="mb-1 text-white/50">
          <Palette size={16} />
        </div>
        <button
          onClick={() => setTheme("theme1")}
          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-lg transition-all ${
            theme === "theme1"
              ? "bg-gradient-to-r from-[#fcd34d] to-[#f59e0b] text-[#451a03] scale-110"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
          title="Theme 1 (Pro Max)"
        >
          T1
        </button>
        <button
          onClick={() => setTheme("theme2")}
          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-lg transition-all ${
            theme === "theme2"
              ? "bg-gradient-to-r from-[#fcd34d] to-[#f59e0b] text-[#451a03] scale-110"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
          title="Theme 2 (Classic)"
        >
          T2
        </button>
      </div>

      {theme === "theme1" ? (
        /* =========================================
           THEME 1: PRO MAX UI (CURRENT DEFAULT)
           ========================================= */
        <section
          id="home"
          ref={heroRef}
          className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1a0a03]"
        >
          {/* High-Quality Background Image with Parallax/Scale feel */}
          <div className="absolute inset-0 z-0 h-full w-full">
            <Image
              src="/farmhouses/casa-defazenda/1.jpg"
              alt="Premium Farmhouse in Karachi"
              fill
              priority
              className="object-cover opacity-80"
              sizes="100vw"
            />
            {/* Layered Overlays for depth and readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#1a0a03]/95" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#451a03]/40 to-transparent" />
          </div>

          {/* Decorative Orbs */}
          <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
            <div className="absolute -top-40 right-10 h-96 w-96 rounded-full bg-[#fcd34d] blur-[120px]" />
            <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[#b45309] blur-[100px]" />
          </div>

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 pt-20">
            {/* Glassmorphic Top Badge */}
            <div className="hero-animate mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 opacity-0 shadow-2xl backdrop-blur-md transition-all duration-300 hover:bg-white/20">
              <div className="flex gap-1 text-[#fcd34d]">
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
              <span className="bg-gradient-to-r from-[#fcd34d] via-[#fef3c7] to-[#f59e0b] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(252,211,77,0.3)]">
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
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#b45309] to-[#92400e] px-10 py-4 text-base font-bold text-[#fef3c7] shadow-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(180,83,9,0.4)] active:scale-[0.98] sm:w-auto sm:text-lg"
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
                className="flex w-full items-center justify-center rounded-full border border-white/40 bg-white/5 px-10 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:text-[#fcd34d] active:scale-[0.98] sm:w-auto sm:text-lg"
              >
                Book Now
              </a>
            </div>
          </div>

          {/* Stats Floating Banner - Hidden on mobile, visible on tablet+ */}
          <div className="hero-animate absolute bottom-12 left-1/2 hidden -translate-x-1/2 md:block opacity-0">
            <div className="flex items-center gap-8 rounded-full border border-white/10 bg-black/40 px-10 py-4 backdrop-blur-xl shadow-2xl">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#fcd34d]">500+</p>
                <p className="text-xs uppercase tracking-wider text-gray-300">
                  Events Hosted
                </p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-bold text-[#fcd34d]">14</p>
                <p className="text-xs uppercase tracking-wider text-gray-300">
                  Premium Venues
                </p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-bold text-[#fcd34d]">100%</p>
                <p className="text-xs uppercase tracking-wider text-gray-300">
                  Secure Booking
                </p>
              </div>
            </div>
          </div>

          {/* Animated scroll-down indicator (Mobile only since desktop has stats) */}
          <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 md:hidden">
            <a
              href="#packages"
              className="flex flex-col items-center gap-2 text-white/50 transition-colors duration-300 hover:text-[#fcd34d]"
              aria-label="Scroll down"
            >
              <ChevronDown size={24} className="animate-bounce-gentle" />
            </a>
          </div>
        </section>
      ) : (
        /* =========================================
           THEME 2: CLASSIC UI (PREVIOUS BACKUP)
           ========================================= */
        <section
          id="home"
          ref={heroRef}
          className="relative flex min-h-screen items-center justify-center overflow-hidden"
        >
          {/* Background — layered CSS gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#451a03] via-[#14532d] to-[#321204]" />

          {/* Decorative overlay patterns */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(180,83,9,0.4),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(22,101,52,0.3),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(252,211,77,0.1),transparent_70%)]" />
          </div>

          {/* Dark gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#321204]/80 via-transparent to-[#451a03]/40" />

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            {/* Legacy badge */}
            <div className="hero-animate mb-6 inline-flex items-center gap-2 rounded-full border border-[#fcd34d]/30 bg-[#fcd34d]/10 px-5 py-2 opacity-0 backdrop-blur-sm">
              <span
                className="text-2xl font-bold text-[#fcd34d]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                32+
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-[#fef3c7]/80">
                Years of Legacy
              </span>
            </div>

            {/* Headline */}
            <h1
              className="hero-animate mb-6 text-4xl font-bold leading-tight tracking-tight text-[#fef3c7] opacity-0 sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Welcome to{" "}
              <span className="text-[#fcd34d]">Al Jannat</span>
            </h1>

            {/* Subheadline */}
            <p
              className="hero-animate mx-auto mb-10 max-w-2xl text-base leading-relaxed text-[#fef3c7]/80 opacity-0 sm:text-lg md:text-xl"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Pakistan&apos;s most trusted farmhouse booking agency — delivering
              premium booking solutions and farmhouse management services since
              1994. Where every stay becomes an unforgettable memory.
            </p>

            {/* CTA Buttons */}
            <div className="hero-animate flex flex-col items-center justify-center gap-4 opacity-0 sm:flex-row">
              <a
                href="#packages"
                className="group inline-flex items-center gap-2 rounded-full bg-[#b45309] px-8 py-3.5 text-sm font-semibold text-[#fef3c7] shadow-lg transition-all duration-300 hover:bg-[#92400e] hover:shadow-xl active:scale-95 sm:text-base"
              >
                Explore Farmhouses
                <ChevronDown
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#fef3c7]/30 px-8 py-3.5 text-sm font-semibold text-[#fef3c7] backdrop-blur-sm transition-all duration-300 hover:border-[#fcd34d] hover:bg-[#fef3c7]/10 hover:text-[#fcd34d] active:scale-95 sm:text-base"
              >
                Book Now
              </a>
            </div>
          </div>

          {/* Animated scroll-down indicator */}
          <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
            <a
              href="#packages"
              className="flex flex-col items-center gap-2 text-[#fef3c7]/50 transition-colors duration-300 hover:text-[#fcd34d]"
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
    </>
  );
}
