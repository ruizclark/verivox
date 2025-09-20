// app/reset-password/page.tsx
"use client"

import React, { useState } from "react"
// ⬇️ CHANGE: use the helpers client instead of importing a separate singleton
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ResetPasswordPage() {
  const supabase = useSupabaseClient() // ⬅️ NEW
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setErrorMsg("")
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })

    setLoading(false)

    if (error) {
      setErrorMsg(error.message)
      return
    }

    setMessage(
      "If an account exists for this email, a reset link has been sent. Please check your inbox (and spam)."
    )
  }

  return (
    <div className="max-w-md mx-auto py-8 space-y-4">
      <h1 className="text-2xl font-bold">Reset your password</h1>
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}
      {message && <p className="text-green-600">{message}</p>}

      <form onSubmit={handleReset} className="space-y-3">
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
        <Button type="submit" disabled={loading || !email}>
          {loading ? "Sending…" : "Send reset link"}
        </Button>
      </form>
    </div>
  )
}
