import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth-utils";
import {
  readSettings,
  writeSettings,
  resetSettings,
  SiteSettings,
} from "@/lib/site-settings-data";

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return false;
  try {
    await verifyToken(token);
    return true;
  } catch {
    return false;
  }
}

// GET — return current settings
export async function GET(request: NextRequest) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await readSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to read settings", detail: String(err) },
      { status: 500 }
    );
  }
}

// PUT — update settings (partial merge)
export async function PUT(request: NextRequest) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const current = await readSettings();

    // Deep merge incoming body into current settings
    const merged = deepMerge(current, body) as SiteSettings;
    merged.meta.modifiedBy = "admin";
    await writeSettings(merged);

    return NextResponse.json({ success: true, settings: merged });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update settings", detail: String(err) },
      { status: 500 }
    );
  }
}

// DELETE — reset to factory defaults
export async function DELETE(request: NextRequest) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const defaults = await resetSettings();
    return NextResponse.json({ success: true, settings: defaults });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to reset settings", detail: String(err) },
      { status: 500 }
    );
  }
}

// ── Deep merge utility ──────────────────────────────────────────
function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      output[key] = deepMerge(
        target[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>
      );
    } else {
      output[key] = source[key];
    }
  }
  return output;
}
