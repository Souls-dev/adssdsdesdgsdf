"use client";

import { useEffect } from "react";
import { Palette, Paintbrush } from "lucide-react";

// ── Hero layout themes (existing) ────────────────────────────
export type HeroTheme = "theme1" | "theme2" | "theme3";

// ── Website color themes ─────────────────────────────────────
export type ColorTheme = "gold" | "green" | "red" | "blue" | "yellow";

type ColorOverrides = Record<string, string>;

const COLOR_THEMES: Record<
  ColorTheme,
  { label: string; preview: string; overrides: ColorOverrides }
> = {
  gold: {
    label: "Gold",
    preview: "from-amber-600 to-amber-800",
    overrides: {}, // Default — no overrides needed
  },
  green: {
    label: "Green",
    preview: "from-emerald-500 to-emerald-800",
    overrides: {
      "--color-cream-50": "#ecfdf5",
      "--color-cream-100": "#d1fae5",
      "--color-cream-200": "#a7f3d0",
      "--color-cream-300": "#6ee7b7",
      "--color-amber-500": "#10b981",
      "--color-amber-600": "#059669",
      "--color-amber-700": "#047857",
      "--color-amber-800": "#065f46",
      "--color-amber-900": "#064e3b",
      "--color-brown-800": "#022c22",
      "--color-brown-850": "#01201a",
      "--color-brown-900": "#011a14",
      "--color-brown-950": "#010f0c",
      "--color-forest-600": "#047857",
      "--color-forest-700": "#059669",
      "--color-forest-750": "#047857",
      "--color-forest-800": "#065f46",
      "--color-forest-900": "#064e3b",
      "--color-forest-950": "#022c22",
      "--color-primary": "#047857",
      "--color-primary-hover": "#065f46",
      "--color-primary-light": "#d1fae5",
      "--color-surface": "#ecfdf5",
      "--color-surface-warm": "#d1fae5",
      "--color-surface-alt": "#f0fdf9",
      "--color-text-primary": "#022c22",
      "--color-text-secondary": "#064e3b",
      "--color-text-light": "#d1fae5",
    },
  },
  red: {
    label: "Red",
    preview: "from-rose-500 to-rose-800",
    overrides: {
      "--color-cream-50": "#fff1f2",
      "--color-cream-100": "#ffe4e6",
      "--color-cream-200": "#fecdd3",
      "--color-cream-300": "#fda4af",
      "--color-amber-500": "#f43f5e",
      "--color-amber-600": "#e11d48",
      "--color-amber-700": "#be123c",
      "--color-amber-800": "#9f1239",
      "--color-amber-900": "#881337",
      "--color-brown-800": "#4c0519",
      "--color-brown-850": "#3a0412",
      "--color-brown-900": "#2d030e",
      "--color-brown-950": "#1a0208",
      "--color-forest-600": "#be123c",
      "--color-forest-700": "#e11d48",
      "--color-forest-750": "#be123c",
      "--color-forest-800": "#9f1239",
      "--color-forest-900": "#881337",
      "--color-forest-950": "#4c0519",
      "--color-primary": "#be123c",
      "--color-primary-hover": "#9f1239",
      "--color-primary-light": "#ffe4e6",
      "--color-surface": "#fff1f2",
      "--color-surface-warm": "#ffe4e6",
      "--color-surface-alt": "#fef7f7",
      "--color-text-primary": "#4c0519",
      "--color-text-secondary": "#881337",
      "--color-text-light": "#ffe4e6",
    },
  },
  blue: {
    label: "Blue",
    preview: "from-blue-500 to-blue-800",
    overrides: {
      "--color-cream-50": "#eff6ff",
      "--color-cream-100": "#dbeafe",
      "--color-cream-200": "#bfdbfe",
      "--color-cream-300": "#93c5fd",
      "--color-amber-500": "#3b82f6",
      "--color-amber-600": "#2563eb",
      "--color-amber-700": "#1d4ed8",
      "--color-amber-800": "#1e40af",
      "--color-amber-900": "#1e3a8a",
      "--color-brown-800": "#172554",
      "--color-brown-850": "#0f1a3d",
      "--color-brown-900": "#0c1533",
      "--color-brown-950": "#060d1f",
      "--color-forest-600": "#1d4ed8",
      "--color-forest-700": "#2563eb",
      "--color-forest-750": "#1d4ed8",
      "--color-forest-800": "#1e40af",
      "--color-forest-900": "#1e3a8a",
      "--color-forest-950": "#172554",
      "--color-primary": "#1d4ed8",
      "--color-primary-hover": "#1e40af",
      "--color-primary-light": "#dbeafe",
      "--color-surface": "#eff6ff",
      "--color-surface-warm": "#dbeafe",
      "--color-surface-alt": "#f5f8ff",
      "--color-text-primary": "#172554",
      "--color-text-secondary": "#1e3a8a",
      "--color-text-light": "#dbeafe",
    },
  },
  yellow: {
    label: "Yellow",
    preview: "from-yellow-400 to-yellow-700",
    overrides: {
      "--color-cream-50": "#fefce8",
      "--color-cream-100": "#fef9c3",
      "--color-cream-200": "#fef08a",
      "--color-cream-300": "#fde047",
      "--color-amber-500": "#eab308",
      "--color-amber-600": "#ca8a04",
      "--color-amber-700": "#a16207",
      "--color-amber-800": "#854d0e",
      "--color-amber-900": "#713f12",
      "--color-brown-800": "#422006",
      "--color-brown-850": "#2e1604",
      "--color-brown-900": "#231103",
      "--color-brown-950": "#150b02",
      "--color-forest-600": "#a16207",
      "--color-forest-700": "#ca8a04",
      "--color-forest-750": "#a16207",
      "--color-forest-800": "#854d0e",
      "--color-forest-900": "#713f12",
      "--color-forest-950": "#422006",
      "--color-primary": "#a16207",
      "--color-primary-hover": "#854d0e",
      "--color-primary-light": "#fef9c3",
      "--color-surface": "#fefce8",
      "--color-surface-warm": "#fef9c3",
      "--color-surface-alt": "#fefdf5",
      "--color-text-primary": "#422006",
      "--color-text-secondary": "#713f12",
      "--color-text-light": "#fef9c3",
    },
  },
};

// ── Default CSS values (gold theme) to restore on reset ──────
const DEFAULT_CSS_VARS: ColorOverrides = {
  "--color-cream-50": "#fffbeb",
  "--color-cream-100": "#fef3c7",
  "--color-cream-200": "#fde68a",
  "--color-cream-300": "#fcd34d",
  "--color-amber-500": "#f59e0b",
  "--color-amber-600": "#d97706",
  "--color-amber-700": "#b45309",
  "--color-amber-800": "#92400e",
  "--color-amber-900": "#78350f",
  "--color-brown-800": "#451a03",
  "--color-brown-850": "#291304",
  "--color-brown-900": "#321204",
  "--color-brown-950": "#1a0a03",
  "--color-forest-600": "#166534",
  "--color-forest-700": "#15803d",
  "--color-forest-750": "#0f4a24",
  "--color-forest-800": "#14532d",
  "--color-forest-900": "#0f3d21",
  "--color-forest-950": "#0a1a03",
  "--color-primary": "#b45309",
  "--color-primary-hover": "#92400e",
  "--color-primary-light": "#fef3c7",
  "--color-surface": "#fffbeb",
  "--color-surface-warm": "#fef3c7",
  "--color-surface-alt": "#FDFBF7",
  "--color-text-primary": "#451a03",
  "--color-text-secondary": "#78350f",
  "--color-text-light": "#fef3c7",
};

interface Props {
  heroTheme: HeroTheme;
  onHeroThemeChange: (t: HeroTheme) => void;
  colorTheme: ColorTheme;
  onColorThemeChange: (t: ColorTheme) => void;
}

export default function WebsiteThemeSwitcher({
  heroTheme,
  onHeroThemeChange,
  colorTheme,
  onColorThemeChange,
}: Props) {
  // Apply color overrides whenever colorTheme changes
  useEffect(() => {
    const root = document.documentElement;
    const theme = COLOR_THEMES[colorTheme];

    if (colorTheme === "gold") {
      // Restore defaults
      Object.entries(DEFAULT_CSS_VARS).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    } else {
      Object.entries(theme.overrides).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }
  }, [colorTheme]);

  return (
    <div className="fixed right-4 top-1/2 z-[100] flex -translate-y-1/2 flex-col items-center gap-1 rounded-2xl bg-black/50 p-2 backdrop-blur-md shadow-2xl border border-white/10">
      {/* Hero Layout Section */}
      <div className="mb-1 text-white/50">
        <Palette size={14} />
      </div>
      {(["theme1", "theme2", "theme3"] as const).map((t, i) => (
        <button
          key={t}
          onClick={() => onHeroThemeChange(t)}
          className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold shadow-lg transition-all duration-300 ${
            heroTheme === t
              ? "bg-gradient-to-r from-cream-300 to-amber-500 text-brown-800 scale-110"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
          }`}
          title={
            i === 0
              ? "Theme 1: Video Placeholder"
              : i === 1
              ? "Theme 2: Classic Gradient"
              : "Theme 3: Sliding Images"
          }
        >
          T{i + 1}
        </button>
      ))}

      {/* Divider */}
      <div className="my-1 h-px w-6 bg-white/20" />

      {/* Website Color Section */}
      <div className="mb-1 text-white/50">
        <Paintbrush size={14} />
      </div>
      {(["gold", "green", "red", "blue", "yellow"] as const).map((t, i) => (
        <button
          key={t}
          onClick={() => onColorThemeChange(t)}
          className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold shadow-lg transition-all duration-300 ${
            colorTheme === t
              ? "scale-110 ring-2 ring-white/60"
              : "hover:scale-105"
          }`}
          style={{
            background:
              t === "gold"
                ? "linear-gradient(135deg, #b45309, #92400e)"
                : t === "green"
                ? "linear-gradient(135deg, #10b981, #065f46)"
                : t === "red"
                ? "linear-gradient(135deg, #f43f5e, #9f1239)"
                : t === "blue"
                ? "linear-gradient(135deg, #3b82f6, #1e40af)"
                : "linear-gradient(135deg, #eab308, #a16207)",
          }}
          title={`Color Theme: ${COLOR_THEMES[t].label}`}
        >
          <span className="text-white/90 drop-shadow-sm">C{i + 1}</span>
        </button>
      ))}
    </div>
  );
}
