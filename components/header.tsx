// components/header.tsx

"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { UserCircle } from "lucide-react"

// ✅ Import the React helpers from auth-helpers-react
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"

export function Header() {
  const session = useSession()
  const supabase = useSupabaseClient()   // ✅ get the *shared* client
  const router = useRouter()

  const loggedIn = !!session?.user

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/verivox-logo.png"
            alt="VERIVOX Logo"
            width={40}
            height={40}
            priority
            className="h-10 w-auto"
          />
          <span className="hidden font-serif text-xl font-bold text-harvard-crimson sm:inline-block">
            VERIVOX
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          {/* ... your links ... */}
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-2">
          {loggedIn ? (
            <>
              {/* EDIT: "Edit Profile" button unchanged */}
              <Link href="/register">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Edit Profile
                </Button>
              </Link>

              {/* Log out remains red */}
              <Button
                size="sm"
                className="bg-harvard-crimson text-white hover:bg-harvard-crimson/90"
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push("/login")
                }}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              {/* EDIT: make Register button white/outline like Edit Profile */}
              <Link href="/signup">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Register
                </Button>
              </Link>

              {/* Log in stays red */}
              <Link href="/login">
                <Button
                  size="sm"
                  className="bg-harvard-crimson text-white hover:bg-harvard-crimson/90"
                >
                  Log in
                </Button>
              </Link>
            </>
          )}

          <Link href="/profile" className="md:hidden">
            <UserCircle className="h-6 w-6 text-gray-700" />
          </Link>
        </div>
      </div>
    </header>
  )
}
