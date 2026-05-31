import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

// ── Strict CORS allowlist ────────────────────────────────────
const ALLOWED_ORIGINS = [
  "https://aljannatfarms.com",
  "https://www.aljannatfarms.com",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
];

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes(origin);
}

// ── Security headers applied to every response ───────────────
function applySecurityHeaders(response: NextResponse): void {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
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
    const origin = request.headers.get("origin");
    const allowed = isOriginAllowed(origin);

    if (request.method === "OPTIONS") {
      const preflightRes = new NextResponse(null, { status: 200 });
      if (allowed) {
        preflightRes.headers.set("Access-Control-Allow-Origin", origin!);
        preflightRes.headers.set("Access-Control-Allow-Credentials", "true");
      }
      preflightRes.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      preflightRes.headers.set("Access-Control-Allow-Headers", "Content-Type, x-api-key");
      preflightRes.headers.set("Access-Control-Max-Age", "86400");
      applySecurityHeaders(preflightRes);
      return preflightRes;
    }

    const response = NextResponse.next();
    if (allowed) {
      response.headers.set("Access-Control-Allow-Origin", origin!);
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, x-api-key");
    applySecurityHeaders(response);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/portal-x7q9m/:path*"],
};

