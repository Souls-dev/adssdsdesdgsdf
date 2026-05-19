import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth-utils";
import fs from "fs";
import path from "path";

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

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const farmhouseId = formData.get("farmhouseId") as string | null;

    if (!file || !farmhouseId) {
      return NextResponse.json(
        { error: "File and farmhouseId are required" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, and WebP images are allowed" },
        { status: 400 }
      );
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be under 10MB" },
        { status: 400 }
      );
    }

    // Sanitize farmhouseId to prevent path traversal
    const safeId = farmhouseId.replace(/[^a-zA-Z0-9_-]/g, "");
    if (!safeId) {
      return NextResponse.json(
        { error: "Invalid farmhouse ID" },
        { status: 400 }
      );
    }

    // Create directory if it doesn't exist
    const dir = path.join(process.cwd(), "public", "farmhouses", safeId);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Determine next filename
    const existingFiles = fs.readdirSync(dir).filter((f) =>
      /\.(jpg|jpeg|png|webp)$/i.test(f)
    );
    const nextNum = existingFiles.length + 1;
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${nextNum}.${ext}`;

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filepath = path.join(dir, filename);
    fs.writeFileSync(filepath, buffer);

    const publicPath = `/farmhouses/${safeId}/${filename}`;

    return NextResponse.json({
      success: true,
      path: publicPath,
      filename,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
