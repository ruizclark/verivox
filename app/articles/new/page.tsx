// File: app/articles/new/page.tsx
"use client"

// ✅ EDIT: Polyfill findDOMNode so React Quill can work under Next.js App Router
import ReactDOM from "react-dom"
// – cast ReactDOM to any so TS lets us assign findDOMNode
if (typeof (ReactDOM as any).findDOMNode !== "function") {
  (ReactDOM as any).findDOMNode = (instance: any): any => instance
}

import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

// ReactQuill only loads on client
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

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
  const [content, setContent] = useState<string>("")      // HTML string from ReactQuill
  const [imageUrl, setImageUrl] = useState("")
  const [category, setCategory] = useState("")
  const [useDefaultBanner, setUseDefaultBanner] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    // ✅ EDIT: strip HTML tags to validate non-empty content
    const plainText = content.replace(/<(.|\n)*?>/g, "").trim()
    if (!title.trim() || !plainText) {
      setErrorMsg("Title and content are required.")
      return
    }

    setLoading(true)

    const currentDate = new Date().toISOString()
    const finalImageUrl = useDefaultBanner
      ? DEFAULT_BANNER_URL
      : imageUrl

    const { data, error } = await supabase
      .from("articles")
      .insert([
        {
          author_id:   session!.user.id,
          author_name: session!.user.user_metadata.full_name || session!.user.email,
          title,
          excerpt,
          content,      // HTML content from editor
          image_url:   finalImageUrl,
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
          <label className="block text-sm font-medium">Excerpt (150-200 Characters Recommended)</label>
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
                // ✅ EDIT: removed 'link' and 'image' options to simplify editor
              ],
            }}
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
                  Right click on any publicly avaiable image on the web and select "Copy Image Address" to get the URL. Broken links will automatically be replaced with the standard VERIVOX banner.
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
