import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Protect /api/admin routes (except login & logout) ──────
  if (
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/login") &&
    !pathname.startsWith("/api/admin/logout")
  ) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const key = getSecretKey();
    if (!key) {
      return NextResponse.json({ error: "Server config error" }, { status: 500 });
    }

    try {
      const { payload } = await jwtVerify(token, key);

      // IP binding check
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown";

      if (payload.ip && payload.ip !== ip) {
        const response = NextResponse.json({ error: "Session expired" }, { status: 401 });
        response.cookies.delete("admin_token");
        return response;
      }

      return NextResponse.next();
    } catch {
      const response = NextResponse.json({ error: "Invalid token" }, { status: 401 });
      response.cookies.delete("admin_token");
      return response;
    }
  }

  // ── CORS for all API routes ────────────────────────────────
  if (pathname.startsWith("/api")) {
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, x-api-key",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, x-api-key");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/portal-x7q9m/:path*"],
};

