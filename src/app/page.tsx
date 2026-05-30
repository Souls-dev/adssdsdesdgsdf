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

  // Heavy SEO - Rich JSON-LD Structured Data
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "@id": "https://aljannatfarms.com/#agency",
      "name": "Al Jannat Farmhouse Booking Agency",
      "alternateName": "Al Jannat Farms",
      "description": "Pakistan's most trusted farmhouse booking agency since 1994. Rent luxury farmhouses with private pools, generator backup, security, and full catering in Karachi, Islamabad, Lahore, Multan, and Murree.",
      "url": "https://aljannatfarms.com",
      "logo": "https://aljannatfarms.com/logo/al-jannat-logo.png",
      "image": "https://aljannatfarms.com/logo/al-jannat-logo.png",
      "telephone": "+922134548555",
      "email": "info@aljannatfarms.com",
      "priceRange": "$$",
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
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      },
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
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I book a premium farmhouse with Al Jannat?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Booking is easy and secure. Simply browse our premium farmhouse listings, select your preferred dates, and submit the booking request form on our website. You can also contact our team directly via WhatsApp at +92 333 227 2020 for instant assistance."
          }
        },
        {
          "@type": "Question",
          "name": "Are the swimming pools at Al Jannat farmhouses private and clean?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, absolutely. All Al Jannat farmhouses feature 100% private, temperature-controlled swimming pools that are thoroughly cleaned and filtered before every reservation to ensure absolute hygiene."
          }
        },
        {
          "@type": "Question",
          "name": "Do your farmhouses have standby generators during load shedding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, every premium farmhouse listed in our booking catalog features an automated heavy-duty standby generator with fully managed fuel supplies to guarantee an uninterrupted 24/7 power supply."
          }
        },
        {
          "@type": "Question",
          "name": "What locations in Pakistan do you operate in?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Al Jannat operates nationwide across Pakistan. We offer luxury farmhouse rentals and event venue bookings in Karachi, Islamabad, Lahore, Multan, and Murree."
          }
        }
      ]
    }
  ];

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
