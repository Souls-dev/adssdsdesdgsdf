"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  fallbackName: string;
}

export default function ImageCarousel({ images, alt, fallbackName }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const handleImageError = useCallback((index: number) => {
    setFailedImages((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  // Filter to only working images
  const workingImages = images.filter((_, i) => !failedImages.has(i));
  const allFailed = workingImages.length === 0;
  const totalSlides = allFailed ? 1 : images.length;
  const safeIndex = currentIndex >= totalSlides ? 0 : currentIndex;

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goPrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    },
    [totalSlides]
  );

  const goNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    },
    [totalSlides]
  );

  return (
    <div className="group/carousel relative h-52 w-full overflow-hidden sm:h-60">
      {/* Branded fallback — conditionally rendered */}
      {allFailed ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#92400e] to-[#14532d]">
          <div className="text-center">
            <Star className="mx-auto mb-2 text-[#fcd34d]" size={32} />
            <p
              className="text-lg font-semibold text-[#fef3c7]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {fallbackName}
            </p>
            <p className="mt-1 text-xs text-[#fef3c7]/60">
              Photo coming soon
            </p>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-neutral-800" />
      )}

      {/* Image slides */}
      {images.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-500 ease-in-out"
          style={{
            opacity: index === safeIndex && !failedImages.has(index) ? 1 : 0,
            pointerEvents: index === safeIndex ? "auto" : "none",
          }}
        >
          <Image
            src={src}
            alt={`${alt} - Photo ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => handleImageError(index)}
          />
        </div>
      ))}

      {/* Left/Right arrows — only when multiple images work */}
      {!allFailed && totalSlides > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#451a03] shadow-md opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110 group-hover/carousel:opacity-100"
            aria-label="Previous photo"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#451a03] shadow-md opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110 group-hover/carousel:opacity-100"
            aria-label="Next photo"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {!allFailed && totalSlides > 1 && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goTo(index);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === safeIndex
                  ? "w-4 bg-white shadow-sm"
                  : "w-1.5 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image counter badge */}
      {!allFailed && totalSlides > 1 && (
        <div className="absolute left-3 top-3 z-10 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {safeIndex + 1} / {totalSlides}
        </div>
      )}
    </div>
  );
}
