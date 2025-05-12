// File: app/articles/new/page.tsx
"use client"

// Polyfill findDOMNode so React Quill can work under Next.js App Router
import ReactDOM from "react-dom"
// Polyfill for React Quill
if (typeof (ReactDOM as any).findDOMNode !== "function") {
  (ReactDOM as any).findDOMNode = (instance: any): any => instance
}

// Import { useParams } from "next/navigation"
import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
// Import "react-quill/dist/quill.snow.css"
import "react-quill/dist/quill.snow.css"
// Import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"
// Import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
// Import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

// Import { Calendar, User, Share2 } from "lucide-react" // Tag icon removed
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

// Components
export default function NewArticlePage() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()

  // const { toast } = useToast()
  const DEFAULT_BANNER_URL = "/images/verivox-banner.png"

  // const [article, setArticle] = useState<Article | null>(null)
  useEffect(() => {
    if (!session) router.push("/login")
  }, [session, router])

  // const [authorFullName, setAuthorFullName] = useState<string | null>(null)
  const [title, setTitle]               = useState("")
  const [excerpt, setExcerpt]           = useState("")
  const [content, setContent]           = useState<string>("")
  const [imageUrl, setImageUrl]         = useState("")
  const [useDefaultBanner, setUseDefaultBanner] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [errorMsg, setErrorMsg]         = useState("")

  // const [authorSlug, setAuthorSlug]     = useState<string | null>(null)
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    // Validate title and content
    const plainText = content.replace(/<(.|\n)*?>/g, "").trim()
    // Remove HTML tags from content
    if (!title.trim() || !plainText) {
      setErrorMsg("Title and content are required.")
      return
    }

    // Validate excerpt
    setLoading(true)

    // Check if the excerpt is between 150 and 200 characters
    const currentDate = new Date().toISOString()
    const finalImageUrl = useDefaultBanner
      ? DEFAULT_BANNER_URL
      : imageUrl

    // Check if the image URL is valid
    const { data, error } = await supabase
      .from("articles")
      .insert([
        {
          author_id:   session!.user.id,
          author_name: session!.user.user_metadata.full_name || session!.user.email,
          title,
          excerpt,
          content,
          image_url:   finalImageUrl,
          date:        currentDate,
          // ✅ EDIT: removed category from insert
        },
      ])
      .select("id")

    // Check if the article was published successfully
    setLoading(false)

    // Check if the article was published successfully
    if (error) {
      // Handle error
      setErrorMsg(error.message)
      return
    }

    // Check if the article was published successfully
    const newId = data?.[0]?.id
    if (!newId) {
      setErrorMsg("Unable to retrieve the new article ID.")
      return
    }

    // Redirect to the new article page
    router.push(`/articles/${newId}`)
  }

  // Check if the user is logged in
  if (!session) return null

  // Check if the user is loading
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

        {/* Create section for an excerpt */}
        <div>
          <label className="block text-sm font-medium">
            Excerpt (150-200 Characters Recommended)
          </label>
          <Textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            disabled={loading}
            rows={3}
          />
        </div>

        {/* Content (WYSIWYG) */}
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
                ["link", "image"],
              ],
            }}
          />
        </div>

        {/* Image URL with tooltip & default banner */}
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
              {/* Tooltip content */}
              <TooltipContent side="right" align="start" className="max-w-xs">
                <p className="text-sm">
                  Right click on a public web image &ndash; select “Copy Image Address.” If it breaks, we’ll default back to VERIVOX banner.
                </p>
              </TooltipContent>
            </Tooltip>
          </label>
          {/* Image URL input */}
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
