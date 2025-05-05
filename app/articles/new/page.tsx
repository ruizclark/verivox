"use client"

import React, { useState, useEffect } from "react"
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function NewArticlePage() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()

  // Redirect unauthorized users to login
  useEffect(() => {
    if (!session) {
      router.push("/login")
    }
  }, [session, router])

  // --- Form state ---
  const [title, setTitle]       = useState("")   // EDIT: form field
  const [excerpt, setExcerpt]   = useState("")   // EDIT: form field
  const [content, setContent]   = useState("")   // EDIT: form field
  const [imageUrl, setImageUrl] = useState("")   // EDIT: form field
  const [date, setDate]         = useState("")   // EDIT: form field
  const [category, setCategory] = useState("")   // EDIT: form field
  const [featured, setFeatured] = useState(false)// EDIT: form field
  const [loading, setLoading]   = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    // Basic validation
    if (!title.trim() || !content.trim()) {
      return setErrorMsg("Title and content are required.")
    }

    setLoading(true)

    // Insert new article; ask Supabase to return the new ID
    const { data, error } = await supabase
      .from("articles")
      .insert([
        {
          author_id:    session!.user.id,
          author_name:  session!.user.user_metadata.full_name || session!.user.email,
          title,
          excerpt,
          content,
          image_url:    imageUrl,
          date:         date || new Date().toISOString().split("T")[0],
          category,
          featured,
        },
      ])
      .select("id")  // EDIT: ask Supabase to return the new id

    // 🔍 LOGGING: inspect what Supabase gave us
    console.log("[Publish] supabase.insert →", { data, error })

    setLoading(false)

    if (error) {
      setErrorMsg(error.message)
      return
    }
    if (!data || data.length === 0) {
      setErrorMsg("Unable to retrieve the new article ID.")
      return
    }

    const newId = data[0].id
    router.push(`/articles/${newId}`)
  }

  // Don't render form until session is loaded
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
          <label className="block text-sm font-medium">Excerpt</label>
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

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium">Date</label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <Input
            type="text"
            placeholder="e.g. Leadership"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Featured */}
        <div className="flex items-center">
          <input
            id="featured"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            disabled={loading}
            className="h-4 w-4"
          />
          <label htmlFor="featured" className="ml-2 text-sm">
            Featured
          </label>
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
