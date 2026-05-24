"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  MapPin,
  Bed,
  Bath,
  Users,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  X,
  ChevronLeft,
  ChevronRight,
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

  // ── Lightbox State ─────────────────────────────────────
  const [lightboxFarmhouse, setLightboxFarmhouse] = useState<Farmhouse | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [interactionTrigger, setInteractionTrigger] = useState<number>(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

  // ── Lightbox Helpers ────────────────────────────────────
  const handleLightboxNext = useCallback(() => {
    if (!lightboxFarmhouse) return;
    setLightboxIndex((prev) =>
      prev === lightboxFarmhouse.images.length - 1 ? 0 : prev + 1
    );
  }, [lightboxFarmhouse]);

  const handleLightboxPrev = useCallback(() => {
    if (!lightboxFarmhouse) return;
    setLightboxIndex((prev) =>
      prev === 0 ? lightboxFarmhouse.images.length - 1 : prev - 1
    );
  }, [lightboxFarmhouse]);

  const goToLightboxIndex = (index: number) => {
    setLightboxIndex(index);
    setInteractionTrigger(Date.now());
  };

  const manualLightboxNext = () => {
    handleLightboxNext();
    setInteractionTrigger(Date.now());
  };

  const manualLightboxPrev = () => {
    handleLightboxPrev();
    setInteractionTrigger(Date.now());
  };

  // Lock body scroll when lightbox is active
  useEffect(() => {
    if (lightboxFarmhouse) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxFarmhouse]);

  // Lightbox Auto-swipe
  useEffect(() => {
    if (!lightboxFarmhouse) return;
    const timer = setInterval(() => {
      handleLightboxNext();
    }, 3000);
    return () => clearInterval(timer);
  }, [lightboxFarmhouse, interactionTrigger, handleLightboxNext]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxFarmhouse) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxFarmhouse(null);
      } else if (e.key === "ArrowRight") {
        manualLightboxNext();
      } else if (e.key === "ArrowLeft") {
        manualLightboxPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxFarmhouse, lightboxIndex]);

  // ── Mobile Swipe Handlers ────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      handleLightboxNext();
      setInteractionTrigger(Date.now());
    } else if (distance < -minSwipeDistance) {
      handleLightboxPrev();
      setInteractionTrigger(Date.now());
    }
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
                  onImageClick={(index) => {
                    setLightboxFarmhouse(farm);
                    setLightboxIndex(index);
                    setInteractionTrigger(Date.now());
                  }}
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

      {/* ── Premium Lightbox Overlay ──────────────────────── */}
      {lightboxFarmhouse && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
          onClick={() => setLightboxFarmhouse(null)} // Click outside to close
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxFarmhouse(null)}
            className="absolute top-4 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-200 active:scale-90"
            aria-label="Close image preview"
            onClickCapture={(e) => {
              e.stopPropagation();
              setLightboxFarmhouse(null);
            }}
          >
            <X size={24} />
          </button>

          {/* Central image presentation stage */}
          <div
            className="relative flex h-[70vh] w-full max-w-5xl items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Stop propagation to prevent closing
          >
            {/* Left Manual Swiper */}
            <button
              onClick={manualLightboxPrev}
              className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-200 sm:left-4 active:scale-90"
              aria-label="Previous photo"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Image Viewer Container */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl transition-all duration-300"
            >
              <Image
                src={lightboxFarmhouse.images[lightboxIndex]}
                alt={`${lightboxFarmhouse.name} - Fullscreen view ${lightboxIndex + 1}`}
                fill
                className="object-contain select-none pointer-events-none"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
                unoptimized={true}
              />
            </div>

            {/* Right Manual Swiper */}
            <button
              onClick={manualLightboxNext}
              className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-200 sm:right-4 active:scale-90"
              aria-label="Next photo"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Bottom Indicators & Thumbnails panel */}
          <div
            className="mt-6 flex flex-col items-center justify-center gap-3 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold text-neutral-300 backdrop-blur-md">
              {lightboxIndex + 1} / {lightboxFarmhouse.images.length}
            </div>

            <div className="flex max-w-[90vw] gap-2 overflow-x-auto p-1.5 scrollbar-thin">
              {lightboxFarmhouse.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => goToLightboxIndex(idx)}
                  className={`relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg transition-all duration-200 ${
                    idx === lightboxIndex
                      ? "ring-2 ring-amber-500 scale-105 opacity-100"
                      : "opacity-45 hover:opacity-75"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                    unoptimized={true}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
