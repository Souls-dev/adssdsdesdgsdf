"use client";

export default function LoadingScreen() {
  return (
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
  );
}
