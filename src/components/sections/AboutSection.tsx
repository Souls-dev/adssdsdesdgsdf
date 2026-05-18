"use client";

import Image from "next/image";
import { Award, Heart, Home, Handshake, ShieldCheck, Sparkles, Clock, Star } from "lucide-react";

const STATS = [
  { value: "32+", label: "Years of Legacy", icon: Award },
  { value: "10,000+", label: "Happy Customers", icon: Heart },
  { value: "40+", label: "Premium Farmhouses", icon: Home },
  { value: "100%", label: "Satisfaction Guarantee", icon: Star },
  { value: "24/7", label: "Dedicated Support", icon: Clock },
];

const VALUES = [
  {
    icon: Handshake,
    title: "Relationship",
    description:
      "We believe in straightforward, honest communication. Our team works closely with both property owners and guests to ensure everyone is on the same page from booking to checkout.",
  },
  {
    icon: ShieldCheck,
    title: "Trust",
    description:
      "For over 30 years, we have kept our promises. If there is an issue with a property, we address it immediately. We only list farmhouses that meet our strict standards for safety and cleanliness.",
  },
  {
    icon: Sparkles,
    title: "Spirit of Service",
    description:
      "Service is at the core of our business. Our caretakers and support staff are trained to be helpful and respectful, making sure your events run smoothly without unnecessary interruptions.",
  },
];

export default function AboutSection() {
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
            Who We Are
          </p>
          <h2
            className="mb-4 text-3xl font-bold text-brown-800 sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            About Al Jannat
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
              32 Years of{" "}
              <span className="text-amber-700">Unmatched Hospitality</span>
            </h3>
            <p className="mb-4 text-base leading-relaxed text-amber-900/75">
              Since 1994, Al Jannat Farmhouse Booking Agency has helped families and businesses host successful events. We understand that finding the right venue can be stressful, which is why our team works directly with you to ensure your family reunions, corporate retreats, and special celebrations go off without a hitch. We have built our reputation on reliable service over the last three decades.
            </p>
            <p className="mb-6 text-base leading-relaxed text-amber-900/75">
              We started small and gradually expanded our network to include some of the most reliable properties in Karachi. Our approach is straightforward: we offer well-maintained farmhouses and honest guidance. Instead of just handing over the keys, we make sure the facilities are ready, the environment is secure, and you have exactly what you need to enjoy your stay.
            </p>

            {/* Our Promise card */}
            <div className="rounded-2xl border border-amber-700/10 bg-gradient-to-br from-cream-100/50 to-white p-6">
              <h4
                className="mb-2 text-lg font-bold text-brown-800"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Our Promise
              </h4>
              <p className="text-sm leading-relaxed text-amber-900/70">
                Your trust is our biggest asset. We offer a 100% refund on valid cancellations and only partner with verified property owners. Our team is always on call, so you never have to deal with property issues alone. We handle the logistics so you can focus on your guests.
              </p>
            </div>
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
        <div className="mb-20">
          <h3
            className="mb-10 text-center text-3xl font-bold text-brown-800 sm:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our Core Values
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {VALUES.map((value) => {
              const Icon = value.icon;
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

        {/* Stats row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5 sm:gap-6">
          {STATS.map((stat) => {
            const Icon = stat.icon;
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
      </div>
    </section>
  );
}
