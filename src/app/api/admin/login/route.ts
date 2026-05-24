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
    // 1. Rate limit login attempts by IP + User-Agent prefix (prevents global lockouts on shared local/unknown IPs)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const userAgentHeader = request.headers.get("user-agent") || "unknown";
    const rateLimitIdentifier = ip === "unknown" || ip === "127.0.0.1" || ip === "::1"
      ? `${ip}:${userAgentHeader.substring(0, 100)}`
      : ip;

    const limiter = rateLimit(rateLimitIdentifier, "admin-login");
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

    // Trim key to handle accidental trailing spaces or newlines from mobile clipboard copies
    const trimmedKey = key.trim();

    // 2. Determine role: master key (env var) or admin key (Supabase table)
    let role: "master" | "admin" | null = null;

    const masterKeysStr = process.env.MASTER_KEYS || process.env.MASTER_KEY || "";
    const masterKeys = masterKeysStr.split(",").map((k) => k.trim()).filter(Boolean);
    if (masterKeys.includes(trimmedKey)) {
      role = "master";
    }

    if (!role) {
      // Check admin_keys table in Supabase
      const keyHash = await hashKey(trimmedKey);
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
      if (adminKeys.includes(trimmedKey)) {
        role = "admin";
      }
    }

    if (!role) {
      return NextResponse.json(
        { success: false, message: "Invalid admin key" },
        { status: 401 }
      );
    }

    // 3. Build robust device identity (dual-layer: cookie + server fingerprint)
    let deviceId: string = request.cookies.get("admin_device_id")?.value || crypto.randomUUID();

    // Stable OS-level device fingerprint signature that is resilient to browser version upgrades
    const acceptLang = request.headers.get("accept-language") || "";
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgentHeader);
    let os = "unknown-os";
    if (/iphone|ipad|ipod/i.test(userAgentHeader)) os = "ios";
    else if (/android/i.test(userAgentHeader)) os = "android";
    else if (/win/i.test(userAgentHeader)) os = "windows";
    else if (/mac/i.test(userAgentHeader)) os = "mac";
    else if (/linux/i.test(userAgentHeader)) os = "linux";
    
    const primaryLang = acceptLang.split(",")[0]?.split("-")[0]?.trim() || "en";
    const stableFingerprintRaw = `${os}|${isMobile ? "mobile" : "desktop"}|${primaryLang}`;
    const deviceFingerprint = await hashKey(stableFingerprintRaw);

    // 4. Check device binding in Supabase (applies to ALL roles, including master)
    const keyHash = await hashKey(trimmedKey);

    const { data: binding, error: fetchError } = await supabase
      .from("admin_key_bindings")
      .select("*")
      .eq("admin_key_hash", keyHash)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("DB error checking key binding:", fetchError);
      return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 }
      );
    }

    if (role === "master") {
      // Master keys bypass strict device matching to allow the owner to log in from PC, phone, or tablet simultaneously.
      // We still update or insert the binding row for audit visibility in the portal.
      if (binding) {
        await supabase
          .from("admin_key_bindings")
          .update({
            last_used: new Date().toISOString(),
            user_agent: userAgentHeader,
            device_fingerprint: deviceFingerprint,
          })
          .eq("admin_key_hash", keyHash);
      } else {
        await supabase
          .from("admin_key_bindings")
          .insert({
            admin_key_hash: keyHash,
            device_id: deviceId,
            user_agent: userAgentHeader,
            device_fingerprint: deviceFingerprint,
          });
      }
    } else {
      // Normal admin keys enforce strict single-device limit
      if (binding) {
        // Key already bound — check device match via cookie OR fingerprint
        const cookieMatch = binding.device_id === deviceId;
        const fingerprintMatch = binding.device_fingerprint && binding.device_fingerprint === deviceFingerprint;

        if (!cookieMatch && !fingerprintMatch) {
          return NextResponse.json(
            {
              success: false,
              message:
                "This key is already bound to another device. Contact the system administrator to revoke the binding.",
            },
            { status: 403 }
          );
        }

        // If cookie was lost but fingerprint matched, restore the cookie device ID
        if (!cookieMatch && fingerprintMatch) {
          deviceId = binding.device_id;
        }

        // Device matches — update last_used and fingerprint
        await supabase
          .from("admin_key_bindings")
          .update({
            last_used: new Date().toISOString(),
            user_agent: userAgentHeader,
            device_fingerprint: deviceFingerprint,
          })
          .eq("admin_key_hash", keyHash);
      } else {
        // First use — bind this key to this device with fingerprint
        const { error: insertError } = await supabase
          .from("admin_key_bindings")
          .insert({
            admin_key_hash: keyHash,
            device_id: deviceId,
            user_agent: userAgentHeader,
            device_fingerprint: deviceFingerprint,
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
