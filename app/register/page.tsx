// File: app/register/page.tsx
// This file is part of the "Alumni Network" project.
"use client"

// Import necessary libraries and components
import React, { useState, useEffect } from "react"
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"
import ResumeUpload from "@/components/ResumeUpload"
import PhotoUpload from "@/components/PhotoUpload"       // NEW: import PhotoUpload
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

// This page handles the registration process for users.
export default function RegisterPage() {
  const router = useRouter()
  const supabase = useSupabaseClient()
  const session = useSession()

  // Auth state
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [errorMsg, setErrorMsg]       = useState("")
  const [userId, setUserId]           = useState<string>("")

  // ✅ NEW: track if a profile already exists
  const [profileExists, setProfileExists] = useState(false)

  // Check if user is authenticated
  useEffect(() => {
    const checkAuthAndProfile = async () => {
      if (!session) {
        router.push("/login")
      // Redirect to login if not authenticated
      } else if (!session.user.confirmed_at) {
        setErrorMsg("Please confirm your email first.")
      // Redirect to confirmation page if email not confirmed
      } else {
        setUserId(session.user.id)

        // ✅ NEW: query profiles table to see if user already registered
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", session.user.id)
          .maybeSingle()

        if (profile) {
          setProfileExists(true)
          setErrorMsg("You are already registered.")
        }
      }
      setLoadingAuth(false)
    }

    checkAuthAndProfile()
  }, [router, session, supabase])

  // Form state
  const [fullName, setFullName]             = useState("")  
  const [graduationYear, setGraduationYear] = useState("")  
  const [title, setTitle]                   = useState("")  
  const [employer, setEmployer]             = useState("")  
  const [location, setLocation]             = useState("")  
  const [linkedinUrl, setLinkedinUrl]       = useState("")  
  const [websiteUrl, setWebsiteUrl]         = useState("")  
  const [resumeUrl, setResumeUrl]           = useState("")  
  const [about, setAbout]                   = useState("")  
  const [photoUrl, setPhotoUrl]             = useState("")  // NEW: state for photo_url

  const [submitting, setSubmitting] = useState(false)

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    // Validation checks for required fields 
    if (!userId)                return setErrorMsg("Not signed in.")
    if (!fullName.trim())       return setErrorMsg("Full name is required.")
    if (!graduationYear)        return setErrorMsg("Graduation year is required.")
    if (!title.trim())          return setErrorMsg("Title is required.")
    if (!employer.trim())       return setErrorMsg("Organization is required.")
    if (!location.trim())       return setErrorMsg("Location is required.")
    if (!resumeUrl)             return setErrorMsg("Please upload your résumé.")
    if (!about.trim())          return setErrorMsg("Please share something about yourself.")

    // ✅ Prevent submitting if profile already exists
    if (profileExists) {
      return setErrorMsg("You are already registered.")
    }

    // Generate slug
    const slug = fullName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^\w-]/g, "")

    setSubmitting(true)

    // Check if slug already exists
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name:       fullName,
        slug,                    
        photo_url:       photoUrl || "", 
        graduation_year: parseInt(graduationYear, 10),
        title,
        employer,
        location,
        linkedin_url:    linkedinUrl,
        website_url:     websiteUrl,
        resume_url:      resumeUrl,
        about,
        approved:        false,
      }),
    })

    // Handle response
    const json = await res.json()
    setSubmitting(false)

    if (res.ok) {
      router.push("/register/pending")
    } else {
      setErrorMsg(json.error || "Registration failed.")
    }
  }

  // Loading state 
  if (loadingAuth) {
    return <p className="text-center py-8">Loading…</p>
  }

  // ✅ If profile already exists, show alert and link to edit page
  if (profileExists) {
    return (
      <div className="max-w-md mx-auto py-8 text-center">
        <p className="text-red-600 font-semibold mb-4">
          You are already registered.
        </p>
        <Button onClick={() => router.push(`/profiles/${userId}/edit`)}>
          Edit My Profile
        </Button>
      </div>
    )
  }

  // Error state
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

  // Main form 
  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Profile Information</h1>
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

        {/* Organization */}
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
              Résumé ready!{' '}
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

        {/* Photo Upload (optional) */}
        <div>
          <PhotoUpload userId={userId} onUploadSuccess={setPhotoUrl} />  
          {photoUrl && (
            <img
              src={photoUrl}
              alt="Profile Photo"
              className="mt-2 h-24 w-24 rounded-full object-cover"
            />
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

        <p className="text-sm mt-2">
          <a href="/reset-password" className="text-blue-600 underline">
            Forgot your password?
          </a>
        </p>

      </form>
    </div>
  )
}
