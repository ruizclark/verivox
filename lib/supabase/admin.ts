// lib/supabase/admin.ts
import { createClient } from "@supabase/supabase-js"

// Use your service-role key here – this key bypasses RLS, so keep it server-only!
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,                  // ✅ EDIT: use server-only SUPABASE_URL
  process.env.SUPABASE_SERVICE_ROLE_KEY!,     // unchanged
  {
    auth: { persistSession: false, autoRefreshToken: false }
  }
)
