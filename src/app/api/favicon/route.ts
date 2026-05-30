import { NextResponse } from "next/server";
import { readSettings } from "@/lib/site-settings-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await readSettings();
    const faviconUrl = settings.theme.faviconUrl || settings.theme.logoUrl || "/logo/al-jannat-logo.png";
    const padding = settings.theme.faviconPadding ?? 12;

    // Build an absolute URL for the image if it's a relative path
    const isAbsolute = faviconUrl.startsWith("http://") || faviconUrl.startsWith("https://");
    const imageHref = isAbsolute ? faviconUrl : `https://aljannatfarms.com${faviconUrl}`;

    // The padding is a percentage of 64 (our SVG viewBox size)
    const inset = Math.round((padding / 100) * 64);
    const imageSize = 64 - inset * 2;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <image href="${imageHref}" x="${inset}" y="${inset}" width="${imageSize}" height="${imageSize}" preserveAspectRatio="xMidYMid meet"/>
</svg>`;

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    console.error("Favicon API error:", err);
    // Fallback: empty transparent SVG
    const fallback = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"></svg>`;
    return new NextResponse(fallback, {
      headers: { "Content-Type": "image/svg+xml" },
    });
  }
}
