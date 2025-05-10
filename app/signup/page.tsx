// app/signup/page.tsx
"use client"

import React, { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [step, setStep] = useState<"form" | "checkEmail">("form")
  const [errorMsg, setErrorMsg] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/login` }
    })
    
    setLoading(false)
    if (error) {
      setErrorMsg(error.message)
    } else {
      setStep("checkEmail")
    }
  }

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

      {errorMsg && <p className="text-red-500">{errorMsg}</p>}

      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
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
          <label className="block text-sm font-medium">Password</label>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button type="submit" disabled={loading || !email || !password}>
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>

      <p className="text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 underline">
          Log in
        </a>
        .
      </p>
    </div>
  )
}
