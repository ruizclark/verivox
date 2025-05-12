// components/LogoutButton.tsx
"use client"

// Import React from "react"
import { useRouter } from "next/navigation"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"

// Import the Button component from your UI library
export default function LogoutButton() {
  const supabase = createPagesBrowserClient()
  const router = useRouter()

  // Function to handle logout
  const handleLogout = async () => {
    // 1. Sign out clears the auth cookies
    await supabase.auth.signOut()
    // 2. Redirect to login
    router.push("/login")
  }

  // Render the button
  return (
    <Button variant="ghost" onClick={handleLogout}>
      Log out
    </Button>
  )
}
