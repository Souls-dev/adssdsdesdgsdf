"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Bed,
  Bath,
  Users,
  ChevronDown,
  ChevronUp,
  MessageCircle,
} from "lucide-react";
import ImageCarousel from "@/components/ImageCarousel";

type Farmhouse = {
  id: string;
  name: string;
  location: string;
  shortDescription: string;
  fullDescription: string;
  pricePerNight: number;
  weekendSurcharge: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  coverImage: string;
  images: string[];
  available: boolean;
  pricingEnabled?: boolean;
};

interface PackagesSectionProps {
  onBookFarmhouse: (farmhouseId: string) => void;
  settings: {
    subtitle: string;
    title: string;
    description: string;
  };
}

export default function PackagesSection({
  onBookFarmhouse,
  settings,
}: PackagesSectionProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [farmhouses, setFarmhouses] = useState<Farmhouse[]>([]);

  useEffect(() => {
    async function loadFarmhouses() {
      try {
        const res = await fetch("/api/farmhouses");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setFarmhouses(data.farmhouses);
          }
        }
      } catch (err) {
        console.error("Failed to load farmhouses", err);
      }
    }
    loadFarmhouses();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <section
      id="packages"
      className="relative py-16 sm:py-20 lg:py-24 bg-cream-50"
    >
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brown-900/5 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-16">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-amber-700">
            {settings.subtitle}
          </p>
          <h2
            className="mb-4 text-3xl font-bold text-brown-800 sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {settings.title}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-amber-900/70 sm:text-lg">
            {settings.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {farmhouses.map((farm) => (
            <div
              key={farm.id}
              className="group overflow-hidden rounded-2xl border border-amber-800/10 bg-white shadow-sm transition-shadow duration-200 hover:shadow-lg"
            >
              <div className="relative">
                <ImageCarousel
                  images={farm.images}
                  alt={farm.name}
                  fallbackName={farm.name}
                />
              </div>

              <div className="p-5 sm:p-6">
                <h3
                  className="mb-1 text-xl font-bold text-brown-800 sm:text-2xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {farm.name}
                </h3>
                <div className="mb-3 flex items-center gap-1 text-sm text-amber-900/60">
                  <MapPin size={14} />
                  {farm.location}
                </div>

                <p className="line-clamp-2 mb-4 text-sm leading-relaxed text-amber-900/70">
                  {farm.shortDescription}
                </p>

                <div className="mb-4 flex items-center gap-2">
                  {farm.pricingEnabled ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-amber-800" style={{ fontFamily: "var(--font-heading)" }}>
                        PKR {farm.pricePerNight.toLocaleString()}
                      </span>
                      <span className="text-sm text-amber-900/50">/ night</span>
                      {farm.weekendSurcharge > 0 && (
                        <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                          +{farm.weekendSurcharge.toLocaleString()} weekend
                        </span>
                      )}
                    </div>
                  ) : (
                    <a
                      href="https://wa.me/+923332272020"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/10 px-3.5 py-1.5 text-sm font-semibold text-[#25D366] transition-all duration-200 hover:bg-[#25D366]/20"
                    >
                      <MessageCircle size={14} />
                      Contact for Pricing
                    </a>
                  )}
                </div>

                <div className="mb-4 flex items-center gap-4 text-sm text-amber-900/70">
                  <div className="flex items-center gap-1.5">
                    <Bed size={16} className="text-amber-700" />
                    <span>{farm.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bath size={16} className="text-amber-700" />
                    <span>{farm.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={16} className="text-amber-700" />
                    <span>Up to {farm.maxGuests}</span>
                  </div>
                </div>

                <div className="mb-5 flex flex-wrap gap-2">
                  {farm.amenities.slice(0, 4).map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-amber-800"
                    >
                      {amenity}
                    </span>
                  ))}
                  {farm.amenities.length > 4 && (
                    <span className="rounded-full bg-cream-100/50 px-3 py-1 text-xs font-medium text-amber-800/60">
                      +{farm.amenities.length - 4} more
                    </span>
                  )}
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedCard === farm.id
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="mb-5 rounded-xl bg-cream-100/50 p-4">
                    <p className="mb-3 text-sm leading-relaxed text-amber-900/80">
                      {farm.fullDescription}
                    </p>
                    <h4 className="mb-2 text-sm font-semibold text-brown-800">
                      All Amenities:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {farm.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-full bg-amber-700/10 px-2.5 py-0.5 text-xs text-amber-800"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => toggleExpand(farm.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-amber-700/20 px-4 py-2.5 text-sm font-semibold text-amber-700 transition-all duration-200 hover:border-amber-700 hover:bg-amber-700/5"
                  >
                    {expandedCard === farm.id ? (
                      <>
                        <ChevronUp size={16} />
                        Less Details
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        View Details
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => onBookFarmhouse(farm.id)}
                    className="flex-1 rounded-xl bg-amber-700 px-4 py-2.5 text-sm font-semibold text-cream-100 shadow-md transition-all duration-200 hover:bg-amber-800 hover:shadow-lg active:scale-95"
                  >
                    Book This Farmhouse
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
