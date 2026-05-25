import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth-utils";
import { supabase } from "@/lib/supabase";

// SHA-256 hash helper
async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Generate a random alphanumeric key
function generateRandomKey(length = 16): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => chars[b % chars.length]).join("");
}

// Verify master role
async function verifyMaster(request: NextRequest): Promise<boolean> {
  const auth = await verifyAdminRequest(request);
  return auth.authenticated && auth.role === "master";
}

// GET — List all admin keys (master only)
export async function GET(request: NextRequest) {
  const isMaster = await verifyMaster(request);
  if (!isMaster) {
    return NextResponse.json({ error: "Unauthorized — master key required" }, { status: 403 });
  }

  const { data: keys, error } = await supabase
    .from("admin_keys")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch admin keys:", error);
    return NextResponse.json({ error: "Failed to fetch keys" }, { status: 500 });
  }

  // Enrich with device binding info
  const { data: bindings } = await supabase.from("admin_key_bindings").select("*");
  const bindingMap = new Map<string, any>();
  (bindings || []).forEach((b: any) => bindingMap.set(b.admin_key_hash, b));

  const enrichedKeys = (keys || []).map((k: any) => {
    const binding = bindingMap.get(k.key_hash);
    return {
      ...k,
      key_hash_short: k.key_hash.substring(0, 8) + "..." + k.key_hash.substring(k.key_hash.length - 6),
      device_bound: !!binding,
      device_user_agent: binding?.user_agent || null,
      device_last_used: binding?.last_used || null,
      binding_id: binding?.id || null,
    };
  });

  // Generate virtual key entries for the configured master keys
  const masterKeysStr = process.env.MASTER_KEYS || process.env.MASTER_KEY || "";
  const masterKeysList = masterKeysStr.split(",").map((k) => k.trim()).filter(Boolean);
  
  for (const masterKey of masterKeysList) {
    const hash = await hashKey(masterKey);
    const binding = bindingMap.get(hash);
    enrichedKeys.unshift({
      id: `master-${hash.substring(0, 8)}`,
      key_hash: hash,
      label: `Master Key (${masterKey.substring(0, 3)}...)`,
      created_at: new Date(2026, 0, 1).toISOString(),
      revoked: false,
      key_hash_short: hash.substring(0, 8) + "..." + hash.substring(hash.length - 6),
      device_bound: !!binding,
      device_user_agent: binding?.user_agent || null,
      device_last_used: binding?.last_used || null,
      binding_id: binding?.id || null,
      is_master: true,
    });
  }

  return NextResponse.json({ success: true, keys: enrichedKeys });
}

// POST — Generate a new admin key (master only)
export async function POST(request: NextRequest) {
  const isMaster = await verifyMaster(request);
  if (!isMaster) {
    return NextResponse.json({ error: "Unauthorized — master key required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const label = (body.label || "Admin Key").trim().substring(0, 50);

    // Generate the key
    const plainKey = generateRandomKey(16);
    const keyHash = await hashKey(plainKey);

    // Store the hash in Supabase
    const { error } = await supabase.from("admin_keys").insert({
      key_hash: keyHash,
      label,
    });

    if (error) {
      console.error("Failed to create admin key:", error);
      return NextResponse.json({ error: "Failed to create key" }, { status: 500 });
    }

    // Return the plaintext key ONCE — it can never be retrieved again
    return NextResponse.json({
      success: true,
      key: plainKey,
      label,
      message: "Copy this key now — it will never be shown again.",
    });
  } catch (err) {
    console.error("Key generation error:", err);
    return NextResponse.json({ error: "Failed to generate key" }, { status: 500 });
  }
}

// DELETE — Revoke or delete a key (master only)
export async function DELETE(request: NextRequest) {
  const isMaster = await verifyMaster(request);
  if (!isMaster) {
    return NextResponse.json({ error: "Unauthorized — master key required" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get("id");
    const action = searchParams.get("action") || "revoke"; // "revoke" or "delete"

    if (!keyId) {
      return NextResponse.json({ error: "Key ID is required" }, { status: 400 });
    }

    if (keyId.startsWith("master-")) {
      // For virtual master keys, "deleting" or "revoking" resets their device binding
      const masterKeysStr = process.env.MASTER_KEYS || process.env.MASTER_KEY || "";
      const masterKeysList = masterKeysStr.split(",").map((k) => k.trim()).filter(Boolean);
      
      for (const masterKey of masterKeysList) {
        const hash = await hashKey(masterKey);
        if (keyId === `master-${hash.substring(0, 8)}`) {
          const { error } = await supabase
            .from("admin_key_bindings")
            .delete()
            .eq("admin_key_hash", hash);
            
          if (error) {
            console.error("Failed to delete master key binding:", error);
            return NextResponse.json({ error: "Failed to reset binding" }, { status: 500 });
          }
          return NextResponse.json({ success: true, message: "Master key device binding reset successfully" });
        }
      }
      return NextResponse.json({ error: "Master key not found" }, { status: 404 });
    }

    if (action === "delete") {
      // Get the key hash first to clean up bindings
      const { data: keyData } = await supabase
        .from("admin_keys")
        .select("key_hash")
        .eq("id", keyId)
        .single();

      if (keyData) {
        // Remove device binding
        await supabase.from("admin_key_bindings").delete().eq("admin_key_hash", keyData.key_hash);
      }

      // Delete the key
      const { error } = await supabase.from("admin_keys").delete().eq("id", keyId);
      if (error) {
        return NextResponse.json({ error: "Failed to delete key" }, { status: 500 });
      }
      return NextResponse.json({ success: true, message: "Key deleted permanently" });
    } else {
      // Revoke — mark as revoked and remove device binding
      const { data: keyData } = await supabase
        .from("admin_keys")
        .select("key_hash")
        .eq("id", keyId)
        .single();

      if (keyData) {
        await supabase.from("admin_key_bindings").delete().eq("admin_key_hash", keyData.key_hash);
      }

      const { error } = await supabase
        .from("admin_keys")
        .update({ revoked: true, revoked_at: new Date().toISOString() })
        .eq("id", keyId);

      if (error) {
        return NextResponse.json({ error: "Failed to revoke key" }, { status: 500 });
      }
      return NextResponse.json({ success: true, message: "Key revoked" });
    }
  } catch (err) {
    console.error("Key management error:", err);
    return NextResponse.json({ error: "Failed to manage key" }, { status: 500 });
  }
}
