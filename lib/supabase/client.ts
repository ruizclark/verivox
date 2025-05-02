// lib/supabase/client.ts

import { createClient } from "@supabase/supabase-js"

// These env vars should already be in your .env.local
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// This client will store session in localStorage and send the Bearer token on requests
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
