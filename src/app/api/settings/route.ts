import { NextRequest, NextResponse } from "next/server";
import { readSettings, readPreviewTheme } from "@/lib/site-settings-data";
import { rateLimit } from "@/lib/rateLimit";

// Public GET — no auth required, returns settings for the public website
export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const limiter = rateLimit(ip, "public-api");
  if (!limiter.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": String(limiter.retryAfter || 60) } }
    );
  }

  try {
    const settings = await readSettings();
    const preview = await readPreviewTheme();

    // If there's an active preview, overlay it onto the theme
    if (preview) {
      settings.theme.activeColorPreset = preview.preset;
      settings.theme.customColors = preview.customColors;
    }

    return NextResponse.json(settings, {
      headers: {
        "Cache-Control": "public, s-maxage=5, stale-while-revalidate=10",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load site settings" },
      { status: 500 }
    );
  }
}
