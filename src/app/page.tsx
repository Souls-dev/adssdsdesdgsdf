"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import HeroSection from "@/components/sections/HeroSection";
import PackagesSection from "@/components/sections/PackagesSection";
import ServicesSection from "@/components/sections/ServicesSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import { applyTheme } from "@/lib/theme-utils";

export default function Home() {
  const [selectedFarmhouse, setSelectedFarmhouse] = useState("");
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
          // Apply color theme dynamically on load
          if (data?.theme?.activeColorPreset) {
            applyTheme(data.theme.activeColorPreset);
          }
          // Apply custom color overrides on top of preset
          if (data?.theme?.customColors && typeof data.theme.customColors === "object") {
            const root = document.documentElement;
            Object.entries(data.theme.customColors).forEach(([key, value]) => {
              if (typeof value === "string" && key.startsWith("--color-")) {
                root.style.setProperty(key, value);
              }
            });
          }
        }
      } catch (err) {
        console.error("Failed to load site settings", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleBookFarmhouse = (farmhouseId: string) => {
    setSelectedFarmhouse(farmhouseId);
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-amber-500 font-bold">
        <div className="animate-pulse">Loading Al Jannat...</div>
      </div>
    );
  }

  // Fallback if settings didn't load properly (for safety)
  const activeSettings = settings || {
    theme: { heroTheme: "theme1", activeColorPreset: "gold", logoUrl: "/logo/al-jannat-logo.png" },
    hero: {
      badgeText: "32+ Years of Excellence",
      headline: "Welcome to",
      headlineAccent: "Al Jannat",
      subheadline: "Pakistan's most trusted farmhouse booking agency — delivering premium solutions and property management since 1994. Where every stay becomes an unforgettable memory.",
      ctaPrimary: { text: "Explore Farmhouses", href: "#packages" },
      ctaSecondary: { text: "Book Now", href: "#contact" },
      stats: [
        { value: "10,000+", label: "Happy Customers" },
        { value: "40+", label: "Premium Venues" },
        { value: "24/7", label: "Dedicated Support" }
      ],
      videoUrl: "",
      slides: []
    },
    sections: {
      packages: { subtitle: "Our Collection", title: "Luxury Farmhouses", description: "Handpicked properties across Karachi, each offering a unique blend of comfort, entertainment, and natural beauty." },
      services: { subtitle: "What We Offer", title: "A Complete One-Roof Solution", description: "With over three decades of experience, we manage everything from booking to facilities — delivering peace of mind every step of the way.", amenitiesTitle: "Signature Amenities", coreServices: [], amenities: [] },
      about: { subtitle: "Who We Are", title: "About Al Jannat", heading: "32 Years of Unmatched Hospitality", paragraphs: ["", ""], promiseTitle: "", promiseText: "", valuesTitle: "", values: [], stats: [] },
      contact: { subtitle: "Get In Touch", title: "Book Your Stay", description: "Fill out the form below and our team will get back to you within 24 hours to confirm your booking.", timingOptions: [] }
    },
    footer: { brandDescription: "", phone1: "", phone1Href: "", phone2: "", phone2Href: "", whatsapp: "", whatsappHref: "", email: "", address: "", instagram: "", facebook: "", copyright: "" }
  };

  return (
    <>
      <Navbar logoUrl={activeSettings.theme.logoUrl} />
      <main>
        <HeroSection theme={activeSettings.theme.heroTheme} settings={activeSettings.hero} />
        <PackagesSection onBookFarmhouse={handleBookFarmhouse} settings={activeSettings.sections.packages} />
        <ServicesSection settings={activeSettings.sections.services} />
        <AboutSection settings={activeSettings.sections.about} />
        <ContactSection
          selectedFarmhouse={selectedFarmhouse}
          onFarmhouseChange={setSelectedFarmhouse}
          settings={activeSettings.sections.contact}
        />
      </main>
      <Footer settings={activeSettings.footer} />
      <WhatsAppFAB settings={activeSettings.footer} />
    </>
  );
}
