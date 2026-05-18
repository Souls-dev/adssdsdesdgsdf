"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import ThemeCustomizer from "@/components/ThemeCustomizer";
import WebsiteThemeSwitcher from "@/components/WebsiteThemeSwitcher";
import type { HeroTheme, ColorTheme } from "@/components/WebsiteThemeSwitcher";
import HeroSection from "@/components/sections/HeroSection";
import PackagesSection from "@/components/sections/PackagesSection";
import ServicesSection from "@/components/sections/ServicesSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  const [selectedFarmhouse, setSelectedFarmhouse] = useState("");
  const [heroTheme, setHeroTheme] = useState<HeroTheme>("theme1");
  const [colorTheme, setColorTheme] = useState<ColorTheme>("gold");

  const handleBookFarmhouse = (farmhouseId: string) => {
    setSelectedFarmhouse(farmhouseId);
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <HeroSection theme={heroTheme} />
        <PackagesSection onBookFarmhouse={handleBookFarmhouse} />
        <ServicesSection />
        <AboutSection />
        <ContactSection
          selectedFarmhouse={selectedFarmhouse}
          onFarmhouseChange={setSelectedFarmhouse}
        />
      </main>
      <Footer />
      <WhatsAppFAB />
      <WebsiteThemeSwitcher
        heroTheme={heroTheme}
        onHeroThemeChange={setHeroTheme}
        colorTheme={colorTheme}
        onColorThemeChange={setColorTheme}
      />
      <ThemeCustomizer />
    </>
  );
}
