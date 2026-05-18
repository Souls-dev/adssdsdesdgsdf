"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, RotateCcw, Pipette } from "lucide-react";

// ── Default color values (matching globals.css @theme) ──────────
const DEFAULT_COLORS: Record<string, string> = {
  "--color-primary": "#b45309",
  "--color-primary-hover": "#92400e",
  "--color-primary-light": "#fef3c7",
  "--color-surface": "#fffbeb",
  "--color-surface-warm": "#fef3c7",
  "--color-text-primary": "#451a03",
  "--color-text-secondary": "#78350f",
  "--color-text-light": "#fef3c7",
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
};

type ColorSlotGroup = {
  label: string;
  slots: { var: string; label: string }[];
};

// ── Grouped color slots for the panel ──────────────────────────
const GROUPS: ColorSlotGroup[] = [
  {
    label: "Brand Colors",
    slots: [
      { var: "--color-primary", label: "Primary Action" },
      { var: "--color-primary-hover", label: "Primary Hover" },
      { var: "--color-primary-light", label: "Primary Light" },
    ],
  },
  {
    label: "Background",
    slots: [
      { var: "--color-surface", label: "Page Background" },
      { var: "--color-surface-warm", label: "Card Background" },
    ],
  },
  {
    label: "Text Colors",
    slots: [
      { var: "--color-text-primary", label: "Heading Text" },
      { var: "--color-text-secondary", label: "Body Text" },
      { var: "--color-text-light", label: "Light Text" },
    ],
  },
  {
    label: "Gold / Amber",
    slots: [
      { var: "--color-cream-300", label: "Gold Accent" },
      { var: "--color-amber-500", label: "Amber 500" },
      { var: "--color-amber-600", label: "Amber 600" },
      { var: "--color-amber-700", label: "Amber 700" },
      { var: "--color-amber-800", label: "Amber 800" },
      { var: "--color-amber-900", label: "Amber 900" },
    ],
  },
  {
    label: "Dark Tones",
    slots: [
      { var: "--color-brown-800", label: "Dark Brown" },
      { var: "--color-brown-900", label: "Darker Brown" },
    ],
  },
  {
    label: "Green Accents",
    slots: [
      { var: "--color-forest-600", label: "Forest 600" },
      { var: "--color-forest-700", label: "Forest 700" },
      { var: "--color-forest-800", label: "Forest 800" },
      { var: "--color-forest-900", label: "Forest 900" },
    ],
  },
];

// ── Collect all slot variable names ───────────────────────────
const ALL_SLOT_VARS = GROUPS.flatMap((g) => g.slots.map((s) => s.var));

export default function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomized, setIsCustomized] = useState(false);
  const [colorValues, setColorValues] = useState<
    Record<string, string> | null
  >(null);

  // Read computed CSS variable values — client-only, after mount
  useEffect(() => {
    const values: Record<string, string> = {};
    const style = getComputedStyle(document.documentElement);
    ALL_SLOT_VARS.forEach((varName) => {
      const val = style.getPropertyValue(varName).trim();
      values[varName] = val || DEFAULT_COLORS[varName] || "#000000";
    });
    setColorValues(values);
  }, []);

  // Apply a color change
  const handleColorChange = useCallback(
    (varName: string, hexValue: string) => {
      document.documentElement.style.setProperty(varName, hexValue);
      setColorValues((prev) =>
        prev ? { ...prev, [varName]: hexValue } : prev
      );
      setIsCustomized(true);
    },
    []
  );

  // Reset all colors to defaults
  const resetAll = useCallback(() => {
    const root = document.documentElement;
    Object.entries(DEFAULT_COLORS).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    setColorValues((prev) =>
      prev
        ? Object.fromEntries(
            Object.keys(prev).map((k) => [k, DEFAULT_COLORS[k]])
          )
        : prev
    );
    setIsCustomized(false);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  // Don't render color rows until values are computed (client-side)
  const isReady = colorValues !== null;

  return (
    <>
      {/* ── Floating Toggle Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed left-4 top-1/2 z-[100] -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full shadow-2xl backdrop-blur-md transition-all hover:scale-110 ${
          isCustomized
            ? "bg-gradient-to-br from-cream-300 to-amber-500 text-brown-800"
            : "bg-black/80 text-white hover:bg-black"
        }`}
        aria-label="Toggle Theme Customizer"
        title="Theme Color Tester"
      >
        {isOpen ? <X size={20} /> : <Pipette size={20} />}
        {/* Pulse dot when customized */}
        {isCustomized && !isOpen && (
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-brown-800 animate-pulse" />
        )}
      </button>

      {/* ── Customizer Panel ── */}
      <div
        className={`fixed left-20 top-1/2 z-[100] -translate-y-1/2 w-72 max-h-[80vh] overflow-y-auto rounded-3xl border border-white/20 bg-black/85 p-5 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3
              className="text-lg font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Color Tester
            </h3>
            <p className="mt-0.5 text-[11px] text-white/40">
              Click any color to open the picker wheel
            </p>
          </div>
          {/* Reset button */}
          {isCustomized && (
            <button
              onClick={resetAll}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition-all hover:bg-white/20 hover:text-white"
              title="Reset all colors to defaults"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>

        {/* Color groups — only render when client-side values are ready */}
        {isReady && (
          <div className="space-y-4">
            {GROUPS.map((group) => (
              <div key={group.label}>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
                  {group.label}
                </p>
                <div className="space-y-1.5">
                  {group.slots.map((slot) => (
                    <ColorRow
                      key={slot.var}
                      slot={slot}
                      currentValue={colorValues[slot.var]}
                      onChange={handleColorChange}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading state while SSR */}
        {!isReady && (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-white/10">
          <p className="text-[10px] text-white/30 text-center">
            Client-side testing only. Remove this component when done.
          </p>
        </div>
      </div>
    </>
  );
}

// ── Individual color row component ────────────────────────────
function ColorRow({
  slot,
  currentValue,
  onChange,
}: {
  slot: { var: string; label: string };
  currentValue: string;
  onChange: (varName: string, hex: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const displayHex = normalizeHex(currentValue) || currentValue;

  return (
    <div className="group flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 transition-all hover:bg-white/10">
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Color swatch button */}
        <button
          onClick={() => inputRef.current?.click()}
          className="relative h-7 w-7 shrink-0 overflow-hidden rounded-lg border border-white/10 transition-transform hover:scale-110"
          style={{ backgroundColor: currentValue }}
          title={`Change ${slot.label}`}
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-black/30 text-white transition-opacity">
            <Pipette size={12} />
          </span>
        </button>

        {/* Hidden native color input */}
        <input
          ref={inputRef}
          type="color"
          value={displayHex}
          onChange={(e) => onChange(slot.var, e.target.value)}
          className="absolute opacity-0 pointer-events-none w-0 h-0"
          tabIndex={-1}
          aria-label={`Pick color for ${slot.label}`}
        />

        {/* Label + hex value */}
        <div className="min-w-0">
          <p className="text-xs font-medium text-white/80 truncate">
            {slot.label}
          </p>
          <p className="text-[10px] font-mono text-white/30 truncate">
            {slot.var}
          </p>
        </div>
      </div>

      {/* Hex value display */}
      <span
        className="shrink-0 ml-2 text-[11px] font-mono text-white/40 cursor-pointer hover:text-white/70 transition-colors"
        onClick={() => inputRef.current?.click()}
        title="Click to change"
      >
        {displayHex}
      </span>
    </div>
  );
}

// ── Utility: normalize any color format to 6-char hex ─────────
function normalizeHex(val: string): string {
  if (!val) return "#000000";

  // Convert rgb(r, g, b) or rgba(r, g, b, a) to hex
  const rgbMatch = val.match(
    /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/
  );
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    return (
      "#" +
      [r, g, b]
        .map((n) => Math.min(255, Math.max(0, parseInt(n))).toString(16).padStart(2, "0"))
        .join("")
    );
  }

  // Accept 6-char hex
  if (/^#[0-9a-fA-F]{6}$/.test(val)) return val;

  // Accept 3-char hex → expand to 6
  if (/^#[0-9a-fA-F]{3}$/.test(val))
    return val.replace(/^#(.)(.)(.)$/, "#$1$1$2$2$3$3");

  return val;
}
