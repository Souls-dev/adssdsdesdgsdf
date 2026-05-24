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
import LoadingScreen from "@/components/LoadingScreen";
import { applyTheme } from "@/lib/theme-utils";

interface HomeClientProps {
  initialSettings: any;
}

export default function HomeClient({ initialSettings }: HomeClientProps) {
  const [selectedFarmhouse, setSelectedFarmhouse] = useState("");
  const [settings, setSettings] = useState<any>(initialSettings);
  const [showLoader, setShowLoader] = useState(true);
  const [isLoaderExiting, setIsLoaderExiting] = useState(false);

  // Apply color theme dynamically on load (immediately in render before paint)
  if (typeof window !== "undefined" && settings?.theme) {
    if (settings.theme.activeColorPreset) {
      applyTheme(settings.theme.activeColorPreset);
    }
    if (settings.theme.customColors && typeof settings.theme.customColors === "object") {
      const root = document.documentElement;
      Object.entries(settings.theme.customColors).forEach(([key, value]) => {
        if (typeof value === "string" && key.startsWith("--color-")) {
          root.style.setProperty(key, value);
        }
      });
    }
  }

  useEffect(() => {
    const startTime = Date.now();
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error("Failed to load site settings", err);
      } finally {
        const elapsedTime = Date.now() - startTime;
        const minimumDuration = 2200; // 2.2 seconds to allow animations to fully play
        const remainingDelay = Math.max(0, minimumDuration - elapsedTime);

        setTimeout(() => {
          setIsLoaderExiting(true);
          setTimeout(() => {
            setShowLoader(false);
          }, 1300); // 1.3 seconds buffer for 1.2s CSS transition
        }, remainingDelay);
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

  const activeSettings = settings || initialSettings;

  return (
    <>
      {showLoader && (
        <LoadingScreen
          style={activeSettings.theme.loaderStyle || "monogram"}
          exiting={isLoaderExiting}
        />
      )}
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
