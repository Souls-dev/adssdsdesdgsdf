import { NextRequest, NextResponse } from "next/server";
import { readAvailableFarmhouses } from "@/lib/farmhouse-data";
import { rateLimit } from "@/lib/rateLimit";

// Public GET — no auth required, returns only available farmhouses
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
    const farmhouses = await readAvailableFarmhouses();
    return NextResponse.json(
      { success: true, farmhouses },
      {
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to load farmhouses" },
      { status: 500 }
    );
  }
}
