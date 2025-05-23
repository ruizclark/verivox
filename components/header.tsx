// components/header.tsx

// This component is a client component because it uses the `useSession` hook
"use client"

// Import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { UserCircle } from "lucide-react"

// Import the React helpers from auth-helpers-react
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"

// Export the Header component
export function Header() {
  const session = useSession()
  const supabase = useSupabaseClient()   // ✅ get the *shared* client
  const router = useRouter()

  // Check if the user is logged in
  const loggedIn = !!session?.user

  // Check if the user is an admin
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
          {/* Mobile: VERIVOX text */}
          <span className="hidden font-serif text-xl font-bold text-harvard-crimson sm:inline-block">
            VERIVOX
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Reinsert top-level site links */}
          <Link
            href="/profiles"
            className="font-serif text-sm font-medium transition-colors hover:text-harvard-crimson text-gray-700"
          >
            Profiles
          </Link>
          <Link
            href="/articles"
            className="font-serif text-sm font-medium transition-colors hover:text-harvard-crimson text-gray-700"
          >
            Articles
          </Link>
          <Link
            href="/about"
            className="font-serif text-sm font-medium transition-colors hover:text-harvard-crimson text-gray-700"
          >
            About
          </Link>
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-2">
          {loggedIn ? (
            <>
              {/* Edit Profile button */}
              <Link href="/register">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Edit Profile
                </Button>
              </Link>

              {/* Add New Article link for authenticated users */}
              <Link href="/articles/new">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  New Article
                </Button>
              </Link>

              {/* Log out button */}
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
              {/* Register button */}
              <Link href="/signup">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Register
                </Button>
              </Link>

              {/* Log in button */}
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

          {/* Mobile: profile icon */}
          <Link href="/profile" className="md:hidden">
            <UserCircle className="h-6 w-6 text-gray-700" />
          </Link>
        </div>
      </div>
    </header>
  )
}
