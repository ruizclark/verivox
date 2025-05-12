// lib/supabase/admin.ts
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client using service role key
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,               
  process.env.SUPABASE_SERVICE_ROLE_KEY!,  
  {
    auth: { persistSession: false, autoRefreshToken: false }
  }
)
