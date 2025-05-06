// File: app/articles/[id]/page.tsx
"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User, Tag, Share2 } from "lucide-react"

// — Types for related articles and article shape —
type RelatedArticle = {
  id: string
  title: string
  image_url: string | null
}

type Article = {
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

export default function ArticlePage() {
  const { id } = useParams()!
  const supabase = useSupabaseClient()
  const router = useRouter()

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)

    supabase
      .from("articles")
      .select(
        `
        id,
        title,
        author_name,
        author_id,
        date,
        category,
        image_url,
        content
        `
      )
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        setLoading(false)
        if (error || !data) {
          setError("Article not found.")
        } else {
          setArticle({
            ...data,
            image_url: data.image_url?.trim() || null,
            related: [] // placeholder for future related articles
          })
        }
      })
  }, [id, supabase])

  if (loading) return <p className="text-center py-10">Loading…</p>
  if (error)
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => router.push("/articles")}>Back to Articles</Button>
      </div>
    )
  if (!article) return null

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        {/* ← Back to list */}
        <Link href="/articles" className="text-harvard-crimson hover:underline">
          ← Back to Articles
        </Link>

        {/* Title */}
        <h1 className="font-serif text-3xl font-bold mt-4">
          {article.title}
        </h1>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground my-2">
          <User className="h-4 w-4" />
          <Link
            href={`/profiles/${article.author_id}`}
            className="hover:text-harvard-crimson hover:underline"
          >
            {article.author_name}
          </Link>
          <Calendar className="h-4 w-4 ml-4" />
          <span>{article.date}</span>
          <Tag className="h-4 w-4 ml-4" />
          <span>{article.category}</span>
        </div>

        {/* Hero banner with constrained size */}
        <div className="mb-8 mx-auto max-w-3xl h-auto overflow-hidden rounded-lg aspect-video">
          <Image
            src={article.image_url ?? "/images/verivox-banner.png"}
            alt={article.title}
            fill
            unoptimized                      // fetch public URL directly
            className="object-cover"
          />
        </div>

        {/* Article Content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Share & profile */}
        <div className="my-8 flex items-center justify-between border-t border-b py-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Share this article:</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
          </div>
          <Link href={`/profiles/${article.author_id}`}>
            <Button variant="outline" size="sm">
              View Author Profile
            </Button>
          </Link>
        </div>

        {/* Related Articles (future) */}
      </div>
    </div>
  )
}