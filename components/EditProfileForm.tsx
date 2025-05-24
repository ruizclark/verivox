// File: components/EditProfileForm.tsx
"use client"

import React, { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export interface ProfileData {
  full_name: string
  graduation_year: number
  title: string
  employer: string
  location: string
  linkedin_url: string | null
  website_url: string | null
  about: string
}

export default function EditProfileForm({
  userId,
  initialProfile,
}: {
  userId: string
  initialProfile: ProfileData
}) {
  const supabase = useSupabaseClient()
  const router = useRouter()
  const { toast } = useToast()

  const [fullName, setFullName] = useState(initialProfile.full_name)
  const [graduationYear, setGraduationYear] = useState<number | "">(
    initialProfile.graduation_year
  )
  const [title, setTitle] = useState(initialProfile.title)
  const [employer, setEmployer] = useState(initialProfile.employer)
  const [location, setLocation] = useState(initialProfile.location)
  const [linkedinUrl, setLinkedinUrl] = useState(
    initialProfile.linkedin_url || ""
  )
  const [websiteUrl, setWebsiteUrl] = useState(
    initialProfile.website_url || ""
  )
  const [about, setAbout] = useState(initialProfile.about)

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

    setSaving(true)
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        graduation_year: Number(graduationYear),
        title,
        employer,
        location,
        linkedin_url: linkedinUrl || null,
        website_url: websiteUrl || null,
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
    <div className="max-w-2xl mx-auto py-8">
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
          <label className="block text-sm font-medium">
            Graduation Year
          </label>
          <Input
            type="number"
            value={graduationYear}
            onChange={(e) => setGraduationYear(e.target.valueAsNumber)}
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
          <label className="block text-sm font-medium">
            Organization
          </label>
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
          <label className="block text-sm font-medium">
            LinkedIn URL
          </label>
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
          <label className="block text-sm font-medium">
            Website URL
          </label>
          <Input
            type="url"
            placeholder="(optional)"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            disabled={saving}
          />
        </div>

        {/* About */}
        <div>
          <label className="block text-sm font-medium">About You</label>
          <Textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            disabled={saving}
          />
        </div>

        <Button type="submit" disabled={saving} className="w-full">
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </form>
    </div>
  )
}
