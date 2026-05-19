import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json(
        { success: false, message: "Key is required" },
        { status: 400 }
      );
    }

    const adminKeysStr = process.env.ADMIN_KEYS || "";
    const adminKeys = adminKeysStr.split(",").map((k) => k.trim());

    if (!adminKeys.includes(key)) {
      return NextResponse.json(
        { success: false, message: "Invalid admin key" },
        { status: 401 }
      );
    }

    // Get client IP for binding
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Create token
    const token = await signToken({ ip, role: "admin" });

    // Set cookie
    const response = NextResponse.json(
      { success: true, message: "Login successful" },
      { status: 200 }
    );

    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
