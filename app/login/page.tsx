// app/login/page.tsx

// This is a login page for a Next.js application using Supabase for authentication.
"use client"  // we need React hooks here

// Import necessary libraries and components
import React, { useState, useEffect } from "react"  // EDIT: added useEffect
import {
  useSupabaseClient,
  useSession,
} from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Import the Supabase client
export default function LoginPage() {
  const supabase = useSupabaseClient()
  const session = useSession()
  const router = useRouter()

  // When session exists, redirect based on whether profile.slug exists
  useEffect(() => {
    // If session exists, check if the user has a profile
    if (session) {
      // Check if the user has a profile in the database
      ;(async () => {
        // Query the database for the user's profile
        const { data, error } = await supabase
          .from("profiles")
          .select("slug")
          .eq("id", session.user.id)
          .single()
        // If there's an error or no profile, redirect to the register page
        if (error) {
          console.error("Error checking profile:", error)
          return router.push("/register")
        }
        // If the user has a profile, redirect to the home page
        if (data?.slug) {
          router.push("/")    
        // If the user doesn't have a profile, redirect to the register page
        } else {
          router.push("/register") 
        }
      })()
    }
  }, [session, supabase, router])

  // State variables for email, password, and error message
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  // Function to handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    // Call Supabase to sign in the user with email and password
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    // If there's an error, set the error message
    if (error) {
      setErrorMsg(error.message)
    }
  }

  // If session exists, redirect to the home page
  return (
    <div className="max-w-md mx-auto py-8">
      {/* If session exists, redirect to the home page */}
      <h1 className="text-2xl font-bold mb-4">Log In to VERIVOX</h1>
      {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
      {/* Login form */}
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email input */}
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
          {/* Password input */}
          <label className="block text-sm font-medium">Password</label>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* Login button */}
        <Button type="submit" className="w-full">
          Log in
        </Button>
        <p className="text-sm">
          <a href="/reset-password" className="text-blue-600 underline">
            Forgot your password?
          </a>
        </p>
      </form>
    </div>
  )
}
