// app/articles/[id]/page.tsx
"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User, Tag, Share2 } from "lucide-react"
import ArticleDetailClient from "./ArticleDetailClient"

// — EXPORT your types so that ArticleDetailClient.tsx can import them —
export type RelatedArticle = {
  id: string
  title: string
  image_url: string | null
}

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
      .then(({ data, error }) => {
        setLoading(false)
        if (error || !data) {
          setError("Article not found.")
          return
        }

        setArticle({
          ...data,
          image_url: data.image_url?.trim() || null,
          related: (data.related_articles || []).map((r: any) => ({
            id: r.related_article_id.id,
            title: r.related_article_id.title,
            image_url: r.related_article_id.image_url?.trim() || null,
          })),
        })
      })
  }, [id, supabase])

  if (loading) {
    return <p className="text-center py-10">Loading…</p>
  }
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => router.push("/articles")}>
          Back to Articles
        </Button>
      </div>
    )
  }
  if (!article) return null

  // — hand off to your client component for rendering —
  return <ArticleDetailClient article={article} />
}
