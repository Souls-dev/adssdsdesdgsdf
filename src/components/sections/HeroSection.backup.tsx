"use client";

import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const children = hero.querySelectorAll(".hero-animate");
    children.forEach((child, index) => {
      (child as HTMLElement).style.animationDelay = `${index * 200}ms`;
      child.classList.add("animate-fade-in-up");
    });
  }, []);

  return (
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
          <span className="text-2xl font-bold text-[#fcd34d]" style={{ fontFamily: "var(--font-heading)" }}>32+</span>
          <span className="text-xs font-medium uppercase tracking-wider text-[#fef3c7]/80">Years of Legacy</span>
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
  );
}
