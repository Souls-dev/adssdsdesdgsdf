import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth-utils";
import { supabase } from "@/lib/supabase";

async function verifyAdmin(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  return auth.authenticated;
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
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and SVG images are allowed" },
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

    // Generate unique filename
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const timestamp = Date.now();
    const filename = `${safeId}/${timestamp}.${ext}`;

    // Upload to Supabase Storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error: uploadError } = await supabase.storage
      .from("farmhouse-images")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("farmhouse-images")
      .getPublicUrl(filename);

    const publicPath = urlData.publicUrl;

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
