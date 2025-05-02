// app/register/page.tsx

"use client"

import React, { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import ResumeUpload from "@/components/ResumeUpload"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()

  // Form state
  const [fullName, setFullName] = useState("")
  const [resumeUrl, setResumeUrl] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // 1️⃣ On mount, get the current user's ID
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        setErrorMsg("You must be logged in")
      } else {
        setUserId(user.id)
      }
    })
  }, [])

  // 2️⃣ Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!userId) {
      setErrorMsg("No user ID found.")
      return
    }
    if (!resumeUrl) {
      setErrorMsg("Please upload your résumé first.")
      return
    }
    if (!fullName.trim()) {
      setErrorMsg("Please enter your name.")
      return
    }

    setLoading(true)

    // 3️⃣ POST to your register API
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: fullName, resumeUrl }),
    })

    const json = await res.json()
    setLoading(false)

    if (res.ok) {
      // Redirect to the new profile page
      router.push(`/profiles/${userId}`)
    } else {
      setErrorMsg(json.error || "Registration failed.")
    }
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>

      {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <Input
            type="text"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Upload Résumé (PDF)
          </label>
          <ResumeUpload
            userId={userId!}           // userId is set by useEffect
            onUploadSuccess={setResumeUrl}
          />
        </div>

        {resumeUrl && (
          <p className="text-green-600 text-sm">
            Résumé ready!{" "}
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              View
            </a>
          </p>
        )}

        <Button type="submit" disabled={loading || !resumeUrl || !fullName}>
          {loading ? "Submitting..." : "Submit Profile"}
        </Button>
      </form>
    </div>
  )
}
