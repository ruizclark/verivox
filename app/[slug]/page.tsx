// File: app/[slug]/page.tsx

// This is a Next.js page component that displays a user's profile and their published articles.
import React from "react"
import Link from "next/link"                              
import Image from "next/image"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Globe, FileText, MapPin, Calendar } from "lucide-react"
import { format } from "date-fns"

// Types for the profile and article data
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
  id:              string
}

// Type for the article data
type Article = {
  id:          string
  title:       string
  author_name: string
  date:        string
  image_url:   string
  excerpt:     string
}

// This function fetches the profile and articles data based on the slug parameter
export default async function SlugProfilePage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params

  // fetch the profile by slug
  const { data: pdata, error: perror } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .single()
  if (perror || !pdata) return notFound()
  const profile = pdata as Profile

  // fetch all articles by this author
  const { data: adata, error: aerr } = await supabaseAdmin
    .from("articles")
    .select("id, title, author_name, date, image_url, excerpt")
    .eq("author_id", profile.id)
    .order("date", { ascending: false })
  const articles = (adata || []) as Article[]

  // if no articles, show a message
  const cohort = `Class of ${profile.graduation_year}`

  // if (aerr) {
  //   console.error("Error fetching articles:", aerr)
  return (
    <div className="relative">
      {/* Background image */}
      <div className="relative z-10 container py-10 space-y-10">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-12">
          {/* sidebar */}
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative h-60 w-60 overflow-hidden rounded-full border-4 border-harvard-crimson">
                {/* EDIT: show placeholder if no photo */}
                <Image
                  src={profile.photo_url || "/images/placeholder.png"}
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
            {/* Contact info */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.location}</span>
                </div>
                {/* EDIT: show placeholder if no graduation year */}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{cohort}</span>
                </div>
                {/* EDIT: show placeholder if no employer */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {profile.linkedin_url && (
                    <Link href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Linkedin className="h-4 w-4" /> LinkedIn
                      </Button>
                    </Link>
                  )}
                  {/* EDIT: show placeholder if no website */}
                  {/* EDIT: show placeholder if no résumé */}
                  {/* EDIT: show placeholder if no LinkedIn */}
                  {profile.website_url && (
                    <Link href={profile.website_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Globe className="h-4 w-4" /> Website
                      </Button>
                    </Link>
                  )}
                  {/* EDIT: show placeholder if no résumé */}
                  {profile.resume_url && (
                    <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-1">
                        <FileText className="h-4 w-4" /> Download Résumé
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* main content */}
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-serif text-2xl font-bold mb-4">About</h2>
                <p className="text-muted-foreground">{profile.about}</p>
              </CardContent>
            </Card>

            {/* Published Articles */}
            <section className="space-y-6">
              <h2 className="font-serif text-3xl font-bold tracking-tighter text-gray-900">
                VERIVOX Articles
              </h2>

              {/* EDIT: show placeholder if no articles */}
              {articles.length === 0 ? (
                <p className="text-gray-500">No articles published yet.</p>
              ) : (
                articles.map((a) => (
                  <Link
                    href={`/articles/${a.id}`}                 // ✅ EDIT: wrap each Card in Link to its article
                    key={a.id}
                  >
                    {/* Card for each article */}
                    <Card className="overflow-hidden transition-shadow hover:shadow-lg border border-gray-200">
                      {/* Banner image — full width, half-height */}
                      <div className="w-full overflow-hidden">
                        <Image
                          src={a.image_url}
                          alt={a.title}
                          width={800}
                          height={200}
                          className="w-full object-cover"
                          style={{ height: 200 }}
                        />
                      </div>
                      {/* Card content */}
                      <CardContent className="p-6">
                        <h3 className="font-serif text-xl font-bold text-gray-900">
                          {a.title}
                        </h3>
                        {/* EDIT: show placeholder if no author name */}
                        <p className="text-sm text-gray-500 mb-2">
                          {format(new Date(a.date), "MMMM d, yyyy")}
                        </p>
                        {/* EDIT: show placeholder if no excerpt */}
                        <p className="text-gray-600">{a.excerpt}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}