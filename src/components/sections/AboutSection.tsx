"use client";

import Image from "next/image";
import { Award, Heart, Home, Clock, Handshake, ShieldCheck, Sparkles, HelpCircle } from "lucide-react";

interface ValueItem {
  title: string;
  description: string;
}

interface StatItem {
  value: string;
  label: string;
}

interface AboutSectionProps {
  settings: {
    subtitle: string;
    title: string;
    heading: string;
    paragraphs: string[];
    promiseTitle: string;
    promiseText: string;
    valuesTitle: string;
    values: ValueItem[];
    stats: StatItem[];
  };
}

const STAT_ICONS = [Award, Heart, Home, Clock];
const VALUE_ICONS = [Handshake, ShieldCheck, Sparkles];

export default function AboutSection({ settings }: AboutSectionProps) {
  const paragraphs = settings.paragraphs || [];
  const values = settings.values || [];
  const stats = settings.stats || [];

  const getStatIcon = (index: number) => {
    return STAT_ICONS[index % STAT_ICONS.length] || HelpCircle;
  };

  const getValueIcon = (index: number) => {
    return VALUE_ICONS[index % VALUE_ICONS.length] || HelpCircle;
  };

  return (
    <section
      id="about"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-cream-50"
    >
      {/* Subtle background decoration */}
      <div className="absolute right-0 top-0 h-full w-1/2 opacity-5">
        <div className="h-full w-full bg-[radial-gradient(circle_at_70%_50%,#b45309,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 text-center sm:mb-16">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-amber-700">
            {settings.subtitle || "Who We Are"}
          </p>
          <h2
            className="mb-4 text-3xl font-bold text-brown-800 sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {settings.title || "About Al Jannat"}
          </h2>
        </div>

        {/* Two-column: text + images */}
        <div className="mb-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Text left */}
          <div className="rounded-[2rem] border border-amber-700/10 bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl sm:p-8">
            <h3
              className="mb-4 text-2xl font-bold text-brown-800 sm:text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {settings.heading || "32 Years of Unmatched Hospitality"}
            </h3>
            {paragraphs.map((p, i) => (
              <p key={i} className="mb-4 text-base leading-relaxed text-amber-900/75 last:mb-6">
                {p}
              </p>
            ))}

            {/* Our Promise card */}
            {settings.promiseText && (
              <div className="rounded-2xl border border-amber-700/10 bg-gradient-to-br from-cream-100/50 to-white p-6">
                <h4
                  className="mb-2 text-lg font-bold text-brown-800"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {settings.promiseTitle || "Our Promise"}
                </h4>
                <p className="text-sm leading-relaxed text-amber-900/70">
                  {settings.promiseText}
                </p>
              </div>
            )}
          </div>

          {/* Image grid right — uses real farmhouse photos */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <div className="relative overflow-hidden rounded-2xl aspect-[3/4]">
                <Image
                  src="/farmhouses/casa-defazenda/1.jpg"
                  alt="Al Jannat Farmhouse exterior"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="relative overflow-hidden rounded-2xl aspect-square">
                <Image
                  src="/farmhouses/green-paradise/2.jpg"
                  alt="Scenic views from farmhouse"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
            <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
              <div className="relative overflow-hidden rounded-2xl aspect-square">
                <Image
                  src="/farmhouses/luminious/3.jpg"
                  alt="Luxury interior"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="relative overflow-hidden rounded-2xl aspect-[3/4]">
                <Image
                  src="/farmhouses/shughal-mela/2.jpg"
                  alt="Event hosting at Al Jannat"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Values section */}
        {values.length > 0 && (
          <div className="mb-20">
            <h3
              className="mb-10 text-center text-3xl font-bold text-brown-800 sm:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {settings.valuesTitle || "Our Core Values"}
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {values.map((value, i) => {
                const Icon = getValueIcon(i);
                return (
                  <div
                    key={value.title}
                    className="group relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/40 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/70 hover:shadow-[0_8px_30px_rgb(180,83,9,0.1)]"
                  >
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-cream-100 to-cream-200 opacity-40 blur-2xl transition-transform duration-700 group-hover:scale-150" />
                    
                    <div className="relative z-10">
                      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-700 to-amber-800 shadow-lg transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                        <Icon size={26} className="text-cream-100" />
                      </div>
                      <h4
                        className="mb-3 text-xl font-bold text-brown-800"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {value.title}
                      </h4>
                      <p className="text-base leading-relaxed text-amber-900/75">
                        {value.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats row */}
        {stats.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {stats.map((stat, i) => {
              const Icon = getStatIcon(i);
              return (
                <div
                  key={stat.label}
                  className="group flex items-center gap-5 rounded-full border border-white/60 bg-white/40 p-4 pr-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_8px_30px_rgb(180,83,9,0.1)]"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-700 to-amber-800 shadow-lg transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <Icon size={28} className="text-cream-100" />
                  </div>
                  <div>
                    <p
                      className="text-3xl font-bold text-brown-800 lg:text-4xl"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-sm font-medium text-amber-900/70 uppercase tracking-wider mt-1">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
