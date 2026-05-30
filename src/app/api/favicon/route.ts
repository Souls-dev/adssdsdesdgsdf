import { NextResponse } from "next/server";
import { readSettings } from "@/lib/site-settings-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await readSettings();
    const faviconUrl = settings.theme.faviconUrl || settings.theme.logoUrl || "/logo/al-jannat-logo.png";
    // faviconPadding now represents scale percentage: 100 = exact fit, 200 = 2x zoom, 50 = half size
    const scale = settings.theme.faviconPadding ?? 100;

    // ── Fetch the image and convert to base64 data URI ──
    // This is critical: SVG favicons with external <image href> URLs are blocked
    // by browser security policies. Embedding as base64 makes it self-contained.
    let imageDataUri = "";
    try {
      const isAbsolute = faviconUrl.startsWith("http://") || faviconUrl.startsWith("https://");
      const fetchUrl = isAbsolute ? faviconUrl : `https://aljannatfarms.com${faviconUrl}`;

      const imgRes = await fetch(fetchUrl, { cache: "no-store" });
      if (imgRes.ok) {
        const buffer = await imgRes.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const contentType = imgRes.headers.get("content-type") || "image/png";
        imageDataUri = `data:${contentType};base64,${base64}`;
      }
    } catch (fetchErr) {
      console.error("Failed to fetch favicon image:", fetchErr);
    }

    // If we couldn't fetch the image, return a minimal fallback
    if (!imageDataUri) {
      const fallback = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="#1a365d" rx="8"/><text x="32" y="42" text-anchor="middle" font-size="28" font-weight="bold" fill="#f5d77a" font-family="serif">AJ</text></svg>`;
      return new NextResponse(fallback, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=60",
        },
      });
    }

    // ── Calculate image dimensions based on scale ──
    // At 100%: image is 64x64 (fills exactly)
    // At 150%: image is 96x96 centered (zoomed in, edges clipped)
    // At 200%: image is 128x128 centered (very zoomed in)
    // At 50%:  image is 32x32 centered (smaller with padding)
    const imageSize = Math.round(64 * (scale / 100));
    const offset = Math.round((64 - imageSize) / 2);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <image href="${imageDataUri}" x="${offset}" y="${offset}" width="${imageSize}" height="${imageSize}" preserveAspectRatio="xMidYMid meet"/>
</svg>`;

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    console.error("Favicon API error:", err);
    const fallback = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"></svg>`;
    return new NextResponse(fallback, {
      headers: { "Content-Type": "image/svg+xml" },
    });
  }
}
