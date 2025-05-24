// File: app/profiles/[id]/edit/page.tsx
"use client"

import React, { useEffect, useState } from "react"
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter, useParams } from "next/navigation"
import EditProfileForm, { ProfileData } from "@/components/EditProfileForm"

export default function EditProfilePage() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()
  const params = useParams()

  const [initialProfile, setInitialProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 1) Wait for params.id to be defined
    const rawId = params.id
    if (rawId === undefined) return

    // 2) If it's an array (unexpected), bail out or redirect
    if (Array.isArray(rawId)) {
      router.push("/")
      return
    }

    // Now rawId is guaranteed a string
    const userId = rawId

    // 3) Wait until we know session state
    if (session === undefined) return

    // 4) Redirect if not logged in
    if (!session) {
      router.push("/login")
      return
    }

    // 5) Redirect if URL ID doesn’t match the logged-in user’s ID
    if (session.user.id !== userId) {
      router.push("/")
      return
    }

    // 6) Fetch the profile under the authenticated role
    supabase
      .from("profiles")
      .select("full_name,graduation_year,title,employer,location,linkedin_url,website_url,about")
      .eq("user_id", userId)
      .single()
      .then(({ data, error }) => {
        setLoading(false)
        if (error || !data) {
          setError("Failed to load profile.")
        } else {
          setInitialProfile(data as ProfileData)
        }
      })
  }, [session, supabase, router, params.id])

  if (loading) {
    return <p className="text-center py-10">Loading…</p>
  }
  if (error || !initialProfile) {
    return <p className="text-red-500 text-center py-10">{error || "Profile not found."}</p>
  }

  // By now, params.id is definitely a string
  const userId = params.id as string

  return (
    <EditProfileForm
      userId={userId}
      initialProfile={initialProfile}
    />
  )
}
