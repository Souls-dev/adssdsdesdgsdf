import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth-utils";
import { supabase } from "@/lib/supabase";

async function verifyAdmin(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  return auth.authenticated;
}

// DELETE — revoke a key's device binding so it can be re-bound
export async function DELETE(request: NextRequest) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Binding ID is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("admin_key_bindings")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Device binding revoked" });
  } catch {
    return NextResponse.json({ error: "Failed to revoke binding" }, { status: 500 });
  }
}

// GET — list all key bindings (for admin management)
export async function GET(request: NextRequest) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from("admin_key_bindings")
      .select("id, admin_key_hash, device_id, bound_at, last_used, user_agent")
      .order("last_used", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Mask the hashes — only show first 8 chars
    const masked = (data || []).map((b) => ({
      ...b,
      admin_key_hash: b.admin_key_hash.substring(0, 8) + "...",
    }));

    return NextResponse.json({ success: true, bindings: masked });
  } catch {
    return NextResponse.json({ error: "Failed to list bindings" }, { status: 500 });
  }
}
