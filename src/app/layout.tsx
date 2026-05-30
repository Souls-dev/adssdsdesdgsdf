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
    title: "Al Jannat Farmhouse | Premium Farmhouse Rentals & Event Venues in Pakistan",
    description:
      "Book premium, luxury farmhouses in Karachi, Islamabad, Lahore, Multan, and Murree. Over 32 years of legacy in event management, weddings, corporate retreats, and family picnics.",
    keywords: [
      "Al Jannat Farmhouse",
      "Al Jannat Farmhouse Karachi",
      "farmhouse rental Pakistan",
      "luxury farmhouse Islamabad",
      "farmhouse booking Lahore",
      "best farmhouse in karachi for picnic",
      "farmhouses in Karachi with swimming pool",
      "wedding venue farmhouse Pakistan",
      "corporate event venue Karachi",
      "luxury farmhouses Pakistan",
      "farmhouse Murree booking",
      "Al Jannat farms contact number",
      "picnic spots Karachi",
      "farmhouse rentals Multan"
    ],
    alternates: {
      canonical: "https://aljannatfarms.com",
    },
    openGraph: {
      title: "Al Jannat Farmhouse | Premium Farmhouse Rentals & Event Venues in Pakistan",
      description:
        "Experience Pakistan's most premium luxury farmhouses. Perfect for weddings, events, family picnics, and corporate retreats with 24/7 power backup and private pools.",
      url: "https://aljannatfarms.com",
      type: "website",
      locale: "en_PK",
      siteName: "Al Jannat Farmhouse",
      images: [
        {
          url: "/logo/al-jannat-logo.png",
          width: 1200,
          height: 630,
          alt: "Al Jannat Farmhouse Booking Agency"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: "Al Jannat Farmhouse | Premium Farmhouse Rentals & Event Venues in Pakistan",
      description: "Book luxury farmhouses across Pakistan with private pools, robust security, and full catering. Over 30 years of hospitality legacy.",
      images: ["/logo/al-jannat-logo.png"],
    },
    icons: {
      icon: [
        { url: faviconUrl, type: faviconUrl.endsWith(".ico") ? "image/x-icon" : "image/svg+xml" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
      ],
      other: [
        {
          rel: "mask-icon",
          url: "/logo/favicon-cropped.png",
        }
      ]
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
        {/* Strip fdprocessedid (browser extension artifact) before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var p=Element.prototype.setAttribute;Element.prototype.setAttribute=function(n,v){if(n==='fdprocessedid')return;p.call(this,n,v)};document.querySelectorAll('[fdprocessedid]').forEach(function(e){e.removeAttribute('fdprocessedid')});new MutationObserver(function(m){m.forEach(function(r){if(r.type==='attributes'&&r.attributeName==='fdprocessedid'){r.target.removeAttribute('fdprocessedid')}})}).observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:['fdprocessedid']})})()`
          }}
        />
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
