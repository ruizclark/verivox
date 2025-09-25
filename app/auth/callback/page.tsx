// app/auth/callback/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

export default function AuthCallback() {
  const router = useRouter()
  const search = useSearchParams()
  const supabase = useSupabaseClient()

  useEffect(() => {
    const code = search.get("code")
    if (!code) {
      // No code in URL -> send to login
      router.replace("/login?msg=missing_code")
      return
    }

    ;(async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        router.replace("/login?msg=invalid_or_expired_link")
        return
      }
      router.replace("/register")
    })()
  }, [search, supabase, router])

  return (
    <div className="max-w-md mx-auto py-8 text-center">
      <p>Confirming your email…</p>
    </div>
  )
}
