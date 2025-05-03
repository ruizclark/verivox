// lib/supabase/client.ts

import { createClient } from "@supabase/supabase-js"

// These env vars must be exposed to the browser (NEXT_PUBLIC_ prefix)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a Supabase-JS client that stores its session in localStorage
// and automatically sends your anon key and auth token on requests.
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)
