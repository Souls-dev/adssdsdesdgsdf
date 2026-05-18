"use client";

import { useState } from "react";
import {
  MapPin,
  Bed,
  Bath,
  Users,
  ChevronDown,
  ChevronUp,
  MessageCircle,
} from "lucide-react";
import { FARMHOUSES } from "@/data/farmhouses";
import ImageCarousel from "@/components/ImageCarousel";

interface PackagesSectionProps {
  onBookFarmhouse: (farmhouseId: string) => void;
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
      className="relative py-16 sm:py-20 lg:py-24 bg-cream-50"
    >
      {/* Decorative top gradient */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brown-900/5 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 text-center sm:mb-16">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-amber-700">
            Our Collection
          </p>
          <h2
            className="mb-4 text-3xl font-bold text-brown-800 sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Luxury Farmhouses
          </h2>
          <p className="mx-auto max-w-2xl text-base text-amber-900/70 sm:text-lg">
            Handpicked properties across Karachi, each offering a unique blend
            of comfort, entertainment, and natural beauty.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {FARMHOUSES.map((farm) => (
            <div
              key={farm.id}
              className="group overflow-hidden rounded-2xl border border-amber-800/10 bg-white shadow-sm transition-shadow duration-200 hover:shadow-lg"
            >
              {/* Image carousel */}
              <div className="relative">
                <ImageCarousel
                  images={farm.images}
                  alt={farm.name}
                  fallbackName={farm.name}
                />

              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                {/* Name + Location */}
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

                {/* Short description */}
                <p className="line-clamp-2 mb-4 text-sm leading-relaxed text-amber-900/70">
                  {farm.shortDescription}
                </p>

                {/* Contact for Pricing */}
                <div className="mb-4 flex items-center gap-2">
                  <a
                    href="https://wa.me/+923332272020"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/10 px-3.5 py-1.5 text-sm font-semibold text-[#25D366] transition-all duration-200 hover:bg-[#25D366]/20"
                  >
                    <MessageCircle size={14} />
                    Contact for Pricing
                  </a>
                </div>

                {/* Stats row */}
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

                {/* Top 4 amenities */}
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

                {/* Expanded details */}
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
                    <div className="mt-3 rounded-lg bg-[#25D366]/5 border border-[#25D366]/20 p-3">
                      <p className="text-sm font-medium text-amber-900/80">
                        💬 Contact us on WhatsApp for the latest rates and seasonal offers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
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
