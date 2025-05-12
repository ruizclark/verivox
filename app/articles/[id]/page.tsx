// File: app/articles/[id]/page.tsx
"use client"

// Import { useParams } from "next/navigation"
import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User, Share2 } from "lucide-react" // Tag icon removed
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

// Components
export type RelatedArticle = {
  id: string
  title: string
  image_url: string | null
}

// Article type
export type Article = {
  id: string
  title: string
  author_name: string
  author_id: string
  date: string
  category: string
  image_url: string | null
  content: string
  related: RelatedArticle[]
}

// ArticlePage component
export default function ArticlePage() {
  const { id } = useParams()!
  const supabase = useSupabaseClient()
  const router = useRouter()
  const { toast } = useToast()

  // const { id } = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [authorFullName, setAuthorFullName] = useState<string | null>(null)
  const [authorSlug, setAuthorSlug] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imgError, setImgError] = useState(false)

  // const router = useRouter()
  useEffect(() => {
    if (!id) return
    setLoading(true)

    // Fetch article data from Supabase
    supabase
      .from("articles")
      .select(`
        id,
        title,
        author_name,
        author_id,
        date,
        category,
        image_url,
        content,
        related_articles!related_articles_article_id_fkey (
          related_article_id (
            id,
            title,
            image_url
          )
        )
      `)
      .eq("id", id)
      .single()
      .then(async ({ data, error }) => {
        setLoading(false)
        if (error || !data) {
          setError("Article not found.")
          return
        }
        // Check if the article is published
        setArticle({
          ...data,
          image_url: data.image_url?.trim() || null,
          related: (data.related_articles || []).map((r: any) => ({
            id: r.related_article_id.id,
            title: r.related_article_id.title,
            image_url: r.related_article_id.image_url?.trim() || null,
          })),
        })

        // Fetch author profile data
        const { data: profile, error: profErr } = await supabase
          .from("profiles")
          .select("full_name, slug")
          .eq("id", data.author_id)
          .single()
        if (!profErr && profile) {
          if (profile.full_name) setAuthorFullName(profile.full_name)
          if (profile.slug)     setAuthorSlug(profile.slug)
        }
      })
  }, [id, supabase])

  // Handle image error
  if (loading) {
    return <p className="text-center py-10">Loading…</p>
  }
  // Handle error
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => router.push("/articles")}>Back to Articles</Button>
      </div>
    )
  }
  // Handle article not found
  if (!article) return null

  // Handle article not found
  const displayName = authorFullName || article.author_name
  const formattedDate = format(new Date(article.date), "MMMM d, yyyy")
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({ title: "Link copied to clipboard!" })
  }
  // Handle author slug
  const profileHref = authorSlug
    ? `/${authorSlug}`
    : `/profiles/${article.author_id}`

  // Handle article image
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <Link href="/articles" className="text-harvard-crimson hover:underline">
          ← Back to Articles
        </Link>

        {/* Re-insert Edit Article button */}
        <div className="my-4">
        <Link href={`/articles/${id}/edit`}>
          <Button
            variant="outline"
            size="sm"
            className="bg-harvard-crimson text-white hover:bg-harvard-crimson/90 hover:text-white"  // keep text white on hover
          >
            Edit Article
          </Button>
        </Link>
        </div>

        {/* Article title */}
        <h1 className="font-serif text-3xl font-bold mt-4">{article.title}</h1>

        {/* Author and date */} 
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground my-2">
          <User className="h-4 w-4" />
          <Link
            href={profileHref}
            className="hover:text-harvard-crimson hover:underline"
          >
            {displayName}
          </Link>
          <Calendar className="h-4 w-4 ml-4" />
          <span>{formattedDate}</span>
          {/* Category text without icon */}
          <span className="ml-4">{article.category}</span>
        </div>

        {/* Article image */}
        <div className="mb-8 mx-auto w-full max-w-4xl h-64 relative overflow-hidden rounded-lg">
          {!imgError && article.image_url ? (
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              unoptimized
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            // Fallback image if article image fails to load
            <Image
              src="/images/verivox-banner.png"
              alt="VERIVOX Banner"
              fill
              unoptimized
              className="object-cover"
            />
          )}
        </div>

        {/* Article content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Share and author profile buttons */}
        <div className="my-8 flex items-center justify-between border-t border-b py-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Share this article:</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
          </div>
          {/* Author profile button */}
          <Link href={profileHref}>
            <Button variant="outline" size="sm">
              View Author Profile
            </Button>
          </Link>
        </div>

        {/* Related articles */}
        {article.related.length > 0 && (
          <div className="my-12">
            <h2 className="font-serif text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Map through related articles and display them */}
              {article.related.map((rel) => (
                // Check if related article has an image
                <Link href={`/articles/${rel.id}`} key={rel.id}>
                  {/* Card component for each related article */}
                  <Card className="overflow-hidden hover:shadow-lg transition">
                    {/* Image for related article */}
                    {rel.image_url && (
                      <div className="aspect-video overflow-hidden">
                        <Image
                          src={rel.image_url}
                          alt={rel.title}
                          width={400}
                          height={200}
                          className="w-full object-cover"
                        />
                      </div>
                    )}
                    {/* Card content */}
                    <CardContent className="p-4">
                      <h3 className="font-serif text-lg font-bold">{rel.title}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
