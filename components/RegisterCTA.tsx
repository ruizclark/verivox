// This is the loading UI that will be shown while loading
"use client"

// Import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession } from "@supabase/auth-helpers-react"

// Exporting the RegisterCTA component
export default function RegisterCTA() {
  const session = useSession()
  const href = session?.user ? "/register" : "/signup"

  // If the user is logged in, redirect to the register page
  return (
    <Link href={href}>
      {/* Button styling */}
      <Button variant="outline" className="gap-1 border-gray-300 text-gray-700 hover:bg-gray-50">
        Build My Profile
      </Button>
    </Link>
  )
}
