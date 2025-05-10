// lib/supabase/admin.ts
import { createClient } from "@supabase/supabase-js"

// ➤ DEBUG: print the two env‐vars so we can see if they're wired up
console.log("🔍 SUPABASE_URL:", process.env.SUPABASE_URL)
console.log("🔍 SUPABASE_SERVICE_ROLE_KEY:", Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY))

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,               
  process.env.SUPABASE_SERVICE_ROLE_KEY!,  
  {
    auth: { persistSession: false, autoRefreshToken: false }
  }
)
