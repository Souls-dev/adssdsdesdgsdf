import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
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

export const metadata: Metadata = {
  title: "Al Jannat Farmhouse | Premium Farmhouse Rentals in Pakistan",
  description:
    "Discover Al Jannat — Pakistan's finest farmhouse rental experience. Book luxury farmhouses in Islamabad, Lahore, Multan & Murree for weddings, events, and family getaways.",
  keywords: [
    "farmhouse rental Pakistan",
    "luxury farmhouse Islamabad",
    "farmhouse booking Lahore",
    "Al Jannat farmhouse",
    "event venue Pakistan",
    "wedding venue farmhouse",
    "farmhouse Murree",
    "corporate retreat Pakistan",
  ],
  openGraph: {
    title: "Al Jannat Farmhouse | Premium Farmhouse Rentals in Pakistan",
    description:
      "Book luxury farmhouses across Pakistan for weddings, events, and unforgettable family getaways.",
    type: "website",
    locale: "en_PK",
    siteName: "Al Jannat Farmhouse",
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
