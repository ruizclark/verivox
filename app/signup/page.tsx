// app/signup/page.tsx

// This is a client component
"use client"

// Import necessary libraries and components
import React, { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Define the SignUpPage component
export default function SignUpPage() {
  const supabase = useSupabaseClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [step, setStep] = useState<"form" | "checkEmail">("form")
  const [errorMsg, setErrorMsg] = useState("")
  const [loading, setLoading] = useState(false)

  // Function to handle sign-up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        // CHANGED: send users back to our callback route (not /login)
        emailRedirectTo: `${window.location.origin}/auth/callback` 
      }
    })
    
    setLoading(false)

    // ✅ Minimal patch:
    // Supabase may return no error but data.user.identities = []
    // when the email is already registered.
    if (!error && data?.user && Array.isArray((data.user as any).identities) && (data.user as any).identities.length === 0) {
      setErrorMsg("An account with this email already exists. Please log in or reset your password.")
      setStep("form")
      return
    }

    if (error) {
      const alreadyRegistered = /registered|already exists/i.test(error.message)
      setErrorMsg(
        alreadyRegistered
          ? "An account with this email already exists. Please log in or reset your password."
          : error.message
      )
      setStep("form")
    } else {
      // CHANGED: explicitly sign out so they remain logged out until they confirm via email
      await supabase.auth.signOut()
      setStep("checkEmail")
    }
  }

  // Render the component based on the current step
  if (step === "checkEmail") {
    return (
      <div className="max-w-md mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Almost there!</h1>
        <p>
          We’ve sent a confirmation link to <strong>{email}</strong>. Please
          check your inbox (and spam), click the link, then return here or go to{" "}
          <a href="/login" className="text-blue-600 underline">
            Log In
          </a>
          .
        </p>
      </div>
    )
  }

  // Render the sign-up form
  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">Sign Up for VERIVOX</h1>

      {/* 👇 New introductory paragraph */}
      <p className="text-gray-700">
        VERIVOX is a platform dedicated to showcasing individuals who have
        earned—or are in the process of earning—a Doctorate in Education
        Leadership (EdLD) from the Harvard Graduate School of Education
        (HGSE). Members of the EdLD community are encouraged to complete the
        registration process, and we will review your submission. Please be
        sure that your résumé clearly lists your EdLD graduation year.
      </p>

      {/* Error message display */}
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}

      {/* Sign-up form */}
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          {/* New label for email input */}
          <label className="block text-sm font-medium">Email</label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          {/* New label for password input */}
          <label className="block text-sm font-medium">Password</label>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        {/* New label for password confirmation input */}
        <Button type="submit" disabled={loading || !email || !password}>
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>

      {/* New paragraph for login link */}
      <p className="text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 underline">
          Log in
        </a>
        .
      </p>

      <p className="text-sm">
        <a href="/reset-password" className="text-blue-600 underline">
          Forgot your password?
        </a>
      </p>

    </div>
  )
}
