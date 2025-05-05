// app/articles/new/page.tsx

"use client"

import React, { useState, useEffect } from "react"
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"

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
  const [imageUrl, setImageUrl] = useState("")
  const [category, setCategory] = useState("")
  const [useDefaultBanner, setUseDefaultBanner] = useState(false)
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

    // compute date here instead of asking user
    const currentDate = new Date().toISOString()

    // choose final image URL
    const finalImageUrl = useDefaultBanner
      ? DEFAULT_BANNER_URL
      : imageUrl

    const { data, error } = await supabase
      .from("articles")
      .insert([
        {
          author_id:   session!.user.id,
          author_name: session!.user.user_metadata.full_name ||
                       session!.user.email,
          title,
          excerpt,
          content,
          image_url:   finalImageUrl,
          date:        currentDate,
          category,
          // ✨ EDIT: removed `featured` field—backend will handle which is featured
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

    // ✨ EDIT: wrap the path in backticks for interpolation
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
          <label className="block text-sm font-medium">Excerpt (200 Characters Max)</label>
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

        {/* Image URL with tooltip and default banner option */}
        <div>
          <label className="flex items-center text-sm font-medium">
            Image URL
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs"
                  aria-label="Image URL help"
                >
                  ?
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" align="start" className="max-w-xs">
                <p className="text-sm">
                  Image tools like Canva let you copy a shareable URL, or you
                  can right-click any web image and “Copy image address.”
                </p>
              </TooltipContent>
            </Tooltip>
          </label>
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={loading || useDefaultBanner}
          />

          {/* default banner checkbox */}
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
              Use the standard VERIVOX banner instead of my own image
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
