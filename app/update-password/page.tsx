// app/update-password/page.tsx
"use client"

import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [ready, setReady] = useState(false)   // ✅ ensure we have/attempt a session before submit

  useEffect(() => {
    let cancelled = false

    const ensureSession = async () => {
      // Check if a session already exists
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        if (!cancelled) setReady(true)
        return
      }

      // If no session yet, try to hydrate from the URL hash
      const hash = typeof window !== "undefined" ? window.location.hash : ""
      if (hash && hash.includes("access_token")) {
        const params = new URLSearchParams(hash.slice(1))
        const access_token = params.get("access_token") || ""
        const refresh_token = params.get("refresh_token") || ""

        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token })
          if (error) {
            if (!cancelled) setErrorMsg(error.message)
          }
        }
      }

      // Re-check session after attempting to set it
      const { data: { session: after } } = await supabase.auth.getSession()
      if (!cancelled) setReady(Boolean(after))
    }

    ensureSession()
    return () => { cancelled = true }
  }, [])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setErrorMsg("")

    // Guard: need a session to update password
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setErrorMsg("Auth session missing! Please open the reset link again from your email.")
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setErrorMsg(error.message)
      return
    }

    setMessage("Password updated successfully.")
    setTimeout(() => router.push("/login"), 1200)
  }

  return (
    <div className="max-w-md mx-auto py-8 space-y-4">
      <h1 className="text-2xl font-bold">Set a new password</h1>
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}
      {message && <p className="text-green-600">{message}</p>}

      <form onSubmit={handleUpdate} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">New password</label>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || !ready}   // ✅ prevent submit until session is ready
          />
        </div>

        <Button type="submit" disabled={loading || !password || !ready}>
          {loading ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>
  )
}
