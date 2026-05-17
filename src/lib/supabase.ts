// SERVER SIDE ONLY — never import from a client component

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.warn(
      "⚠ Missing Supabase env vars. Booking API will not work until SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local"
    );
    // Return a dummy client that will fail gracefully on use
    return createClient(
      supabaseUrl || "https://placeholder.supabase.co",
      supabaseServiceRoleKey || "placeholder-key",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const supabase = getSupabaseClient();
