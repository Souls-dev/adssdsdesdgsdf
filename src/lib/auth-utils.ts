import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return new TextEncoder().encode(secret);
};

export async function signToken(payload: any) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(getSecretKey());
    return token;
  } catch (error) {
    console.error("Error signing token:", error);
    throw error;
  }
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch (error) {
    return null;
  }
}

export async function verifyAdminRequest(
  request: NextRequest
): Promise<{ authenticated: boolean; role?: string; error?: string }> {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) {
    return { authenticated: false, error: "No session token found" };
  }

  try {
    const payload = await verifyToken(token);
    if (!payload) {
      return { authenticated: false, error: "Invalid or expired session token" };
    }

    if (!payload.deviceId || !payload.keyHash) {
      return { authenticated: false, error: "Legacy session token. Please log in again." };
    }

    // Check if device binding exists and is still valid
    const { data: binding, error } = await supabase
      .from("admin_key_bindings")
      .select("device_id")
      .eq("admin_key_hash", payload.keyHash)
      .single();

    if (error || !binding) {
      return {
        authenticated: false,
        error: "Session binding not found. Key may have been revoked or reset.",
      };
    }

    if (binding.device_id !== payload.deviceId) {
      return {
        authenticated: false,
        error: "Session active on another device. Locked out on this device.",
      };
    }

    return { authenticated: true, role: (payload.role as string) || "admin" };
  } catch (err) {
    return { authenticated: false, error: "Authentication check failed" };
  }
}

