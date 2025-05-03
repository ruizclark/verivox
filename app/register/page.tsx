// app/register/page.tsx
"use client"

import React, { useState, useEffect } from "react"
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"
import ResumeUpload from "@/components/ResumeUpload"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function RegisterPage() {
  const router = useRouter()
  const supabase = useSupabaseClient()
  const session = useSession()

  // --- Auth & redirect logic (unchanged) ---
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [errorMsg, setErrorMsg]     = useState("")
  const [userId, setUserId]         = useState<string>("")

  useEffect(() => {
    if (!session) {
      router.push("/login")
    } else if (!session.user.confirmed_at) {
      setErrorMsg("Please confirm your email first.")
    } else {
      setUserId(session.user.id)
    }
    setLoadingAuth(false)
  }, [router, session])

  // --- Form state ---
  const [fullName, setFullName]           = useState("")  // full_name
  const [graduationYear, setGraduationYear] = useState("")// graduation_year
  const [title, setTitle]                 = useState("")  // title
  const [employer, setEmployer]           = useState("")  // employer
  const [location, setLocation]           = useState("")  // location
  const [linkedinUrl, setLinkedinUrl]     = useState("")  // linkedin_url (optional)
  const [websiteUrl, setWebsiteUrl]       = useState("")  // website_url (optional)
  const [resumeUrl, setResumeUrl]         = useState("")  // resume_url
  const [about, setAbout]                 = useState("")  // about

  const [submitting, setSubmitting] = useState(false)

  // --- Submit handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!userId)                return setErrorMsg("Not signed in.")
    if (!fullName.trim())       return setErrorMsg("Full name is required.")
    if (!graduationYear)        return setErrorMsg("Graduation year is required.")
    if (!title.trim())          return setErrorMsg("Title is required.")
    if (!employer.trim())       return setErrorMsg("Organization is required.")  // updated label
    if (!location.trim())       return setErrorMsg("Location is required.")
    if (!resumeUrl)             return setErrorMsg("Please upload your résumé.")
    if (!about.trim())          return setErrorMsg("Please share something about yourself.")
    // LinkedIn & Website are now optional → no checks here

    setSubmitting(true)

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name:       fullName,
        graduation_year: parseInt(graduationYear, 10),
        title,
        employer,
        location,
        linkedin_url:    linkedinUrl,  // may be empty
        website_url:     websiteUrl,   // may be empty
        resume_url:      resumeUrl,
        about,
        approved:        false,
      }),
    })

    const json = await res.json()
    setSubmitting(false)

    if (res.ok) {
      router.push("/register/pending")  // → new pending page
    } else {
      setErrorMsg(json.error || "Registration failed.")
    }
  }

  // --- Render based on auth state ---
  if (loadingAuth) {
    return <p className="text-center py-8">Loading…</p>
  }

  if (errorMsg && !userId) {
    return (
      <div className="max-w-md mx-auto py-8 text-center">
        <p className="text-red-500 mb-4">{errorMsg}</p>
        <Button onClick={() => router.push("/login")}>
          Go to Login
        </Button>
      </div>
    )
  }

  // --- Main form ---
  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
      {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <Input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={submitting}
          />
        </div>

        {/* Graduation Year */}
        <div>
          <label className="block text-sm font-medium">Graduation Year</label>
          <Input
            type="number"
            value={graduationYear}
            onChange={(e) => setGraduationYear(e.target.value)}
            disabled={submitting}
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
          />
        </div>

        {/* Organization (formerly Employer) */}
        <div>
          <label className="block text-sm font-medium">Organization</label>
          <Input
            type="text"
            value={employer}
            onChange={(e) => setEmployer(e.target.value)}
            disabled={submitting}
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium">Location</label>
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={submitting}
          />
        </div>

        {/* LinkedIn URL (optional) */}
        <div>
          <label className="block text-sm font-medium">LinkedIn URL</label>
          <Input
            type="url"
            placeholder="(optional)"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            disabled={submitting}
          />
        </div>

        {/* Website URL (optional) */}
        <div>
          <label className="block text-sm font-medium">Website URL</label>
          <Input
            type="url"
            placeholder="(optional)"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            disabled={submitting}
          />
        </div>

        {/* Résumé Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Upload Résumé (PDF)
          </label>
          <ResumeUpload userId={userId} onUploadSuccess={setResumeUrl} />
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
        </div>

        {/* About You */}
        <div>
          <label className="block text-sm font-medium">About You</label>
          <Textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            disabled={submitting}
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Submitting…" : "Submit Profile"}
        </Button>
      </form>
    </div>
  )
}
