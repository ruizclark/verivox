// File: app/articles/new/page.tsx
"use client"

import React, { useState, useEffect } from "react"
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import PhotoUpload from "@/components/PhotoUpload"  // ✅ import PhotoUpload

export default function NewArticlePage() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()

  const DEFAULT_BANNER_URL = "/images/verivox-banner.png"

  // Redirect unauthorized users to login
  useEffect(() => {
    if (!session) router.push("/login")
  }, [session, router])

  // --- Form state ---
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")              // ✅ holds uploaded banner URL
  const [category, setCategory] = useState("")
  const [useDefaultBanner, setUseDefaultBanner] = useState(false)  // ✅ toggle default banner
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!title.trim() || !content.trim()) {
      setErrorMsg("Title and content are required.")
      return
    }

    setLoading(true)
    const currentDate = new Date().toISOString()

    // Determine final image URL:
    // - use default banner if checked, otherwise use uploaded imageUrl
    const finalImageUrl = useDefaultBanner
      ? DEFAULT_BANNER_URL                // ✅ default banner
      : imageUrl                         // ✅ uploaded public URL

    console.log("Saving banner URL:", finalImageUrl)  // ✅ DEBUG: what we write to DB

    const { data, error } = await supabase
      .from("articles")
      .insert([
        {
          author_id:   session!.user.id,
          author_name: session!.user.user_metadata.full_name || session!.user.email,
          title,
          excerpt,
          content,
          image_url:   finalImageUrl,       // ✅ use computed URL
          date:        currentDate,
          category,
        },
      ])
      .select("id")

    setLoading(false)

    if (error) {
      setErrorMsg(error.message)
      return
    }

    const newId = data?.[0]?.id
    if (!newId) {
      setErrorMsg("Unable to retrieve the new article ID.")
      return
    }

    router.push(`/articles/${newId}`)
  }

  if (!session) return null

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">New Article</h1>
      {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
      <form onSubmit={handlePublish} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium">
            Excerpt (200 Characters Max)
          </label>
          <Textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium">Content</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            rows={10}
          />
        </div>

        {/* Image Upload / Default Banner */}
        <div>
          {!useDefaultBanner && (
            <PhotoUpload
              userId={session!.user.id}
              bucket="banners"           // ✅ upload into the banners bucket
              onUploadSuccess={setImageUrl}
            />
          )}
          {imageUrl && !useDefaultBanner && (
            <p className="text-green-600 text-sm">
              Image uploaded!{" "}
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                View
              </a>
            </p>
          )}
          <div className="mt-2 flex items-center">
            <input
              id="useDefaultBanner"
              type="checkbox"
              checked={useDefaultBanner}
              onChange={(e) => setUseDefaultBanner(e.target.checked)}
              disabled={loading}
              className="h-4 w-4"
            />
            <label htmlFor="useDefaultBanner" className="ml-2 text-sm">
              Use the standard VERIVOX banner
            </label>
          </div>
        </div>

        {/* Publish button */}
        <Button
          type="submit"
          disabled={loading}
          className="bg-harvard-crimson text-white hover:bg-harvard-crimson/90"
        >
          {loading ? "Publishing…" : "Publish"}
        </Button>
      </form>
    </div>
  )
}
