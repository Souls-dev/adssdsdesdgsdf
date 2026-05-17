import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { BookingSchema } from "@/lib/schemas";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limit by IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const limiter = rateLimit(ip, "booking");
    if (!limiter.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please try again later.",
        },
        {
          status: 429,
          headers: limiter.retryAfter
            ? { "Retry-After": String(limiter.retryAfter) }
            : undefined,
        }
      );
    }

    // 2. Parse body
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, message: "Invalid request body." },
        { status: 400 }
      );
    }

    // 3. Zod validate — never expose raw Zod errors
    const result = BookingSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid form data. Please check your inputs.",
        },
        { status: 400 }
      );
    }

    // 4. Sanitize — trim all string fields
    const data = result.data;
    const sanitized = {
      full_name: data.fullName.trim(),
      contact_number: data.contactNumber.trim(),
      email: data.email.trim().toLowerCase(),
      farmhouse_id: data.farmhouseId,
      check_in_date: data.checkInDate,
      check_out_date: data.checkOutDate,
      number_of_guests: data.numberOfGuests,
      special_requests: data.specialRequests?.trim() || null,
      ip_address: ip,
      status: "pending",
    };

    // 5. Insert into Supabase
    const { error } = await supabase.from("bookings").insert(sanitized);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        {
          success: false,
          message:
            "Something went wrong. Please try again or contact us directly on WhatsApp.",
        },
        { status: 500 }
      );
    }

    // 6. Success
    return NextResponse.json(
      {
        success: true,
        message:
          "Booking inquiry received. We will contact you within 24 hours.",
      },
      { status: 200 }
    );
  } catch (err) {
    // 7. Catch-all — zero internal details
    console.error("Booking API error:", err);
    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong. Please try again or contact us directly on WhatsApp.",
      },
      { status: 500 }
    );
  }
}
