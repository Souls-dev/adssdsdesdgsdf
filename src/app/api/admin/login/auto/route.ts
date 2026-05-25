import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth-utils";
import { supabase } from "@/lib/supabase";

// SHA-256 hash helper
async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const userAgentHeader = request.headers.get("user-agent") || "unknown";
    const acceptLang = request.headers.get("accept-language") || "";
    
    // Retrieve device ID from cookie
    let deviceId = request.cookies.get("admin_device_id")?.value;

    // Calculate OS-level fingerprint signature
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

    if (!deviceId && !deviceFingerprint) {
      return NextResponse.json(
        { success: false, message: "No device identifiers found" },
        { status: 401 }
      );
    }

    // Query admin_key_bindings to find a matching binding
    let query = supabase.from("admin_key_bindings").select("*");
    if (deviceId) {
      query = query.or(`device_id.eq.${deviceId},device_fingerprint.eq.${deviceFingerprint}`);
    } else {
      query = query.eq("device_fingerprint", deviceFingerprint);
    }

    const { data: bindings, error: fetchError } = await query.limit(1);

    if (fetchError) {
      console.error("DB error fetching key binding for auto-login:", fetchError);
      return NextResponse.json(
        { success: false, message: "Database lookup failed" },
        { status: 500 }
      );
    }

    const binding = bindings?.[0];
    if (!binding) {
      return NextResponse.json(
        { success: false, message: "No active device binding found" },
        { status: 401 }
      );
    }

    const adminKeyHash = binding.admin_key_hash;
    let role: "master" | "admin" | null = null;

    // 1. Check if bound key is a master key
    const masterKeysStr = process.env.MASTER_KEYS || process.env.MASTER_KEY || "";
    const masterKeys = masterKeysStr.split(",").map((k) => k.trim()).filter(Boolean);
    for (const masterKey of masterKeys) {
      const hashedMaster = await hashKey(masterKey);
      if (hashedMaster === adminKeyHash) {
        role = "master";
        break;
      }
    }

    // 2. Check if bound key is an active admin key in Supabase
    let isDbRevoked = false;
    if (!role) {
      const { data: adminKey } = await supabase
        .from("admin_keys")
        .select("id, revoked")
        .eq("key_hash", adminKeyHash)
        .single();

      if (adminKey) {
        if (adminKey.revoked) {
          isDbRevoked = true;
        } else {
          role = "admin";
        }
      }
    }

    // 3. Legacy fallback (ADMIN_KEYS env var)
    if (!role && !isDbRevoked) {
      const adminKeysStr = process.env.ADMIN_KEYS || "";
      const adminKeys = adminKeysStr.split(",").map((k) => k.trim()).filter(Boolean);
      for (const adminKey of adminKeys) {
        const hashedAdmin = await hashKey(adminKey);
        if (hashedAdmin === adminKeyHash) {
          role = "admin";
          break;
        }
      }
    }

    if (!role) {
      // The key has been revoked or removed, so the device binding is no longer valid.
      // Clean up the invalid binding.
      await supabase.from("admin_key_bindings").delete().eq("admin_key_hash", adminKeyHash);
      return NextResponse.json(
        { success: false, message: "Key associated with this device has been revoked" },
        { status: 401 }
      );
    }

    // Restore device ID if it was cleared/lost on client but fingerprint matched
    const resolvedDeviceId = deviceId || binding.device_id;

    // Update the binding's metadata
    await supabase
      .from("admin_key_bindings")
      .update({
        last_used: new Date().toISOString(),
        user_agent: userAgentHeader,
        device_fingerprint: deviceFingerprint,
      })
      .eq("admin_key_hash", adminKeyHash);

    // Create session token
    const token = await signToken({ ip, role, deviceId: resolvedDeviceId, keyHash: adminKeyHash });

    const response = NextResponse.json(
      { success: true, message: "Auto-login successful", role },
      { status: 200 }
    );

    // Set token cookie (24h session)
    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    // Set/refresh device ID cookie (1 year)
    response.cookies.set({
      name: "admin_device_id",
      value: resolvedDeviceId,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  } catch (error) {
    console.error("Auto-login API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
