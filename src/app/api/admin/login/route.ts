import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth-utils";
import { supabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/rateLimit";

// SHA-256 hash helper (never store raw keys)
async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limit login attempts by IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const limiter = rateLimit(ip, "admin-login");
    if (!limiter.allowed) {
      return NextResponse.json(
        { success: false, message: "Too many login attempts. Try again later." },
        {
          status: 429,
          headers: limiter.retryAfter
            ? { "Retry-After": String(limiter.retryAfter) }
            : undefined,
        }
      );
    }

    const { key } = await request.json();

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        { success: false, message: "Key is required" },
        { status: 400 }
      );
    }

    // 2. Determine role: master key (env var) or admin key (Supabase table)
    let role: "master" | "admin" | null = null;

    const masterKey = process.env.MASTER_KEY;
    if (masterKey && key === masterKey) {
      role = "master";
    }

    if (!role) {
      // Check admin_keys table in Supabase
      const keyHash = await hashKey(key);
      const { data: adminKey } = await supabase
        .from("admin_keys")
        .select("id, revoked")
        .eq("key_hash", keyHash)
        .single();

      if (adminKey && !adminKey.revoked) {
        role = "admin";
      }
    }

    // Legacy fallback: check ADMIN_KEYS env var (for backwards compatibility)
    if (!role) {
      const adminKeysStr = process.env.ADMIN_KEYS || "";
      const adminKeys = adminKeysStr.split(",").map((k) => k.trim()).filter(Boolean);
      if (adminKeys.includes(key)) {
        role = "admin";
      }
    }

    if (!role) {
      return NextResponse.json(
        { success: false, message: "Invalid admin key" },
        { status: 401 }
      );
    }

    // 3. Get or generate device ID from cookie
    let deviceId = request.cookies.get("admin_device_id")?.value;
    if (!deviceId) {
      deviceId = crypto.randomUUID();
    }

    // 4. Check device binding in Supabase (skip for master key)
    if (role !== "master") {
      const keyHash = await hashKey(key);
      const userAgent = request.headers.get("user-agent") || "unknown";

      const { data: binding, error: fetchError } = await supabase
        .from("admin_key_bindings")
        .select("*")
        .eq("admin_key_hash", keyHash)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 = not found (expected for first use)
        console.error("DB error checking key binding:", fetchError);
        return NextResponse.json(
          { success: false, message: "Internal server error" },
          { status: 500 }
        );
      }

      if (binding) {
        // Key already bound — check device match
        if (binding.device_id !== deviceId) {
          return NextResponse.json(
            {
              success: false,
              message:
                "This key is already bound to another device. Contact the system administrator to revoke the binding.",
            },
            { status: 403 }
          );
        }
        // Device matches — update last_used
        await supabase
          .from("admin_key_bindings")
          .update({ last_used: new Date().toISOString(), user_agent: userAgent })
          .eq("admin_key_hash", keyHash);
      } else {
        // First use — bind this key to this device
        const { error: insertError } = await supabase
          .from("admin_key_bindings")
          .insert({
            admin_key_hash: keyHash,
            device_id: deviceId,
            user_agent: userAgent,
          });

        if (insertError) {
          console.error("Failed to bind key to device:", insertError);
          return NextResponse.json(
            { success: false, message: "Failed to register device" },
            { status: 500 }
          );
        }
      }
    }

    // 5. Create JWT token
    const token = await signToken({ ip, role, deviceId });

    // 6. Set cookies
    const response = NextResponse.json(
      { success: true, message: "Login successful" },
      { status: 200 }
    );

    // Session cookie (24h)
    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    // Persistent device ID cookie (1 year)
    response.cookies.set({
      name: "admin_device_id",
      value: deviceId,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
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
