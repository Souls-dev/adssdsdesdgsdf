"use client";

import {
  Home,
  Wrench,
  UtensilsCrossed,
  Car,
  CalendarCheck,
  Waves,
  Zap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const CORE_SERVICES = [
  {
    icon: Home,
    title: "Farmhouse Booking",
    description:
      "Seamless end-to-end booking for premium farmhouses across Karachi. We handle customer communication, calendar management, and booking execution so you can focus on enjoying your stay.",
  },
  {
    icon: Wrench,
    title: "Farmhouse Management",
    description:
      "Complete property management solutions — renovations, electrical maintenance, swimming pool upkeep, generator & fuel management, and facilities maintenance. All handled professionally.",
  },
  {
    icon: UtensilsCrossed,
    title: "Food & Beverages",
    description:
      "Authentic Pakistani cuisine prepared by professional chefs. From traditional BBQ setups to full-course dining, we craft custom menus for every occasion and dietary preference.",
  },
  {
    icon: Car,
    title: "Transportation",
    description:
      "Door-to-door luxury transport services for your entire group. Comfortable vans, professional drivers, and luggage assistance for a hassle-free journey to and from the farmhouse.",
  },
  {
    icon: CalendarCheck,
    title: "Event Management",
    description:
      "Full-scale event coordination for weddings, corporate retreats, family reunions, and celebrations. Décor, entertainment, catering, and logistics — all under one roof.",
  },
];

const AMENITIES = [
  {
    icon: Waves,
    title: "Private Pools",
    description:
      "Crystal-clear swimming pools with temperature control, poolside loungers, and dedicated changing facilities at every property.",
  },
  {
    icon: Zap,
    title: "Generator Backup",
    description:
      "Uninterrupted power supply with automatic generator switchover — no blackouts, guaranteed comfort around the clock.",
  },
  {
    icon: ShieldCheck,
    title: "24/7 Security",
    description:
      "Round-the-clock trained security staff, CCTV monitoring, and mandatory gate passes to ensure privacy and safety of all guests.",
  },
];

export default function ServicesSection() {
  const BookingIcon = CORE_SERVICES[0].icon;
  const EventIcon = CORE_SERVICES[4].icon;

  return (
    <section
      id="services"
      className="relative overflow-hidden py-24 lg:py-32"
      style={{ backgroundColor: "#FDFBF7" }}
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 h-[600px] w-[600px] rounded-full bg-[#b45309]/5 blur-[120px]" />
        <div className="absolute -right-40 bottom-20 h-[800px] w-[800px] rounded-full bg-[#14532d]/5 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b45309]/20 bg-[#b45309]/5 px-5 py-2.5">
            <Sparkles className="h-4 w-4 text-[#b45309]" />
            <span className="text-sm font-semibold uppercase tracking-wider text-[#b45309]">
              What We Offer
            </span>
          </div>
          <h2
            className="mb-6 text-4xl font-bold leading-tight text-[#291304] sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            A Complete{" "}
            <span className="bg-gradient-to-r from-[#b45309] to-[#78350f] bg-clip-text text-transparent">
              One-Roof Solution
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#78350f]/70 sm:text-xl">
            With over three decades of experience, we manage everything from
            booking to facilities — delivering peace of mind every step of the
            way.
          </p>
        </div>

        {/* Bento Grid for Core Services */}
        <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Feature: Farmhouse Booking (Spans 2 columns) */}
          <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/40 p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/70 hover:shadow-[0_8px_30px_rgb(180,83,9,0.1)] lg:col-span-2">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#fef3c7] to-[#fde68a] opacity-40 blur-3xl transition-transform duration-700 group-hover:scale-150" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#b45309] to-[#92400e] shadow-lg transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                  <BookingIcon size={32} className="text-[#fef3c7]" />
                </div>
                <h3
                  className="mb-4 text-3xl font-bold text-[#451a03] lg:text-4xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {CORE_SERVICES[0].title}
                </h3>
              </div>
              <p className="mt-auto max-w-xl text-lg leading-relaxed text-[#78350f]/80">
                {CORE_SERVICES[0].description}
              </p>
            </div>
          </div>

          {/* Top Right Card: Event Management */}
          <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/40 p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/70 hover:shadow-[0_8px_30px_rgb(180,83,9,0.1)]">
            <div className="relative z-10 flex h-full flex-col">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#b45309]/10 transition-colors duration-500 group-hover:bg-[#b45309]">
                <EventIcon
                  size={26}
                  className="text-[#b45309] transition-colors duration-500 group-hover:text-white"
                />
              </div>
              <h3
                className="mb-3 text-2xl font-bold text-[#451a03]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {CORE_SERVICES[4].title}
              </h3>
              <p className="mt-auto text-base leading-relaxed text-[#78350f]/75">
                {CORE_SERVICES[4].description}
              </p>
            </div>
          </div>

          {/* Bottom Row: 3 standard cards */}
          {CORE_SERVICES.slice(1, 4).map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group relative overflow-hidden rounded-[2rem] border border-[#b45309]/10 bg-white/60 p-8 shadow-sm backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-white hover:shadow-xl lg:col-span-1"
              >
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#b45309]/10 transition-colors duration-500 group-hover:bg-[#b45309]">
                    <Icon
                      size={26}
                      className="text-[#b45309] transition-colors duration-500 group-hover:text-white"
                    />
                  </div>
                  <h3
                    className="mb-3 text-xl font-bold text-[#451a03]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-base leading-relaxed text-[#78350f]/70">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Luxury Amenities Section */}
        <div className="mt-20">
          <h3
            className="mb-10 text-center text-2xl font-bold text-[#451a03] sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Signature Amenities
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {AMENITIES.map((amenity) => {
              const Icon = amenity.icon;
              return (
                <div
                  key={amenity.title}
                  className="group flex items-center gap-5 rounded-full border border-[#14532d]/10 bg-white/60 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-md"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#14532d]/10 to-[#14532d]/5 transition-all duration-300 group-hover:from-[#14532d] group-hover:to-[#0f4a24] group-hover:shadow-md">
                    <Icon
                      size={22}
                      className="text-[#14532d] transition-colors duration-300 group-hover:text-[#fef3c7]"
                    />
                  </div>
                  <div className="pr-4">
                    <h3
                      className="text-lg font-bold text-[#451a03]"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {amenity.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
