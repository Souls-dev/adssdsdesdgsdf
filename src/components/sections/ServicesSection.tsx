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
  HelpCircle,
} from "lucide-react";

interface ServiceItem {
  title: string;
  description: string;
}

interface AmenityItem {
  title: string;
  description?: string;
}

interface ServicesSectionProps {
  settings: {
    subtitle: string;
    title: string;
    description: string;
    amenitiesTitle: string;
    coreServices: ServiceItem[];
    amenities: AmenityItem[];
  };
}

const SERVICE_ICONS = [Home, Wrench, UtensilsCrossed, Car, CalendarCheck];
const AMENITY_ICONS = [Waves, Zap, ShieldCheck];

export default function ServicesSection({ settings }: ServicesSectionProps) {
  const coreServices = settings.coreServices || [];
  const amenities = settings.amenities || [];

  // Safely get icon for service
  const getServiceIcon = (index: number) => {
    return SERVICE_ICONS[index % SERVICE_ICONS.length] || HelpCircle;
  };

  // Safely get icon for amenity
  const getAmenityIcon = (index: number) => {
    return AMENITY_ICONS[index % AMENITY_ICONS.length] || HelpCircle;
  };

  const BookingIcon = getServiceIcon(0);
  const EventIcon = getServiceIcon(4);

  return (
    <section
      id="services"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-surface-alt"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 h-[600px] w-[600px] rounded-full bg-amber-700/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-700/20 bg-amber-700/5 px-5 py-2.5">
            <Sparkles className="h-4 w-4 text-amber-700" />
            <span className="text-sm font-semibold uppercase tracking-wider text-amber-700">
              {settings.subtitle || "What We Offer"}
            </span>
          </div>
          <h2
            className="mb-6 text-4xl font-bold leading-tight text-brown-850 sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {settings.title || "A Complete One-Roof Solution"}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-amber-900/70 sm:text-xl">
            {settings.description || ""}
          </p>
        </div>

        {/* Bento Grid for Core Services */}
        {coreServices.length > 0 && (
          <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Feature: Farmhouse Booking (Spans 2 columns) */}
            {coreServices[0] && (
              <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/40 p-10 shadow-sm backdrop-blur-xl transition-shadow duration-200 hover:shadow-lg lg:col-span-2">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-cream-100 to-cream-200 opacity-40 blur-3xl" />

                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-700 to-amber-800 shadow-lg transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                      <BookingIcon size={32} className="text-cream-100" />
                    </div>
                    <h3
                      className="mb-4 text-3xl font-bold text-brown-800 lg:text-4xl"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {coreServices[0].title}
                    </h3>
                  </div>
                  <p className="mt-auto max-w-xl text-lg leading-relaxed text-amber-900/80">
                    {coreServices[0].description}
                  </p>
                </div>
              </div>
            )}

            {/* Top Right Card: Event Management */}
            {coreServices[4] && (
              <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/40 p-10 shadow-sm backdrop-blur-xl transition-shadow duration-200 hover:shadow-lg">
                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-700/10 transition-colors duration-500 group-hover:bg-amber-700">
                    <EventIcon
                      size={26}
                      className="text-amber-700 transition-colors duration-500 group-hover:text-white"
                    />
                  </div>
                  <h3
                    className="mb-3 text-2xl font-bold text-brown-800"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {coreServices[4].title}
                  </h3>
                  <p className="mt-auto text-base leading-relaxed text-amber-900/75">
                    {coreServices[4].description}
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Row: 3 standard cards */}
            {coreServices.slice(1, 4).map((service, i) => {
              const Icon = getServiceIcon(i + 1);
              return (
                <div
                  key={service.title}
                  className="group relative overflow-hidden rounded-2xl border border-amber-700/10 bg-white/60 p-8 shadow-sm backdrop-blur-md transition-shadow duration-200 hover:shadow-lg lg:col-span-1"
                >
                  <div className="relative z-10">
                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-700/10 transition-colors duration-500 group-hover:bg-amber-700">
                      <Icon
                        size={26}
                        className="text-amber-700 transition-colors duration-500 group-hover:text-white"
                      />
                    </div>
                    <h3
                      className="mb-3 text-xl font-bold text-brown-800"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {service.title}
                    </h3>
                    <p className="text-base leading-relaxed text-amber-900/70">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Luxury Amenities Section */}
        {amenities.length > 0 && (
          <div className="mt-20">
            <h3
              className="mb-10 text-center text-2xl font-bold text-brown-800 sm:text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {settings.amenitiesTitle || "Signature Amenities"}
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {amenities.map((amenity, i) => {
                const Icon = getAmenityIcon(i);
                return (
                  <div
                    key={amenity.title}
                    className="group flex items-center gap-5 rounded-full border border-forest-800/10 bg-white/60 p-4 shadow-sm backdrop-blur-md transition-shadow duration-200 hover:shadow-md"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-forest-800/10 to-forest-800/5 transition-all duration-300 group-hover:from-forest-800 group-hover:to-forest-750 group-hover:shadow-md">
                      <Icon
                        size={22}
                        className="text-forest-800 transition-colors duration-300 group-hover:text-cream-100"
                      />
                    </div>
                    <div className="pr-4">
                      <h3
                        className="text-lg font-bold text-brown-800"
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
        )}
      </div>
    </section>
  );
}
