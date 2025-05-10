// File: components/AccountLink.tsx
"use client"

import Link from "next/link"
import { useSession } from "@supabase/auth-helpers-react"
import LogoutButton from "@/components/LogoutButton"

export default function AccountLink() {
  const session = useSession()

  // If user is logged in, show a Log out button; otherwise, show Log in link
  return session ? (
    <LogoutButton />  // ✅ EDIT: renders existing logout component when session exists
  ) : (
    <Link href="/login" className="text-gray-700 hover:text-gray-900">
      Log in        {/* ✅ EDIT: renders login link when no session */}
    </Link>
  )
}
