// app/login/page.tsx

"use client"  // we need React hooks here

import React, { useState, useEffect } from "react"  // EDIT: added useEffect
import {
  useSupabaseClient,
  useSession,
} from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const supabase = useSupabaseClient()
  const session = useSession()
  const router = useRouter()

  // EDIT: when session exists, redirect based on whether profile.slug exists
  useEffect(() => {
    if (session) {
      ;(async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("slug")
          .eq("id", session.user.id)
          .single()
        if (error) {
          console.error("Error checking profile:", error)
          return router.push("/register")
        }
        if (data?.slug) {
          router.push("/")          // existing user → home
        } else {
          router.push("/register")  // new user → register
        }
      })()
    }
  }, [session, supabase, router])

  // — form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    // 🔑 Perform sign‐in
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setErrorMsg(error.message)
    }
    // 🚫 REMOVE: unconditional router.push("/register") 
    // redirect now handled in useEffect after session
  }

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
