import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth-utils";
import {
  readSettings,
  writeSettings,
  resetSettings,
  readPreviewTheme,
  setPreviewTheme,
  clearPreviewTheme,
  makePreviewPermanent,
  SiteSettings,
} from "@/lib/site-settings-data";
import { rateLimit } from "@/lib/rateLimit";

async function verifyAdmin(request: NextRequest): Promise<{ authenticated: boolean; role?: string }> {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return { authenticated: false };
  try {
    const payload = await verifyToken(token);
    if (!payload) return { authenticated: false };
    return { authenticated: true, role: (payload.role as string) || "admin" };
  } catch {
    return { authenticated: false };
  }
}

function getIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// GET — return current settings
export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limiter = rateLimit(getIp(request), "admin-api");
  if (!limiter.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const settings = await readSettings();
    const preview = await readPreviewTheme();
    return NextResponse.json({ success: true, settings, preview, role: auth.role });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to read settings", detail: String(err) },
      { status: 500 }
    );
  }
}

// PUT — update settings (partial merge, permanent save)
export async function PUT(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limiter = rateLimit(getIp(request), "admin-api");
  if (!limiter.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
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

// PATCH — theme preview operations
export async function PATCH(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limiter = rateLimit(getIp(request), "admin-api");
  if (!limiter.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (action === "preview") {
      // Start a temporary preview
      const { preset, customColors, durationMinutes } = body;
      if (!preset) {
        return NextResponse.json({ error: "Preset is required" }, { status: 400 });
      }
      const preview = await setPreviewTheme(
        preset,
        customColors || {},
        durationMinutes || 5
      );
      return NextResponse.json({ success: true, preview });
    }

    if (action === "make-permanent") {
      // Confirm and make the preview permanent
      const settings = await makePreviewPermanent();
      return NextResponse.json({ success: true, settings, message: "Theme is now permanent!" });
    }

    if (action === "revert") {
      // Clear the preview immediately
      await clearPreviewTheme();
      return NextResponse.json({ success: true, message: "Preview reverted to permanent theme" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to process preview action", detail: String(err) },
      { status: 500 }
    );
  }
}

// DELETE — reset to factory defaults
export async function DELETE(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const defaults = await resetSettings();
    await clearPreviewTheme();
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
