"use client";

interface LoadingScreenProps {
  style?: string; // "monogram" | "split" | "gate" | "fade"
  exiting?: boolean;
}

export default function LoadingScreen({ style = "monogram", exiting = false }: LoadingScreenProps) {
  const isExitingClass = exiting ? "exiting" : "";

  // ── 1. SPLIT SCREEN REVEAL ──
  if (style === "split") {
    return (
      <div className={`loading-screen-wrapper split-style ${isExitingClass}`}>
        {/* Top Pane */}
        <div className="loading-split-pane loading-split-top">
          <div className="loading-bg-gradient" />
        </div>

        {/* Bottom Pane */}
        <div className="loading-split-pane loading-split-bottom">
          <div className="loading-bg-gradient" />
        </div>

        {/* Crack Divider Line */}
        <div className="loading-split-line" />

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
        <div className="loading-gate-pane loading-gate-left">
          <div className="loading-bg-gradient" />
        </div>

        {/* Right Gate */}
        <div className="loading-gate-pane loading-gate-right">
          <div className="loading-bg-gradient" />
        </div>

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
        <div className="loading-fade-bg">
          <div className="loading-bg-gradient" />
        </div>
        
        {/* Center Content */}
        <div className="loading-center-content">
          <h1 className="loading-fade-title font-heading">Al Jannat</h1>
          <div className="loading-fade-divider" />
          <p className="loading-fade-tagline">ESTABLISHED 1994</p>
        </div>
      </div>
    );
  }

  // ── 4. AJ ELEGANT MONOGRAM (DEFAULT) ──
  return (
    <div className={`loading-screen-wrapper monogram-style ${isExitingClass}`}>
      <div className="loading-screen">
        {/* Animated background gradient */}
        <div className="loading-bg-gradient" />

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
