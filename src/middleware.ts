import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Only apply CORS to API routes
  if (request.nextUrl.pathname.startsWith("/api")) {
    // Handle preflight OPTIONS
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: {
          // TODO: Restrict to agency domain once confirmed
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, x-api-key",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // For non-OPTIONS requests, add CORS headers to the response
    const response = NextResponse.next();
    // TODO: Restrict to agency domain once confirmed
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, x-api-key"
    );
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
