import { readSettings, readPreviewTheme } from "@/lib/site-settings-data";
import HomeClient from "@/components/HomeClient";

// Force page to re-evaluate on each request so theme previews and customizer saves are live instantly
export const dynamic = "force-dynamic";

export default async function Home() {
  const settings = await readSettings();
  const preview = await readPreviewTheme();

  // If there's an active theme preview, inject it onto the settings
  if (preview) {
    settings.theme.activeColorPreset = preview.preset;
    settings.theme.customColors = preview.customColors;
  }

  // Heavy SEO - Rich JSON-LD Structured Data (@graph for maximum SERP coverage)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // ── 1. WebSite Schema: Enables Google Sitelinks Search Box ──
      {
        "@type": "WebSite",
        "@id": "https://aljannatfarms.com/#website",
        "url": "https://aljannatfarms.com",
        "name": "Al Jannat Farmhouse Booking Agency",
        "alternateName": "Al Jannat Farms",
        "description": "Pakistan's most trusted farmhouse booking agency since 1994.",
        "publisher": { "@id": "https://aljannatfarms.com/#agency" },
        "inLanguage": "en-PK",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://aljannatfarms.com/?s={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      // ── 2. TravelAgency / LocalBusiness: Core Organization Schema ──
      {
        "@type": ["TravelAgency", "LocalBusiness"],
        "@id": "https://aljannatfarms.com/#agency",
        "name": "Al Jannat Farmhouse Booking Agency",
        "alternateName": ["Al Jannat Farms", "Al Jannat", "Al Jannat Farmhouse"],
        "description": "Pakistan's most trusted farmhouse booking agency since 1994. Rent luxury farmhouses with private pools, generator backup, security, and full catering in Karachi, Islamabad, Lahore, Multan, and Murree.",
        "url": "https://aljannatfarms.com",
        "logo": {
          "@type": "ImageObject",
          "@id": "https://aljannatfarms.com/#logo",
          "url": "https://aljannatfarms.com/logo/al-jannat-logo.png",
          "contentUrl": "https://aljannatfarms.com/logo/al-jannat-logo.png",
          "caption": "Al Jannat Farmhouse Booking Agency Logo"
        },
        "image": "https://aljannatfarms.com/logo/al-jannat-logo.png",
        "telephone": ["+922134548555", "+922134544996"],
        "email": "info@aljannatfarms.com",
        "priceRange": "PKR 15,000 - PKR 40,000",
        "currenciesAccepted": "PKR",
        "paymentAccepted": "Cash, Bank Transfer",
        "foundingDate": "1994",
        "numberOfEmployees": { "@type": "QuantitativeValue", "minValue": 10 },
        "slogan": "Where every stay becomes an unforgettable memory",
        "knowsAbout": [
          "Farmhouse Booking",
          "Event Management",
          "Property Management",
          "Wedding Venues",
          "Corporate Retreats",
          "Family Picnics Karachi"
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Luxury Farmhouse Rentals",
          "itemListElement": [
            {
              "@type": "OfferCatalog",
              "name": "Premium Farmhouses",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "LodgingBusiness",
                    "name": "Casa De Fazenda",
                    "description": "Portuguese-inspired luxury farmhouse with 3 pools, outdoor dining for 40 guests"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "LodgingBusiness",
                    "name": "Green Paradise Resort",
                    "description": "Tropical resort with cabana seating, multiple pools, and event lawns"
                  }
                }
              ]
            }
          ]
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Office Z-53, Near Ideal Bakery, Block 7/8, Hill Park",
          "addressLocality": "Karachi",
          "addressRegion": "Sindh",
          "postalCode": "75480",
          "addressCountry": "PK"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 24.8718,
          "longitude": 67.0694
        },
        "areaServed": [
          { "@type": "City", "name": "Karachi" },
          { "@type": "City", "name": "Islamabad" },
          { "@type": "City", "name": "Lahore" },
          { "@type": "City", "name": "Multan" },
          { "@type": "City", "name": "Murree" }
        ],
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:00",
            "closes": "21:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Sunday",
            "opens": "10:00",
            "closes": "18:00"
          }
        ],
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+922134548555",
            "contactType": "reservations",
            "areaServed": "PK",
            "availableLanguage": ["English", "Urdu"]
          },
          {
            "@type": "ContactPoint",
            "telephone": "+923332272020",
            "contactType": "customer service",
            "areaServed": "PK",
            "availableLanguage": ["English", "Urdu"],
            "contactOption": "TollFree"
          }
        ],
        "sameAs": [
          "https://www.facebook.com/share/g/1B9TwRuyhP/",
          "https://www.instagram.com/aljannatfarmhousebooking"
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "1428",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      // ── 3. BreadcrumbList: Helps Google create visual breadcrumbs ──
      {
        "@type": "BreadcrumbList",
        "@id": "https://aljannatfarms.com/#breadcrumb",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://aljannatfarms.com" },
          { "@type": "ListItem", "position": 2, "name": "Luxury Farmhouses", "item": "https://aljannatfarms.com/#packages" },
          { "@type": "ListItem", "position": 3, "name": "Services", "item": "https://aljannatfarms.com/#services" },
          { "@type": "ListItem", "position": 4, "name": "About Us", "item": "https://aljannatfarms.com/#about" },
          { "@type": "ListItem", "position": 5, "name": "Book Now", "item": "https://aljannatfarms.com/#contact" }
        ]
      },
      // ── 4. ItemList: Featured Farmhouses for rich SERP carousels ──
      {
        "@type": "ItemList",
        "@id": "https://aljannatfarms.com/#farmhouse-list",
        "name": "Premium Farmhouses in Karachi",
        "description": "Browse 40+ luxury farmhouse rentals with private pools, BBQ, security, and generator backup.",
        "numberOfItems": 15,
        "itemListOrder": "https://schema.org/ItemListOrderDescending",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "LodgingBusiness",
              "name": "Casa De Fazenda",
              "description": "Portuguese-inspired luxury farmhouse with 3 swimming pools, outdoor dining for 40 guests, and cricket ground in Karachi.",
              "address": { "@type": "PostalAddress", "addressLocality": "Karachi", "addressCountry": "PK" },
              "amenityFeature": [
                { "@type": "LocationFeatureSpecification", "name": "3 Swimming Pools", "value": true },
                { "@type": "LocationFeatureSpecification", "name": "Generator Backup", "value": true },
                { "@type": "LocationFeatureSpecification", "name": "24/7 Security", "value": true }
              ]
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@type": "LodgingBusiness",
              "name": "Green Paradise Resort",
              "description": "Tropical resort with cabana seating, multiple swimming pools, BBQ stations, and premium event coordination in Karachi.",
              "address": { "@type": "PostalAddress", "addressLocality": "Karachi", "addressCountry": "PK" }
            }
          },
          {
            "@type": "ListItem",
            "position": 3,
            "item": {
              "@type": "LodgingBusiness",
              "name": "Luminious Farm House",
              "description": "Modern farmhouse with 2 adult swimming pools, AC gaming room, and contemporary interiors in Karachi.",
              "address": { "@type": "PostalAddress", "addressLocality": "Karachi", "addressCountry": "PK" }
            }
          },
          {
            "@type": "ListItem",
            "position": 4,
            "item": {
              "@type": "LodgingBusiness",
              "name": "Shayan Phase 1",
              "description": "Flagship family farmhouse with dual pools, cricket ground, and lush green gardens in Karachi.",
              "address": { "@type": "PostalAddress", "addressLocality": "Karachi", "addressCountry": "PK" }
            }
          },
          {
            "@type": "ListItem",
            "position": 5,
            "item": {
              "@type": "LodgingBusiness",
              "name": "Holiday Farmhouse",
              "description": "Complete family retreat with 3 bedrooms, dual pools, baithak, and dedicated cricket ground in Karachi.",
              "address": { "@type": "PostalAddress", "addressLocality": "Karachi", "addressCountry": "PK" }
            }
          }
        ]
      },
      // ── 5. FAQPage: Expanded for more SERP FAQ snippets ──
      {
        "@type": "FAQPage",
        "@id": "https://aljannatfarms.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I book a farmhouse with Al Jannat in Karachi?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Booking is easy and secure. Browse our premium farmhouse listings, select your preferred dates, and submit the booking form on our website. You can also contact us directly via WhatsApp at +92 333 227 2020 or call our office at 021-3454 8555 for instant assistance."
            }
          },
          {
            "@type": "Question",
            "name": "Are the swimming pools at Al Jannat farmhouses private and clean?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, absolutely. All Al Jannat farmhouses feature 100% private swimming pools that are thoroughly cleaned and filtered before every reservation to ensure absolute hygiene and safety for all guests."
            }
          },
          {
            "@type": "Question",
            "name": "Do your farmhouses have standby generators during load shedding?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, every premium farmhouse listed in our catalog features an automated heavy-duty standby generator with fully managed fuel supplies to guarantee uninterrupted 24/7 power supply throughout your stay."
            }
          },
          {
            "@type": "Question",
            "name": "What locations in Pakistan does Al Jannat operate in?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Al Jannat operates nationwide across Pakistan with luxury farmhouse rentals and event venue bookings in Karachi, Islamabad, Lahore, Multan, and Murree. Our main office is located at Hill Park, Karachi."
            }
          },
          {
            "@type": "Question",
            "name": "What is the cheapest farmhouse in Karachi for a day picnic?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Al Jannat offers budget-friendly farmhouses starting from PKR 15,000 per day, such as Sardar Farm House. These properties include swimming pools, BBQ areas, cricket grounds, generator backup, and 24/7 security — ideal for family picnics and day events."
            }
          },
          {
            "@type": "Question",
            "name": "Can I book a farmhouse for a wedding or corporate event?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely. Al Jannat provides full-scale event management for weddings, corporate retreats, family reunions, and celebrations. We handle décor, entertainment, catering, and logistics — all under one roof. Premium venues like Casa De Fazenda accommodate up to 40 guests with outdoor dining."
            }
          },
          {
            "@type": "Question",
            "name": "What is Al Jannat's cancellation and refund policy?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Al Jannat offers a 100% refund on valid cancellations. We only partner with verified property owners and our team is always on call. Contact us via WhatsApp at +92 333 227 2020 for cancellation queries."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HomeClient initialSettings={settings} />
    </>
  );
}
