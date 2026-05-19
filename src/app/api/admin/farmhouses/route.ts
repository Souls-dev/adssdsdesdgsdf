import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth-utils";
import {
  readFarmhouses,
  addFarmhouse,
  updateFarmhouse,
  deleteFarmhouse,
  generateSlug,
  FarmhouseData,
} from "@/lib/farmhouse-data";

// Helper to verify admin auth
async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  if (!payload) return false;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (payload.ip && payload.ip !== ip) return false;
  return true;
}

// GET — List all farmhouses (admin sees all)
export async function GET(request: NextRequest) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const farmhouses = await readFarmhouses();
  return NextResponse.json({ success: true, farmhouses });
}

// POST — Add a new farmhouse
export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const farmhouse: FarmhouseData = {
      id: body.id || generateSlug(body.name || "farmhouse"),
      name: body.name || "",
      location: body.location || "Karachi, Sindh, Pakistan",
      shortDescription: body.shortDescription || "",
      fullDescription: body.fullDescription || "",
      pricePerNight: Number(body.pricePerNight) || 0,
      weekendSurcharge: Number(body.weekendSurcharge) || 0,
      maxGuests: Number(body.maxGuests) || 10,
      bedrooms: Number(body.bedrooms) || 1,
      bathrooms: Number(body.bathrooms) || 1,
      amenities: body.amenities || [],
      coverImage: body.coverImage || "",
      images: body.images || [],
      available: body.available !== false,
      pricingEnabled: body.pricingEnabled || false,
    };

    if (!farmhouse.name) {
      return NextResponse.json(
        { error: "Farmhouse name is required" },
        { status: 400 }
      );
    }

    await addFarmhouse(farmhouse);

    return NextResponse.json(
      { success: true, farmhouse },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to add farmhouse";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// PUT — Update a farmhouse
export async function PUT(request: NextRequest) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Farmhouse ID is required" },
        { status: 400 }
      );
    }

    // Convert numeric fields
    if (updates.pricePerNight !== undefined)
      updates.pricePerNight = Number(updates.pricePerNight);
    if (updates.weekendSurcharge !== undefined)
      updates.weekendSurcharge = Number(updates.weekendSurcharge);
    if (updates.maxGuests !== undefined)
      updates.maxGuests = Number(updates.maxGuests);
    if (updates.bedrooms !== undefined)
      updates.bedrooms = Number(updates.bedrooms);
    if (updates.bathrooms !== undefined)
      updates.bathrooms = Number(updates.bathrooms);

    const updated = await updateFarmhouse(id, updates);

    return NextResponse.json({ success: true, farmhouse: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update farmhouse";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE — Remove a farmhouse
export async function DELETE(request: NextRequest) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Farmhouse ID is required" },
        { status: 400 }
      );
    }

    await deleteFarmhouse(id);

    return NextResponse.json({ success: true, message: `Deleted ${id}` });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete farmhouse";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
