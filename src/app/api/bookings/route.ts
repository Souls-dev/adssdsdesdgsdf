import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // 1. Verify API key
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey || apiKey !== process.env.BOOKINGS_API_KEY) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    // 2. Parse query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "50", 10) || 50,
      100
    );
    const offset = parseInt(searchParams.get("offset") || "0", 10) || 0;

    // 3. Build query — NEVER include ip_address
    let query = supabase
      .from("bookings")
      .select(
        "id, full_name, contact_number, email, farmhouse_id, check_in_date, check_out_date, number_of_guests, special_requests, status, created_at"
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { success: false, message: "Something went wrong." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data, count: data?.length || 0 },
      { status: 200 }
    );
  } catch (err) {
    console.error("Bookings list API error:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
