// File: app/articles/[id]/edit/page.tsx
"use client"

// Polyfill findDOMNode so ReactQuill works under Next.js App Router
import ReactDOM from "react-dom"
if (typeof (ReactDOM as any).findDOMNode !== "function") {
  (ReactDOM as any).findDOMNode = (instance: any): any => instance
}

// Polyfill for ReactQuill
import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"
// Import CSS for ReactQuill
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
// Import Supabase client
import { useRouter, useParams } from "next/navigation"
// Import Next.js router and params
import { Input } from "@/components/ui/input"
// Import custom Input component
import { Textarea } from "@/components/ui/textarea"
// Import custom Textarea component
import { Button } from "@/components/ui/button"
// Import custom Button component
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
// Import custom Tooltip component
import { useToast } from "@/components/ui/use-toast"

// ReactQuill only loads on client
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

// Import ReactQuill dynamically to avoid SSR issues
export default function EditArticlePage() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()
  const { toast } = useToast()
  const { id } = useParams()!

  // Get article ID from URL params
  const DEFAULT_BANNER_URL = "/images/verivox-banner.png"

  // State variables for article data
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState<string>("")
  const [imageUrl, setImageUrl] = useState("")
  const [useDefaultBanner, setUseDefaultBanner] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Fetch existing article data on mount
  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }
    // Check if user is logged in
    setLoading(true)
    // Fetch article data from Supabase
    supabase
      .from("articles")
      .select("title, excerpt, content, image_url, author_id")  // ✅ EDIT: removed category from select
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        setLoading(false)
        // Handle loading state
        if (error || !data) {
          setErrorMsg("Failed to load article.")
          return
        }
        // Set state with fetched data
        setTitle(data.title)
        setExcerpt(data.excerpt)
        setContent(data.content)
        if (data.image_url === DEFAULT_BANNER_URL) {
          setUseDefaultBanner(true)
        } else {
          setImageUrl(data.image_url)
        }
        // Check if the logged-in user is the author
        if (data.author_id !== session.user.id) {
          router.push(`/articles/${id}`)
        }
      })
      // Handle error state
  }, [id, session, supabase, router])

  // Handle save (update) action
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    // Validate input
    const plainText = content.replace(/<(.|\n)*?>/g, "").trim()
    // Strip HTML tags from content
    if (!title.trim() || !plainText) {
      setErrorMsg("Title and content are required.")
      return
    }
    // Check if title and content are empty
    setSaving(true)
    // Set saving state
    const finalUrl = useDefaultBanner ? DEFAULT_BANNER_URL : imageUrl
    // Use default banner URL if checkbox is checked
    const { error } = await supabase
      .from("articles")
      .update({ title, excerpt, content, image_url: finalUrl })  
      .eq("id", id)
    setSaving(false)
    // Reset saving state
    if (error) {
      setErrorMsg(error.message)
    } else {
      toast({ title: "Article updated." })
      router.push(`/articles/${id}`)
    }
  }

  // Handle delete action
  const handleDelete = async () => {
    // Confirm deletion
    if (!confirm("Are you sure you want to delete this article? This cannot be undone.")) return
    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", id)
    // Delete article from Supabase
      if (error) {
      alert("Failed to delete: " + error.message)
    } else {
      toast({ title: "Article deleted." })
      router.push("/articles")
    }
  }

  // Render loading state
  if (loading) return <p className="text-center py-10">Loading…</p>

  // Render error state
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Article</h1>
      {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
      <form onSubmit={handleSave} className="space-y-4">
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

        {/* Include excerpt */}
        <div>
          <label className="block text-sm font-medium">Excerpt</label>
          <Textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            disabled={saving}
            rows={3}
          />
        </div>

        {/* Render main content */}
        <div>
          <label className="block text-sm font-medium">Content</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            theme="snow"
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "blockquote"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link"]  // ✅ EDIT: removed image upload option
              ],
            }}
          />
        </div>

        {/* Image URL & default banner */}
        <div>
          <label className="flex items-center text-sm font-medium">Image URL
            <Tooltip>
              <TooltipTrigger asChild>
                {/* Tooltip for image URL input */}
                <button
                  type="button"
                  className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs"
                  aria-label="Image URL help"
                >
                  ?
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" align="start" className="max-w-xs">
                {/* Tooltip content */}
                <p className="text-sm">
                  Paste a shareable image URL. If it fails, the default banner will display.
                </p>
              </TooltipContent>
            </Tooltip>
          </label>
          {/* Input for image URL */}
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={saving || useDefaultBanner}
          />
          {/* Checkbox for default banner */}
          <div className="mt-2 flex items-center">
            <input
              id="useDefaultBanner"
              type="checkbox"
              checked={useDefaultBanner}
              onChange={(e) => setUseDefaultBanner(e.target.checked)}
              disabled={saving}
              className="h-4 w-4"
            />
            {/* Label for checkbox */}
            <label htmlFor="useDefaultBanner" className="ml-2 text-sm">
              Use default VERIVOX banner
            </label>
          </div>
        </div>

        {/* Save Changes button */}
        <Button
          type="submit"
          disabled={saving}
          className="bg-gray-500 text-white hover:bg-gray-400"  // ✅ EDIT: Save Changes button is now a mid-tone grey
        >
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </form>

      {/* Delete button */}
      <div className="mt-6">
        <Button
          size="sm"
          className="bg-harvard-crimson text-white hover:bg-harvard-crimson/90"
          onClick={handleDelete}
        >
          Delete Article
        </Button>
      </div>
    </div>
  )
}
