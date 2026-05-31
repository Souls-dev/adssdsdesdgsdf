import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { readSettings } from "@/lib/site-settings-data";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl = "/favicon.ico";
  try {
    const settings = await readSettings();
    // If the admin has configured a custom favicon, point to our dynamic SVG route
    if (settings.theme.faviconUrl) {
      faviconUrl = "/api/favicon";
    }
  } catch {
    // Fallback silently to static favicon
  }

  return {
    metadataBase: new URL("https://aljannatfarms.com"),
    title: {
      default: "Al Jannat Farmhouse | Luxury Rentals Karachi",
      template: "%s | Al Jannat Farmhouse",
    },
    description:
      "Book luxury farmhouses in Karachi with private pools, 24/7 generator backup & security. Pakistan's trusted booking agency since 1994. 40+ premium venues.",
    keywords: [
      "Al Jannat Farmhouse",
      "Al Jannat Farmhouse Karachi",
      "Al Jannat Farms",
      "al jannat farmhouse booking agency",
      "al jannat farmhouse contact number",
      "farmhouse in karachi",
      "best farmhouse in karachi for picnic",
      "farmhouses in karachi with swimming pool",
      "luxury farmhouse rental karachi",
      "farmhouse booking karachi",
      "farmhouse for wedding in karachi",
      "corporate retreat farmhouses karachi",
      "farmhouse rates in karachi 2026",
      "cheap farmhouse in karachi for day picnic",
      "overnight stay farmhouse karachi",
      "farmhouse catering services karachi",
      "casa de fazenda farmhouse booking",
      "shayan farmhouse karachi booking",
      "green paradise resort booking",
      "farmhouse rental Pakistan",
      "luxury farmhouse Islamabad",
      "farmhouse booking Lahore",
      "wedding venue farmhouse Pakistan",
      "corporate event venue Karachi",
      "luxury farmhouses Pakistan",
      "farmhouse Murree booking",
      "picnic spots Karachi",
      "farmhouse rentals Multan",
      "farmhouse booking office hill park",
      "how to book farmhouse in karachi",
    ],
    alternates: {
      canonical: "https://aljannatfarms.com",
    },
    openGraph: {
      title: "Al Jannat Farmhouse | Luxury Rentals & Event Venues Karachi",
      description:
        "40+ premium farmhouses with private pools, generator backup & 24/7 security. Trusted by 10,000+ families since 1994. Book weddings, picnics & corporate retreats.",
      url: "https://aljannatfarms.com",
      type: "website",
      locale: "en_PK",
      siteName: "Al Jannat Farmhouse Booking Agency",
      images: [
        {
          url: "/logo/al-jannat-logo.png",
          width: 1200,
          height: 630,
          alt: "Al Jannat Farmhouse — Pakistan's Premier Farmhouse Booking Agency Since 1994",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Al Jannat Farmhouse | Luxury Rentals Karachi",
      description:
        "40+ luxury farmhouses in Karachi with private pools & full catering. Over 32 years of trusted hospitality. Book now via WhatsApp.",
      images: ["/logo/al-jannat-logo.png"],
      creator: "@aljannatfarms",
    },
    icons: {
      icon: [
        { url: "/favicon.ico?v=2", type: "image/x-icon" },
        { url: "/favicon-16x16.png?v=2", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png?v=2", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        {
          url: "/apple-touch-icon.png?v=2",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    // Uncomment and add your Google Search Console verification code:
    // verification: {
    //   google: "YOUR_GOOGLE_VERIFICATION_CODE",
    // },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#451a03",
              color: "#fef3c7",
              borderRadius: "12px",
              fontSize: "14px",
              fontFamily: "var(--font-body)",
            },
            success: {
              iconTheme: {
                primary: "#166534",
                secondary: "#fef3c7",
              },
            },
            error: {
              iconTheme: {
                primary: "#dc2626",
                secondary: "#fef3c7",
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
