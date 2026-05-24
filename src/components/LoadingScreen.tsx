"use client";

interface LoadingScreenProps {
  style?: string; // "monogram" | "split" | "gate" | "fade" | "curtain" | "ripple"
  exiting?: boolean;
}

export default function LoadingScreen({ style = "monogram", exiting = false }: LoadingScreenProps) {
  const isExitingClass = exiting ? "exiting" : "";

  // ── 1. SPLIT SCREEN REVEAL ──
  // Starts as a solid joined screen, then a crack forms with particles, then splits apart
  if (style === "split") {
    return (
      <div className={`loading-screen-wrapper split-style ${isExitingClass}`}>
        {/* Top Pane — starts as full solid, crack forms via animation */}
        <div className="loading-split-pane loading-split-top" />

        {/* Bottom Pane */}
        <div className="loading-split-pane loading-split-bottom" />

        {/* Crack Line — hidden initially, animates in */}
        <div className="loading-split-crack" />

        {/* Crack Particles — burst out when crack forms */}
        <div className="split-particles">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className={`split-particle split-particle-${i + 1}`} />
          ))}
        </div>

        {/* Center Content */}
        <div className="loading-center-content">
          <div className="loading-brand-glow">
            <span className="brand-glow-word font-heading">Al Jannat</span>
          </div>
          <p className="loading-split-subtitle">Premium Farmhouses</p>
          <div className="loading-split-spinner">
            <span className="spinner-dot" />
            <span className="spinner-dot" />
            <span className="spinner-dot" />
          </div>
        </div>
      </div>
    );
  }

  // ── 2. GILDED GATE REVEAL ──
  if (style === "gate") {
    return (
      <div className={`loading-screen-wrapper gate-style ${isExitingClass}`}>
        {/* Left Gate */}
        <div className="loading-gate-pane loading-gate-left" />

        {/* Right Gate */}
        <div className="loading-gate-pane loading-gate-right" />

        {/* Vertical Seam Line */}
        <div className="loading-gate-seam" />

        {/* Center Content */}
        <div className="loading-center-content">
          <div className="gate-logo-container">
            <div className="gate-logo-circle">
              <span className="gate-logo-text">AJ</span>
            </div>
          </div>
          <h2 className="loading-gate-title font-heading">Al Jannat</h2>
          <div className="loading-gate-bar-track">
            <div className="loading-gate-bar-fill" />
          </div>
        </div>
      </div>
    );
  }

  // ── 3. CLASSIC MINIMALIST FADE ──
  if (style === "fade") {
    return (
      <div className={`loading-screen-wrapper fade-style ${isExitingClass}`}>
        {/* Center Content */}
        <div className="loading-center-content">
          <h1 className="loading-fade-title font-heading">Al Jannat</h1>
          <div className="loading-fade-divider" />
          <p className="loading-fade-tagline">ESTABLISHED 1994</p>
        </div>
      </div>
    );
  }

  // ── 4. CURTAIN DROP ──
  if (style === "curtain") {
    return (
      <div className={`loading-screen-wrapper curtain-style ${isExitingClass}`}>
        {/* Curtain strips that fall away sequentially */}
        <div className="curtain-strip curtain-strip-1" />
        <div className="curtain-strip curtain-strip-2" />
        <div className="curtain-strip curtain-strip-3" />
        <div className="curtain-strip curtain-strip-4" />
        <div className="curtain-strip curtain-strip-5" />

        {/* Center Content */}
        <div className="loading-center-content">
          <div className="curtain-brand font-heading">Al Jannat</div>
          <div className="curtain-line" />
          <p className="curtain-tagline">Premium Farmhouse Experience</p>
        </div>
      </div>
    );
  }

  // ── 5. PULSE RIPPLE ──
  if (style === "ripple") {
    return (
      <div className={`loading-screen-wrapper ripple-style ${isExitingClass}`}>
        {/* Concentric ripple rings expanding */}
        <div className="ripple-rings">
          <div className="ripple-ring ripple-ring-1" />
          <div className="ripple-ring ripple-ring-2" />
          <div className="ripple-ring ripple-ring-3" />
        </div>

        {/* Center Content */}
        <div className="loading-center-content">
          <div className="ripple-logo-circle">
            <span className="ripple-logo-text font-heading">AJ</span>
          </div>
          <h2 className="ripple-title font-heading">Al Jannat</h2>
          <p className="ripple-subtitle">Since 1994</p>
        </div>
      </div>
    );
  }

  // ── 6. AJ ELEGANT MONOGRAM (DEFAULT) ──
  return (
    <div className={`loading-screen-wrapper monogram-style ${isExitingClass}`}>
      <div className="loading-screen">
        {/* Floating ambient particles */}
        <div className="loading-particles">
          <span className="particle particle-1" />
          <span className="particle particle-2" />
          <span className="particle particle-3" />
          <span className="particle particle-4" />
          <span className="particle particle-5" />
          <span className="particle particle-6" />
        </div>

        {/* Center content */}
        <div className="loading-center">
          {/* Elegant circular spinner */}
          <div className="loading-spinner-wrap">
            <svg
              className="loading-spinner"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer track ring */}
              <circle
                className="spinner-track"
                cx="50"
                cy="50"
                r="42"
                fill="none"
                strokeWidth="1.5"
              />
              {/* Animated arc */}
              <circle
                className="spinner-arc"
                cx="50"
                cy="50"
                r="42"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="80 180"
              />
              {/* Inner glow ring */}
              <circle
                className="spinner-inner"
                cx="50"
                cy="50"
                r="34"
                fill="none"
                strokeWidth="0.5"
              />
            </svg>

            {/* Monogram inside the spinner */}
            <div className="loading-monogram">
              <span className="monogram-letter monogram-a">A</span>
              <span className="monogram-letter monogram-j">J</span>
            </div>
          </div>

          {/* Brand name with staggered reveal */}
          <div className="loading-brand">
            {"Al Jannat".split("").map((char, i) => (
              <span
                key={i}
                className="brand-letter"
                style={{
                  animationDelay: `${0.8 + i * 0.07}s`,
                  ...(char === " " ? { width: "0.3em" } : {}),
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>

          {/* Tagline */}
          <p className="loading-tagline">Premium Farmhouse Experience</p>

          {/* Elegant loading bar */}
          <div className="loading-bar-track">
            <div className="loading-bar-fill" />
          </div>
        </div>
      </div>
    </div>
  );
}
