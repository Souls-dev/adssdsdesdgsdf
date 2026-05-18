"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Pipette, X, RotateCcw, Copy, Check } from "lucide-react";

// ── Every CSS custom property the website uses ────────────────
// Organized by visual category for the agency to easily find what to change
const COLOR_GROUPS = [
  {
    label: "Brand / Accent Colors",
    description: "Main buttons, links, highlights",
    vars: [
      { key: "--color-primary", label: "Primary" },
      { key: "--color-primary-hover", label: "Primary Hover" },
      { key: "--color-primary-light", label: "Primary Light" },
    ],
  },
  {
    label: "Page Backgrounds",
    description: "Section backgrounds & surfaces",
    vars: [
      { key: "--color-surface", label: "Main Background" },
      { key: "--color-surface-warm", label: "Warm Background" },
      { key: "--color-surface-alt", label: "Alt Background" },
      { key: "--color-cream-50", label: "Light Cream (sections)" },
      { key: "--color-cream-100", label: "Medium Cream (cards)" },
      { key: "--color-cream-200", label: "Cream Accent" },
      { key: "--color-cream-300", label: "Gold Cream (badges)" },
    ],
  },
  {
    label: "Text Colors",
    description: "Headings, body text, light text",
    vars: [
      { key: "--color-text-primary", label: "Heading Text" },
      { key: "--color-text-secondary", label: "Body Text" },
      { key: "--color-text-light", label: "Light / On-dark Text" },
    ],
  },
  {
    label: "Amber / Gold Tones",
    description: "Buttons, tags, accents, icons",
    vars: [
      { key: "--color-amber-500", label: "Amber 500 (bright)" },
      { key: "--color-amber-600", label: "Amber 600" },
      { key: "--color-amber-700", label: "Amber 700 (buttons)" },
      { key: "--color-amber-800", label: "Amber 800 (hover)" },
      { key: "--color-amber-900", label: "Amber 900 (dark)" },
    ],
  },
  {
    label: "Dark Tones (Navbar, Footer, Hero)",
    description: "Navbar, footer, hero overlays",
    vars: [
      { key: "--color-brown-800", label: "Brown 800 (navbar)" },
      { key: "--color-brown-850", label: "Brown 850" },
      { key: "--color-brown-900", label: "Brown 900 (footer)" },
      { key: "--color-brown-950", label: "Brown 950 (darkest)" },
    ],
  },
  {
    label: "Green / Forest Tones",
    description: "Green accents, gradients, highlights",
    vars: [
      { key: "--color-forest-600", label: "Forest 600" },
      { key: "--color-forest-700", label: "Forest 700" },
      { key: "--color-forest-750", label: "Forest 750" },
      { key: "--color-forest-800", label: "Forest 800" },
      { key: "--color-forest-900", label: "Forest 900" },
      { key: "--color-forest-950", label: "Forest 950" },
    ],
  },
];

// Flatten all var keys for quick lookup
const ALL_VAR_KEYS = COLOR_GROUPS.flatMap((g) => g.vars.map((v) => v.key));

// Read the actual computed value from the root element
function getComputedVar(key: string): string {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(key)
    .trim();
  // Convert rgb(r, g, b) to hex if needed
  if (raw.startsWith("rgb")) {
    const match = raw.match(/(\d+)/g);
    if (match && match.length >= 3) {
      return (
        "#" +
        match
          .slice(0, 3)
          .map((n) => parseInt(n).toString(16).padStart(2, "0"))
          .join("")
      );
    }
  }
  return raw || "#000000";
}

export default function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [colors, setColors] = useState<Record<string, string>>({});
  const [defaults, setDefaults] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const initialized = useRef(false);

  // Read defaults on mount (before any overrides)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const initial: Record<string, string> = {};
    ALL_VAR_KEYS.forEach((key) => {
      initial[key] = getComputedVar(key);
    });
    setDefaults(initial);
    setColors(initial);
  }, []);

  // Apply colors to DOM whenever they change
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      if (value) root.style.setProperty(key, value);
    });
  }, [colors]);

  const handleColorChange = useCallback((key: string, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetAll = useCallback(() => {
    setColors({ ...defaults });
    const root = document.documentElement;
    Object.entries(defaults).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [defaults]);

  const resetSingle = useCallback(
    (key: string) => {
      if (defaults[key]) {
        handleColorChange(key, defaults[key]);
      }
    },
    [defaults, handleColorChange]
  );

  // Build the palette export string
  const buildPaletteString = useCallback((): string => {
    let result = "=== AL JANNAT COLOR PALETTE ===\n\n";
    COLOR_GROUPS.forEach((group) => {
      result += `${group.label}\n`;
      group.vars.forEach((v) => {
        const val = colors[v.key] || "#000000";
        result += `  ${v.label}: ${val.toUpperCase()}\n`;
      });
      result += "\n";
    });
    result += "===============================\n";
    return result;
  }, [colors]);

  const copyPalette = useCallback(async () => {
    const text = buildPaletteString();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [buildPaletteString]);

  return (
    <>
      {/* Toggle button — left side */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-1/2 z-[100] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white/70 shadow-2xl backdrop-blur-md border border-white/10 transition-all duration-300 hover:bg-black/70 hover:text-white hover:scale-110"
        title="Open Color Customizer"
        aria-label="Toggle color customizer"
      >
        <Pipette size={18} />
      </button>

      {/* Panel */}
      <div
        className={`fixed left-0 top-0 z-[200] flex h-full w-[340px] flex-col bg-[#1a1a2e]/95 text-white shadow-2xl backdrop-blur-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h3 className="text-sm font-bold tracking-wide">
              Color Customizer
            </h3>
            <p className="mt-0.5 text-[10px] text-white/40">
              Change any color → Copy palette
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetAll}
              className="flex h-7 items-center gap-1 rounded-md bg-white/10 px-2 text-[10px] font-medium text-white/60 transition hover:bg-white/20 hover:text-white"
              title="Reset all colors to defaults"
            >
              <RotateCcw size={12} />
              Reset
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-white/50 transition hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable color groups */}
        <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin">
          {COLOR_GROUPS.map((group) => (
            <div key={group.label} className="mb-5">
              <h4 className="text-xs font-bold text-white/80">
                {group.label}
              </h4>
              <p className="mb-2 text-[10px] text-white/30">
                {group.description}
              </p>
              <div className="space-y-1.5">
                {group.vars.map((v) => (
                  <div
                    key={v.key}
                    className="group flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-white/5"
                  >
                    {/* Color swatch + picker */}
                    <div className="relative">
                      <div
                        className="h-7 w-7 rounded-md border border-white/20 shadow-inner cursor-pointer"
                        style={{ backgroundColor: colors[v.key] || "#000" }}
                      />
                      <input
                        type="color"
                        value={colors[v.key] || "#000000"}
                        onChange={(e) =>
                          handleColorChange(v.key, e.target.value)
                        }
                        className="absolute inset-0 h-7 w-7 cursor-pointer opacity-0"
                        title={`Pick color for ${v.label}`}
                      />
                    </div>

                    {/* Label + hex */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-white/70 truncate">
                        {v.label}
                      </p>
                      <p className="text-[9px] font-mono text-white/30">
                        {(colors[v.key] || "").toUpperCase()}
                      </p>
                    </div>

                    {/* Reset single */}
                    {colors[v.key] !== defaults[v.key] && (
                      <button
                        onClick={() => resetSingle(v.key)}
                        className="flex h-5 w-5 items-center justify-center rounded text-white/30 opacity-0 transition group-hover:opacity-100 hover:bg-white/10 hover:text-white"
                        title="Reset to default"
                      >
                        <RotateCcw size={10} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer — Copy Palette */}
        <div className="border-t border-white/10 px-5 py-4">
          <button
            onClick={copyPalette}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
              copied
                ? "bg-green-500/20 text-green-400"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {copied ? (
              <>
                <Check size={16} />
                Palette Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy Color Palette
              </>
            )}
          </button>
          <p className="mt-2 text-center text-[9px] text-white/30">
            Copy to apply permanently
          </p>
        </div>
      </div>

      {/* Overlay when open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[199] bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
