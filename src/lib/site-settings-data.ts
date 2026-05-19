import fs from "fs";
import path from "path";

const SETTINGS_PATH = path.join(process.cwd(), "src", "data", "site-settings.json");

export type SiteSettings = {
  theme: {
    activeColorPreset: string;
    customColors: Record<string, string>;
    heroTheme: string;
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

// Deep clone helper
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Cache default settings on first read
let defaultSnapshot: SiteSettings | null = null;

export function readSettings(): SiteSettings {
  const raw = fs.readFileSync(SETTINGS_PATH, "utf-8");
  return JSON.parse(raw) as SiteSettings;
}

export function writeSettings(data: SiteSettings): void {
  data.meta.lastModified = new Date().toISOString();
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function getDefaultSettings(): SiteSettings {
  if (!defaultSnapshot) {
    // First call — snapshot what's on disk right now as the "factory" defaults
    defaultSnapshot = deepClone(readSettings());
  }
  return deepClone(defaultSnapshot);
}

export function resetSettings(): SiteSettings {
  const defaults = getDefaultSettings();
  defaults.meta.lastModified = new Date().toISOString();
  defaults.meta.modifiedBy = "reset";
  writeSettings(defaults);
  return defaults;
}
