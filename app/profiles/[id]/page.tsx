// File: app/[id]/page.tsx

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { supabaseAdmin } from "@/lib/supabase/admin"    // unchanged
import { notFound } from "next/navigation"              // unchanged

// UI components & icons (same as slug page)
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Globe, FileText, MapPin, Calendar } from "lucide-react"

// same Profile type as in [slug] page
type Profile = {
  full_name:       string
  graduation_year: number
  title:           string
  employer:        string
  location:        string
  linkedin_url:    string | null
  website_url:     string | null
  resume_url:      string
  about:           string
  slug:            string
  photo_url:       string
}

export default async function ProfileByIdPage({
  params,
}: {
  params: { id: string }                               // ✅ EDIT: use `id` here
}) {
  const { id } = params                                 // ✅ EDIT: destructure `id` instead of `slug`

  // ✅ EDIT: fetch by primary-key `id` rather than slug
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", id)                                       // changed filter field
    .single()

  if (error || !data) {
    return notFound()
  }

  const profile = data as Profile
  const cohort = `Class of ${profile.graduation_year}`

  return (
    <div className="relative">
      {/* watermark layer */}
      <div
        className="absolute inset-0 bg-center bg-cover opacity-10 pointer-events-none"
        style={{ backgroundImage: `url(${profile.photo_url})` }}
      />

      <div className="relative z-10 container py-10">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-12">
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative h-60 w-60 overflow-hidden rounded-full border-4 border-harvard-crimson">
                <Image
                  src={profile.photo_url}
                  alt={profile.full_name}
                  fill
                  className="object-cover"
                />
              </div>
              <h1 className="mt-4 font-serif text-2xl font-bold">
                {profile.full_name}
              </h1>
              <p className="text-muted-foreground">{cohort}</p>
              <p className="text-center font-medium">{profile.title}</p>
              <p className="text-center text-sm text-muted-foreground">
                {profile.employer}
              </p>
            </div>

            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{cohort}</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {profile.linkedin_url && (
                    <Link
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-1">
                        <Linkedin className="h-4 w-4" /> LinkedIn
                      </Button>
                    </Link>
                  )}
                  {profile.website_url && (
                    <Link
                      href={profile.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-1">
                        <Globe className="h-4 w-4" /> Website
                      </Button>
                    </Link>
                  )}
                  {profile.resume_url && (
                    <a
                      href={profile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-1">
                        <FileText className="h-4 w-4" /> Download Résumé
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-serif text-2xl font-bold mb-4">About</h2>
                <p className="text-muted-foreground">{profile.about}</p>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Link href="/profiles">
                <Button variant="outline">Back to Profiles</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
