// File: components/AccountLink.tsx

// This component is used to display a login link or a logout button
"use client"

// Import React from "react"
import Link from "next/link"
import { useSession } from "@supabase/auth-helpers-react"
import LogoutButton from "@/components/LogoutButton"

// Import the LogoutButton component
export default function AccountLink() {
  const session = useSession()

  // If user is logged in, show a Log out button; otherwise, show Log in link
  return session ? (
    // Use the session object to determine if user is logged in
    <LogoutButton />  // 
  ) : (
    // If no session, show a login link
    <Link href="/login" className="text-gray-700 hover:text-gray-900">
      Log in      
    </Link>
  )
}
