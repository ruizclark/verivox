// Import supabase client
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Export server client
export function createServerClient() {
  return createServerComponentClient({ cookies })
}

