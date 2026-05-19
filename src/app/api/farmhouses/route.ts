import { NextResponse } from "next/server";
import { readAvailableFarmhouses } from "@/lib/farmhouse-data";

// Public GET — no auth required, returns only available farmhouses
export async function GET() {
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
