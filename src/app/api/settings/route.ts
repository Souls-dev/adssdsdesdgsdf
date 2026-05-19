import { NextResponse } from "next/server";
import { readSettings } from "@/lib/site-settings-data";

// Public GET — no auth required, returns settings for the public website
export async function GET() {
  try {
    const settings = readSettings();
    return NextResponse.json(settings, {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load site settings" },
      { status: 500 }
    );
  }
}
