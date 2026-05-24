import { supabase } from "./supabase";

export type SiteSettings = {
  theme: {
    activeColorPreset: string;
    customColors: Record<string, string>;
    heroTheme: string;
    logoUrl: string;
    loaderStyle?: string;
  };
  hero: {
    badgeText: string;
    headline: string;
    headlineAccent: string;
    subheadline: string;
    ctaPrimary: { text: string; href: string };
    ctaSecondary: { text: string; href: string };
    stats: { value: string; label: string }[];
    videoUrl: string;
    slides: string[];
  };
  sections: {
    packages: {
      subtitle: string;
      title: string;
      description: string;
    };
    services: {
      subtitle: string;
      title: string;
      description: string;
      amenitiesTitle: string;
      coreServices: { title: string; description: string }[];
      amenities: { title: string; description: string }[];
    };
    about: {
      subtitle: string;
      title: string;
      heading: string;
      paragraphs: string[];
      promiseTitle: string;
      promiseText: string;
      valuesTitle: string;
      values: { title: string; description: string }[];
      stats: { value: string; label: string }[];
    };
    contact: {
      subtitle: string;
      title: string;
      description: string;
      timingOptions: { label: string; time: string }[];
    };
  };
  footer: {
    brandDescription: string;
    phone1: string;
    phone1Href: string;
    phone2: string;
    phone2Href: string;
    whatsapp: string;
    whatsappHref: string;
    email: string;
    address: string;
    instagram: string;
    facebook: string;
    copyright: string;
  };
  meta: {
    lastModified: string;
    modifiedBy: string;
  };
};

/** Hardcoded factory defaults — used for reset */
const DEFAULT_SETTINGS: SiteSettings = {
  theme: { activeColorPreset: "gold", customColors: {}, heroTheme: "theme1", logoUrl: "/logo/al-jannat-logo.png", loaderStyle: "monogram" },
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
      { value: "24/7", label: "Dedicated Support" },
    ],
    videoUrl: "",
    slides: ["/hero-slides/1.jpg", "/hero-slides/2.jpg", "/hero-slides/3.jpg", "/hero-slides/4.jpg", "/hero-slides/5.jpg"],
  },
  sections: {
    packages: { subtitle: "Our Collection", title: "Luxury Farmhouses", description: "Handpicked properties across Karachi, each offering a unique blend of comfort, entertainment, and natural beauty." },
    services: {
      subtitle: "What We Offer",
      title: "A Complete One-Roof Solution",
      description: "With over three decades of experience, we manage everything from booking to facilities — delivering peace of mind every step of the way.",
      amenitiesTitle: "Signature Amenities",
      coreServices: [
        { title: "Farmhouse Booking", description: "Seamless end-to-end booking for premium farmhouses across Karachi." },
        { title: "Farmhouse Management", description: "Complete property management solutions — renovations, electrical maintenance, swimming pool upkeep." },
        { title: "Food & Beverages", description: "Authentic Pakistani cuisine prepared by professional chefs." },
        { title: "Transportation", description: "Door-to-door luxury transport services for your entire group." },
        { title: "Event Management", description: "Full-scale event coordination for weddings, corporate retreats, family reunions." },
      ],
      amenities: [
        { title: "Private Pools", description: "Crystal-clear swimming pools with temperature control, poolside loungers." },
        { title: "Generator Backup", description: "Uninterrupted power supply with automatic generator switchover." },
        { title: "24/7 Security", description: "Round-the-clock trained security staff, CCTV monitoring." },
      ],
    },
    about: {
      subtitle: "Who We Are",
      title: "About Al Jannat",
      heading: "32 Years of Unmatched Hospitality",
      paragraphs: [
        "Since 1994, Al Jannat Farmhouse Booking Agency has helped families and businesses host successful events.",
        "We started small and gradually expanded our network to include some of the most reliable properties in Karachi.",
      ],
      promiseTitle: "Our Promise",
      promiseText: "Your trust is our biggest asset. We offer a 100% refund on valid cancellations and only partner with verified property owners.",
      valuesTitle: "Our Core Values",
      values: [
        { title: "Relationship", description: "We believe in straightforward, honest communication." },
        { title: "Trust", description: "For over 30 years, we have kept our promises." },
        { title: "Spirit of Service", description: "Service is at the core of our business." },
      ],
      stats: [
        { value: "32+", label: "Years of Legacy" },
        { value: "10,000+", label: "Happy Customers" },
        { value: "40+", label: "Premium Farmhouses" },
        { value: "24/7", label: "Dedicated Support" },
      ],
    },
    contact: { 
      subtitle: "Get In Touch", 
      title: "Book Your Stay", 
      description: "Fill out the form below and our team will get back to you within 24 hours to confirm your booking.",
      timingOptions: [
        { label: "Morning to Morning", time: "22 Hours" },
        { label: "Night to Evening", time: "20 Hours" },
        { label: "Only Night", time: "10 Hours" },
        { label: "Morning to Evening", time: "9 Hours" }
      ]
    },
  },
  footer: {
    brandDescription: "Pakistan's most trusted farmhouse booking agency with over 32 years of legacy. Delivering premium booking solutions and unforgettable experiences since 1994.",
    phone1: "021-3454 8555", phone1Href: "tel:02134548555",
    phone2: "021-3454 4996", phone2Href: "tel:02134544996",
    whatsapp: "0333-227-2020 (WhatsApp)", whatsappHref: "https://wa.me/+923332272020",
    email: "info@aljannatfarms.com",
    address: "Office Z-53, Near Ideal Bakery, Block 7/8, Hill Park, Karachi",
    instagram: "https://www.instagram.com/aljannatfarmhousebooking",
    facebook: "https://www.facebook.com/share/g/1B9TwRuyhP/",
    copyright: "Al Jannat Farmhouse Booking Agency. All rights reserved.",
  },
  meta: { lastModified: "", modifiedBy: "system" },
};

/** Deep merge: fills in any missing keys from defaults */
function deepMerge(target: any, source: any): any {
  const result = { ...source };
  for (const key of Object.keys(target)) {
    if (result[key] === undefined || result[key] === null) {
      result[key] = target[key];
    } else if (typeof target[key] === "object" && !Array.isArray(target[key]) && target[key] !== null && typeof result[key] === "object" && !Array.isArray(result[key])) {
      result[key] = deepMerge(target[key], result[key]);
    }
  }
  return result;
}

/** Read settings from Supabase */
export async function readSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("data")
    .eq("id", "default")
    .single();
  if (error || !data) {
    console.error("Failed to read settings, using defaults:", error);
    return structuredClone(DEFAULT_SETTINGS);
  }
  // Merge with defaults to fill any missing fields
  return deepMerge(DEFAULT_SETTINGS, data.data) as SiteSettings;
}

/** Write settings to Supabase */
export async function writeSettings(settings: SiteSettings): Promise<void> {
  settings.meta.lastModified = new Date().toISOString();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: "default", data: settings, updated_at: new Date().toISOString() });
  if (error) {
    throw new Error(error.message);
  }
}

/** Get hardcoded factory defaults */
export function getDefaultSettings(): SiteSettings {
  return structuredClone(DEFAULT_SETTINGS);
}

/** Reset settings to factory defaults in Supabase */
export async function resetSettings(): Promise<SiteSettings> {
  const defaults = getDefaultSettings();
  defaults.meta.lastModified = new Date().toISOString();
  defaults.meta.modifiedBy = "reset";
  await writeSettings(defaults);
  return defaults;
}

// ── Preview Theme ────────────────────────────────────────────

export type PreviewTheme = {
  preset: string;
  customColors: Record<string, string>;
  expiresAt: string; // ISO timestamp
};

/** Read active preview theme (returns null if expired or not set) */
export async function readPreviewTheme(): Promise<PreviewTheme | null> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("preview_theme")
    .eq("id", "default")
    .single();

  if (error || !data || !data.preview_theme) return null;

  const preview = data.preview_theme as PreviewTheme;
  // Check expiry
  if (new Date(preview.expiresAt) < new Date()) {
    // Expired — clear it
    await clearPreviewTheme();
    return null;
  }
  return preview;
}

/** Set a temporary preview theme (with expiry in minutes) */
export async function setPreviewTheme(
  preset: string,
  customColors: Record<string, string>,
  durationMinutes: number = 5
): Promise<PreviewTheme> {
  const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();
  const preview: PreviewTheme = { preset, customColors, expiresAt };

  const { error } = await supabase
    .from("site_settings")
    .update({ preview_theme: preview })
    .eq("id", "default");

  if (error) throw new Error(error.message);
  return preview;
}

/** Clear the preview theme (revert to permanent) */
export async function clearPreviewTheme(): Promise<void> {
  const { error } = await supabase
    .from("site_settings")
    .update({ preview_theme: null })
    .eq("id", "default");

  if (error) throw new Error(error.message);
}

/** Make the current preview theme permanent */
export async function makePreviewPermanent(): Promise<SiteSettings> {
  const preview = await readPreviewTheme();
  if (!preview) throw new Error("No active preview theme to make permanent");

  const settings = await readSettings();
  settings.theme.activeColorPreset = preview.preset;
  settings.theme.customColors = preview.customColors;
  settings.meta.modifiedBy = "admin-theme-confirm";
  await writeSettings(settings);
  await clearPreviewTheme();
  return settings;
}
