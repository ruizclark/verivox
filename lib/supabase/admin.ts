// lib/supabase/admin.ts
import { createClient } from "@supabase/supabase-js"

// Use your service-role key here – this key bypasses RLS, so keep it server-only!
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,      // your Supabase URL
  process.env.SUPABASE_SERVICE_ROLE_KEY!,     // your service-role key
  {
    auth: { persistSession: false, autoRefreshToken: false }
  }
)
