"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession } from "@supabase/auth-helpers-react"

export default function RegisterCTA() {
  const session = useSession()
  const href = session?.user ? "/register" : "/signup"

  return (
    <Link href={href}>
      {/* ✅ KEEPING the exact red styling you had before */}
      <Button variant="outline" className="gap-1 border-gray-300 text-gray-700 hover:bg-gray-50">
        Build My Profile
      </Button>
    </Link>
  )
}
