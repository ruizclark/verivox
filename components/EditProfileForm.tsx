// components/EditProfileForm.tsx
"use client"

import React, { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"
import ResumeUpload from "./ResumeUpload"
import PhotoUpload from "./PhotoUpload"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { useToast } from "./ui/use-toast"

export interface ProfileData {
  full_name:       string
  photo_url:       string
  graduation_year: number
  title:           string
  employer:        string
  location:        string
  linkedin_url:    string | ""
  website_url:     string | ""
  resume_url:      string
  about:           string
}

export default function EditProfileForm({
  userId,
  initialProfile,
}: {
  userId: string
  initialProfile: ProfileData
}) {
  const supabase = useSupabaseClient()
  const router   = useRouter()
  const { toast }= useToast()

  const [fullName, setFullName]             = useState(initialProfile.full_name)
  const [photoUrl, setPhotoUrl]             = useState(initialProfile.photo_url)
  const [graduationYear, setGraduationYear] = useState(initialProfile.graduation_year.toString())
  const [title, setTitle]                   = useState(initialProfile.title)
  const [employer, setEmployer]             = useState(initialProfile.employer)
  const [location, setLocation]             = useState(initialProfile.location)
  const [linkedinUrl, setLinkedinUrl]       = useState(initialProfile.linkedin_url || "")
  const [websiteUrl, setWebsiteUrl]         = useState(initialProfile.website_url || "")
  const [resumeUrl, setResumeUrl]           = useState(initialProfile.resume_url)
  const [about, setAbout]                   = useState(initialProfile.about)

  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (
      !fullName.trim() ||
      !graduationYear ||
      !title.trim() ||
      !employer.trim() ||
      !location.trim() ||
      !about.trim()
    ) {
      setErrorMsg("Please fill in all required fields.")
      return
    }

    // ✅ Enforce 2013+
    const gy = parseInt(graduationYear, 10)
    if (Number.isNaN(gy) || gy < 2013) {
      setErrorMsg("Graduation year must be 2013 or later.")
      return
    }

    setSaving(true)

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name:       fullName,
        photo_url:       photoUrl,
        graduation_year: gy,
        title,
        employer,
        location,
        linkedin_url:    linkedinUrl,
        website_url:     websiteUrl,
        resume_url:      resumeUrl,
        about,
      })
      .eq("user_id", userId)

    setSaving(false)

    if (error) {
      setErrorMsg(error.message)
    } else {
      toast({ title: "Profile updated." })
      router.push(`/profiles/${userId}`)
    }
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}

      <form onSubmit={handleSave} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <Input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={saving}
          />
        </div>

        {/* Graduation Year */}
        <div>
          <label className="block text-sm font-medium">Graduation Year</label>
          <Input
            type="number"
            min={2013}                      
            value={graduationYear}
            onChange={(e) => setGraduationYear(e.target.value)}
            disabled={saving}
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={saving}
          />
        </div>

        {/* Organization */}
        <div>
          <label className="block text-sm font-medium">Organization</label>
          <Input
            type="text"
            value={employer}
            onChange={(e) => setEmployer(e.target.value)}
            disabled={saving}
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium">Location</label>
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={saving}
          />
        </div>

        {/* LinkedIn URL */}
        <div>
          <label className="block text-sm font-medium">LinkedIn URL</label>
          <Input
            type="url"
            placeholder="(optional)"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            disabled={saving}
          />
        </div>

        {/* Website URL */}
        <div>
          <label className="block text-sm font-medium">Website URL</label>
          <Input
            type="url"
            placeholder="(optional)"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            disabled={saving}
          />
        </div>

        {/* About You */}
        <div>
          <label className="block text-sm font-medium">About You</label>
          <Textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            disabled={saving}
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

        {/* Photo Upload */}
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

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={saving}
            className="flex-1 bg-gray-500 text-white hover:bg-gray-400"
          >
            {saving ? "Saving…" : "Save Changes"}
          </Button>
          <Button
            type="button"
            disabled={saving}
            className="flex-1 bg-harvard-crimson text-white hover:bg-harvard-crimson/90"
            onClick={() => router.push(`/profiles/${userId}`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
