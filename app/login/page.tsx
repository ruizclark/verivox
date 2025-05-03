// app/login/page.tsx

"use client"  // we need React hooks here

import React, { useState } from "react"
// ✅ Use the single shared client and session from context:
import {
  useSupabaseClient,
  useSession,
} from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  // — Grab the shared Supabase client and session
  const supabase = useSupabaseClient()
  const session = useSession()
  const router = useRouter()

  // — form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  // ✅ Derive logged-in state directly from session
  const alreadyLoggedIn = !!session?.user
  const userEmail = session?.user?.email ?? ""

  // — handler for the login form
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    // 🚫 Block if already signed in
    if (alreadyLoggedIn) {
      setErrorMsg(`Already signed in as ${userEmail}. Please log out first.`)
      return
    }

    // 🔑 Perform sign-in
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setErrorMsg(error.message)
    } else {
      router.push("/register")
    }
  }

  // — if already logged in, show a logout option instead of the form
  if (alreadyLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-8 text-center">
        <p className="mb-4">
          You’re already signed in as <strong>{userEmail}</strong>.
        </p>
        <Button
          onClick={async () => {
            // 1) Sign out
            await supabase.auth.signOut()
            // 2) Redirect back here to show the login form
            router.push("/login")
          }}
        >
          Log out
        </Button>
      </div>
    )
  }

  // — otherwise render the login form
  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Log In to VERIVOX</h1>
      {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Log in
        </Button>
      </form>
    </div>
  )
}
