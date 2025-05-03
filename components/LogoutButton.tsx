// components/LogoutButton.tsx
"use client"

import { useRouter } from "next/navigation"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"

export default function LogoutButton() {
  const supabase = createPagesBrowserClient()
  const router = useRouter()

  const handleLogout = async () => {
    // 1. Sign out clears the auth cookies
    await supabase.auth.signOut()
    // 2. Redirect to login
    router.push("/login")
  }

  return (
    <Button variant="ghost" onClick={handleLogout}>
      Log out
    </Button>
  )
}
