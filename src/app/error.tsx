"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service in production
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-body, system-ui, sans-serif)",
        background: "#fffbeb",
        color: "#451a03",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "480px" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: "0.75rem",
            fontFamily: "var(--font-heading, serif)",
          }}
        >
          Something went wrong
        </h2>
        <p
          style={{
            fontSize: "0.95rem",
            color: "#78350f",
            marginBottom: "1.5rem",
            lineHeight: 1.6,
          }}
        >
          We apologize for the inconvenience. Please try refreshing the page or
          contact us on WhatsApp for immediate assistance.
        </p>
        <button
          onClick={reset}
          style={{
            padding: "0.75rem 2rem",
            background: "#b45309",
            color: "#fef3c7",
            border: "none",
            borderRadius: "0.75rem",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) =>
            ((e.target as HTMLButtonElement).style.background = "#92400e")
          }
          onMouseOut={(e) =>
            ((e.target as HTMLButtonElement).style.background = "#b45309")
          }
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
