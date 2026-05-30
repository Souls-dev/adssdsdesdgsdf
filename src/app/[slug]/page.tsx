import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FARMHOUSES, type FarmhouseType } from "@/data/farmhouses";
import {
  MapPin, Bed, Bath, Users, Shield, Zap, Waves,
  TreePine, MessageCircle, ChevronRight, Star, Phone,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   STATIC GENERATION — Pre-render every farmhouse at build
   ═══════════════════════════════════════════════════════════ */
export function generateStaticParams() {
  return FARMHOUSES.map((f) => ({ slug: f.id }));
}

/* ═══════════════════════════════════════════════════════════
   DYNAMIC METADATA — SEO-optimised per farmhouse
   ═══════════════════════════════════════════════════════════ */
function getFarmhouse(slug: string): FarmhouseType | undefined {
  return FARMHOUSES.find((f) => f.id === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const farm = getFarmhouse(slug);
  if (!farm) return {};

  const title = `${farm.name} — Book in Karachi | Al Jannat`.slice(0, 60);
  const description =
    `Book ${farm.name} in Karachi with pool, generator & security. ${farm.bedrooms} beds, up to ${farm.maxGuests} guests. Trusted since 1994.`.slice(
      0,
      155
    );

  return {
    title,
    description,
    alternates: {
      canonical: `https://aljannatfarms.com/${farm.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://aljannatfarms.com/${farm.id}`,
      type: "website",
      locale: "en_PK",
      siteName: "Al Jannat Farmhouse Booking Agency",
      images: [
        {
          url: farm.coverImage,
          width: 1200,
          height: 630,
          alt: `${farm.name} — Al Jannat Farmhouse Karachi`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [farm.coverImage],
    },
  };
}

/* ═══════════════════════════════════════════════════════════
   AMENITY ICON MAPPER
   ═══════════════════════════════════════════════════════════ */
const AMENITY_ICONS: Record<string, React.ReactNode> = {
  pool: <Waves size={16} className="text-amber-700" />,
  generator: <Zap size={16} className="text-amber-700" />,
  security: <Shield size={16} className="text-amber-700" />,
  garden: <TreePine size={16} className="text-amber-700" />,
};

function getAmenityIcon(amenity: string) {
  const lower = amenity.toLowerCase();
  if (lower.includes("pool") || lower.includes("swim")) return AMENITY_ICONS.pool;
  if (lower.includes("generator")) return AMENITY_ICONS.generator;
  if (lower.includes("security") || lower.includes("guard")) return AMENITY_ICONS.security;
  if (lower.includes("garden") || lower.includes("green")) return AMENITY_ICONS.garden;
  return <ChevronRight size={14} className="text-amber-600" />;
}

/* ═══════════════════════════════════════════════════════════
   LOCALIZED COPY GENERATOR (250+ words, keyword-rich)
   ═══════════════════════════════════════════════════════════ */
function generateLocalizedCopy(farm: FarmhouseType): string {
  const hasPool = farm.amenities.some((a) =>
    a.toLowerCase().includes("pool") || a.toLowerCase().includes("swim")
  );
  const hasGen = farm.amenities.some((a) =>
    a.toLowerCase().includes("generator")
  );
  const hasSecurity = farm.amenities.some((a) =>
    a.toLowerCase().includes("security") || a.toLowerCase().includes("guard")
  );
  const hasCricket = farm.amenities.some((a) =>
    a.toLowerCase().includes("cricket")
  );
  const hasKids = farm.amenities.some((a) =>
    a.toLowerCase().includes("kids") || a.toLowerCase().includes("slide")
  );
  const hasAC = farm.amenities.some((a) =>
    a.toLowerCase().includes("air conditioning") || a.toLowerCase().includes("ac")
  );
  const hasBBQ = farm.amenities.some((a) =>
    a.toLowerCase().includes("bbq") || a.toLowerCase().includes("bonfire")
  );

  return `Discover ${farm.name}, one of Karachi's most sought-after luxury farmhouses available for booking through Al Jannat Farmhouse Booking Agency — Pakistan's most trusted name in premium farmhouse rentals since 1994. Nestled in a prime location within Karachi, this exceptional property offers ${farm.bedrooms} beautifully appointed bedrooms and ${farm.bathrooms} well-maintained bathrooms, comfortably hosting up to ${farm.maxGuests} guests for any occasion.

${hasPool ? `Whether you are planning a refreshing day picnic or an overnight stay, ${farm.name} features a stunning farmhouse with swimming pool that promises hours of enjoyment for both adults and children alike. The crystal-clear pools are thoroughly cleaned and maintained before every booking to ensure a safe, hygienic experience for your entire family.` : `${farm.name} offers expansive outdoor spaces and lush green lawns, perfect for a memorable day picnic or a relaxing night stay experience. The beautifully landscaped grounds provide an idyllic setting for families and friends to gather and create lasting memories.`}

${hasGen ? `Uninterrupted power is guaranteed with a heavy-duty standby generator that provides seamless backup throughout your stay — no load shedding worries, no disruptions.` : ""} ${hasSecurity ? `Your safety is our top priority. The property is situated within a secured gated community with 24/7 professional security personnel and a dedicated caretaker on-site at all times.` : ""}

${hasCricket ? `Sports enthusiasts will love the full-size cricket ground, perfect for friendly matches and team-building activities.` : ""} ${hasKids ? `For younger guests, a dedicated kids playing area with slides and safe play zones ensures children stay entertained throughout the event.` : ""} ${hasAC ? `All premium rooms are fully air-conditioned, providing cool comfort even during Karachi's hottest months.` : ""} ${hasBBQ ? `The property features dedicated BBQ and bonfire areas, ideal for evening cookouts under the stars.` : ""}

${farm.name} is the ideal venue for family picnics, birthday celebrations, engagement ceremonies, mehndi functions, corporate retreats, and intimate wedding gatherings in Karachi. Every booking includes a fully equipped kitchen, ample car parking, and professional on-site support from our experienced team. Al Jannat manages every detail so you can focus on making memories. Book your night stay picnic today and experience why over 10,000 families trust Al Jannat for their farmhouse bookings across Pakistan.`;
}

/* ═══════════════════════════════════════════════════════════
   JSON-LD STRUCTURED DATA
   ═══════════════════════════════════════════════════════════ */
function buildJsonLd(farm: FarmhouseType) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "EventVenue", "LodgingBusiness"],
        "@id": `https://aljannatfarms.com/${farm.id}#venue`,
        name: farm.name,
        description: farm.shortDescription,
        url: `https://aljannatfarms.com/${farm.id}`,
        image: `https://aljannatfarms.com${farm.coverImage}`,
        telephone: ["+922134548555", "+923332272020"],
        priceRange: `PKR ${farm.pricePerNight.toLocaleString()} - PKR ${(farm.pricePerNight + farm.weekendSurcharge).toLocaleString()}`,
        currenciesAccepted: "PKR",
        paymentAccepted: "Cash, Bank Transfer",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Karachi",
          addressRegion: "Sindh",
          addressCountry: "PK",
        },
        geo: { "@type": "GeoCoordinates", latitude: 24.87, longitude: 67.07 },
        amenityFeature: farm.amenities.map((a) => ({
          "@type": "LocationFeatureSpecification",
          name: a,
          value: true,
        })),
        numberOfRooms: farm.bedrooms,
        maximumAttendeeCapacity: farm.maxGuests,
        isAccessibleForFree: false,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "120",
          bestRating: "5",
          worstRating: "1",
        },
        containedInPlace: {
          "@type": "TravelAgency",
          "@id": "https://aljannatfarms.com/#agency",
          name: "Al Jannat Farmhouse Booking Agency",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://aljannatfarms.com" },
          { "@type": "ListItem", position: 2, name: "Farmhouses", item: "https://aljannatfarms.com/#packages" },
          { "@type": "ListItem", position: 3, name: farm.name, item: `https://aljannatfarms.com/${farm.id}` },
        ],
      },
    ],
  };
}

/* ═══════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default async function FarmhousePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const farm = getFarmhouse(slug);
  if (!farm) notFound();

  const jsonLd = buildJsonLd(farm);
  const localizedCopy = generateLocalizedCopy(farm);
  const whatsappMsg = encodeURIComponent(
    `Hi Al Jannat! I'd like to book ${farm.name}. Please share availability & rates.`
  );
  const whatsappUrl = `https://wa.me/+923332272020?text=${whatsappMsg}`;

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden bg-brown-950">
        <div className="absolute inset-0">
          <Image
            src={farm.coverImage}
            alt={`${farm.name} — Premium Farmhouse in Karachi`}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brown-950 via-brown-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-brown-900/50 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-32 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 text-sm text-cream-100/60"
          >
            <Link
              href="/"
              className="transition-colors hover:text-cream-300"
            >
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-cream-300">{farm.name}</span>
          </nav>

          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
            <div className="flex gap-0.5 text-cream-300">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill="currentColor" />
              ))}
            </div>
            <span className="h-3 w-px bg-white/30" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white">
              Premium Venue
            </span>
          </div>

          <h1
            className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {farm.name}
          </h1>
          <div className="mt-3 flex items-center gap-2 text-cream-100/70">
            <MapPin size={16} />
            <span className="text-sm">{farm.location}</span>
          </div>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-cream-100/80 sm:text-lg">
            {farm.shortDescription}
          </p>
        </div>
      </section>

      {/* ── QUICK STATS BAR ──────────────────────────── */}
      <div className="border-b border-amber-800/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 py-5 sm:gap-10 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Bed size={20} className="text-amber-700" />
            <span className="text-sm font-semibold text-brown-800">
              {farm.bedrooms} Bedrooms
            </span>
          </div>
          <div className="h-6 w-px bg-amber-800/15 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Bath size={20} className="text-amber-700" />
            <span className="text-sm font-semibold text-brown-800">
              {farm.bathrooms} Bathrooms
            </span>
          </div>
          <div className="h-6 w-px bg-amber-800/15 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Users size={20} className="text-amber-700" />
            <span className="text-sm font-semibold text-brown-800">
              Up to {farm.maxGuests} Guests
            </span>
          </div>
          <div className="h-6 w-px bg-amber-800/15 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-amber-700" />
            <span className="text-sm font-semibold text-brown-800">
              24/7 Security
            </span>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────── */}
      <main className="bg-cream-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Left Column — Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* About */}
              <section>
                <h2
                  className="mb-4 text-2xl font-bold text-brown-800 sm:text-3xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  About {farm.name}
                </h2>
                <p className="text-sm leading-relaxed text-amber-900/80 sm:text-base">
                  {farm.fullDescription}
                </p>
              </section>

              {/* Amenities */}
              <section>
                <h2
                  className="mb-6 text-2xl font-bold text-brown-800 sm:text-3xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Amenities &amp; Features
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {farm.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 rounded-xl border border-amber-800/8 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md"
                    >
                      {getAmenityIcon(amenity)}
                      <span className="text-sm font-medium text-brown-800">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Localized Copy Block */}
              <section>
                <h2
                  className="mb-6 text-2xl font-bold text-brown-800 sm:text-3xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Location &amp; Directions
                </h2>
                <div className="rounded-2xl border border-amber-800/8 bg-white p-6 shadow-sm sm:p-8">
                  {localizedCopy.split("\n\n").filter(Boolean).map((para, i) => (
                    <p
                      key={i}
                      className="mb-4 text-sm leading-relaxed text-amber-900/75 last:mb-0 sm:text-base"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </section>

              {/* Image Gallery */}
              {farm.images.length > 1 && (
                <section>
                  <h2
                    className="mb-6 text-2xl font-bold text-brown-800 sm:text-3xl"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Photo Gallery
                  </h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {farm.images.map((img, i) => (
                      <div
                        key={i}
                        className="relative aspect-[4/3] overflow-hidden rounded-xl border border-amber-800/8 shadow-sm"
                      >
                        <Image
                          src={img}
                          alt={`${farm.name} photo ${i + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          sizes="(max-width: 640px) 50vw, 33vw"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Sidebar — Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Price Card */}
                <div className="overflow-hidden rounded-2xl border border-amber-800/10 bg-white shadow-lg">
                  <div className="bg-gradient-to-r from-amber-700 to-amber-800 px-6 py-5">
                    <p className="text-sm font-medium text-cream-100/80">
                      Starting from
                    </p>
                    <p
                      className="text-3xl font-bold text-white"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      PKR {farm.pricePerNight.toLocaleString()}
                    </p>
                    <p className="text-sm text-cream-100/60">per night</p>
                    {farm.weekendSurcharge > 0 && (
                      <p className="mt-1 text-xs text-cream-300">
                        +PKR {farm.weekendSurcharge.toLocaleString()} weekend
                        surcharge
                      </p>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    {/* WhatsApp CTA */}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-[#20bd5a] hover:shadow-lg active:scale-[0.98]"
                    >
                      <MessageCircle size={20} fill="white" />
                      Book via WhatsApp
                    </a>

                    {/* Phone CTA */}
                    <a
                      href="tel:+922134548555"
                      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-amber-700/20 px-6 py-3 text-sm font-semibold text-amber-700 transition-all duration-200 hover:border-amber-700 hover:bg-amber-700/5"
                    >
                      <Phone size={18} />
                      Call 021-3454 8555
                    </a>

                    <div className="rounded-lg bg-cream-100/50 p-3">
                      <p className="text-center text-xs text-amber-900/60">
                        100% Verified Property • Trusted Since 1994
                        <br />
                        Full Refund on Valid Cancellations
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="rounded-2xl border border-amber-800/10 bg-white p-6 shadow-sm">
                  <h3
                    className="mb-4 text-lg font-bold text-brown-800"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Pricing &amp; Availability
                  </h3>
                  <div className="space-y-3 text-sm text-amber-900/70">
                    <div className="flex justify-between">
                      <span>Weekday Rate</span>
                      <span className="font-semibold text-brown-800">
                        PKR {farm.pricePerNight.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-px bg-amber-800/8" />
                    <div className="flex justify-between">
                      <span>Weekend Rate</span>
                      <span className="font-semibold text-brown-800">
                        PKR{" "}
                        {(
                          farm.pricePerNight + farm.weekendSurcharge
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="h-px bg-amber-800/8" />
                    <div className="flex justify-between">
                      <span>Max Guests</span>
                      <span className="font-semibold text-brown-800">
                        {farm.maxGuests} persons
                      </span>
                    </div>
                    <div className="h-px bg-amber-800/8" />
                    <div className="flex justify-between">
                      <span>Status</span>
                      <span className="inline-flex items-center gap-1.5 font-semibold text-forest-600">
                        <span className="h-2 w-2 rounded-full bg-forest-600" />
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── BACK TO HOME FOOTER ──────────────────────── */}
      <section className="border-t border-amber-800/10 bg-cream-50">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 transition-colors duration-200 hover:text-amber-800"
          >
            ← View more luxury farmhouses in Karachi
          </Link>
        </div>
      </section>
    </>
  );
}
