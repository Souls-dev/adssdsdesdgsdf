"use client";

import { useState } from "react";
import {
  MapPin,
  Bed,
  Bath,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { FARMHOUSES } from "@/data/farmhouses";
import ImageCarousel from "@/components/ImageCarousel";

interface PackagesSectionProps {
  onBookFarmhouse: (farmhouseId: string) => void;
}

function formatPrice(price: number): string {
  return price.toLocaleString("en-PK");
}

export default function PackagesSection({
  onBookFarmhouse,
}: PackagesSectionProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <section
      id="packages"
      className="relative py-16 sm:py-20 lg:py-24"
      style={{ backgroundColor: "#fffbeb" }}
    >
      {/* Decorative top gradient */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#321204]/5 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 text-center sm:mb-16">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#b45309]">
            Our Collection
          </p>
          <h2
            className="mb-4 text-3xl font-bold text-[#451a03] sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Luxury Farmhouses
          </h2>
          <p className="mx-auto max-w-2xl text-base text-[#78350f]/70 sm:text-lg">
            Handpicked properties across Karachi, each offering a unique blend
            of comfort, entertainment, and natural beauty.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {FARMHOUSES.map((farm) => (
            <div
              key={farm.id}
              className="group overflow-hidden rounded-2xl border border-[#92400e]/10 bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1"
            >
              {/* Image carousel */}
              <div className="relative">
                <ImageCarousel
                  images={farm.images}
                  alt={farm.name}
                  fallbackName={farm.name}
                />
                {/* Weekend surcharge badge */}
                {farm.weekendSurcharge > 0 && (
                  <div className="absolute right-3 top-3 z-20 rounded-full bg-[#92400e]/90 px-3 py-1 text-xs font-semibold text-[#fef3c7] backdrop-blur-sm">
                    +PKR {formatPrice(farm.weekendSurcharge)} weekends
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                {/* Name + Location */}
                <h3
                  className="mb-1 text-xl font-bold text-[#451a03] sm:text-2xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {farm.name}
                </h3>
                <div className="mb-3 flex items-center gap-1 text-sm text-[#78350f]/60">
                  <MapPin size={14} />
                  {farm.location}
                </div>

                {/* Short description */}
                <p className="line-clamp-2 mb-4 text-sm leading-relaxed text-[#78350f]/70">
                  {farm.shortDescription}
                </p>

                {/* Price */}
                <div className="mb-4">
                  <span
                    className="text-2xl font-bold text-[#b45309]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    PKR {formatPrice(farm.pricePerNight)}
                  </span>
                  <span className="ml-1 text-sm text-[#78350f]/50">
                    / night
                  </span>
                </div>

                {/* Stats row */}
                <div className="mb-4 flex items-center gap-4 text-sm text-[#78350f]/70">
                  <div className="flex items-center gap-1.5">
                    <Bed size={16} className="text-[#b45309]" />
                    <span>{farm.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bath size={16} className="text-[#b45309]" />
                    <span>{farm.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={16} className="text-[#b45309]" />
                    <span>Up to {farm.maxGuests}</span>
                  </div>
                </div>

                {/* Top 4 amenities */}
                <div className="mb-5 flex flex-wrap gap-2">
                  {farm.amenities.slice(0, 4).map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-medium text-[#92400e]"
                    >
                      {amenity}
                    </span>
                  ))}
                  {farm.amenities.length > 4 && (
                    <span className="rounded-full bg-[#fef3c7]/50 px-3 py-1 text-xs font-medium text-[#92400e]/60">
                      +{farm.amenities.length - 4} more
                    </span>
                  )}
                </div>

                {/* Expanded details */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedCard === farm.id
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="mb-5 rounded-xl bg-[#fef3c7]/50 p-4">
                    <p className="mb-3 text-sm leading-relaxed text-[#78350f]/80">
                      {farm.fullDescription}
                    </p>
                    <h4 className="mb-2 text-sm font-semibold text-[#451a03]">
                      All Amenities:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {farm.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-full bg-[#b45309]/10 px-2.5 py-0.5 text-xs text-[#92400e]"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 rounded-lg bg-white/60 p-3">
                      <h4 className="mb-1 text-sm font-semibold text-[#451a03]">
                        Pricing
                      </h4>
                      <p className="text-sm text-[#78350f]/70">
                        Weekday: PKR {formatPrice(farm.pricePerNight)} / night
                      </p>
                      {farm.weekendSurcharge > 0 && (
                        <p className="text-sm text-[#78350f]/70">
                          Weekend: PKR{" "}
                          {formatPrice(
                            farm.pricePerNight + farm.weekendSurcharge
                          )}{" "}
                          / night (+PKR {formatPrice(farm.weekendSurcharge)}{" "}
                          surcharge)
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => toggleExpand(farm.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-[#b45309]/20 px-4 py-2.5 text-sm font-semibold text-[#b45309] transition-all duration-200 hover:border-[#b45309] hover:bg-[#b45309]/5"
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
                    className="flex-1 rounded-xl bg-[#b45309] px-4 py-2.5 text-sm font-semibold text-[#fef3c7] shadow-md transition-all duration-200 hover:bg-[#92400e] hover:shadow-lg active:scale-95"
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
