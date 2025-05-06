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

// Types for Article and RelatedArticle
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
  // ✅ EDIT: track if custom image fails to load
  const [imgError, setImgError] = useState(false)

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
        content,
        related_articles!related_articles_article_id_fkey (
          related_article_id (
            id,
            title,
            image_url
          )
        )
      `
      )
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
        <Button onClick={() => router.push("/articles")}>Back to Articles</Button>
      </div>
    )
  }
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

        {/* Meta */}
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

        {/* ✅ EDIT: Banner confined to fixed height */}
        <div className="mb-8 mx-auto w-full max-w-4xl h-64 relative overflow-hidden rounded-lg">
          {!imgError && article.image_url ? (
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              unoptimized
              className="object-cover"
              onError={() => setImgError(true)} // fallback on load error
            />
          ) : (
            <Image
              src="/images/verivox-banner.png"
              alt="VERIVOX Banner"
              fill
              unoptimized
              className="object-cover"
            />
          )}
        </div>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Share & Profile */}
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

        {/* Related Articles */}
        {article.related.length > 0 && (
          <div className="my-12">
            <h2 className="font-serif text-2xl font-bold mb-6">
              Related Articles
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {article.related.map((rel) => (
                <Link href={`/articles/${rel.id}`} key={rel.id}>
                  <Card className="overflow-hidden hover:shadow-lg transition">
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
                    <CardContent className="p-4">
                      <h3 className="font-serif text-lg font-bold">
                        {rel.title}
                      </h3>
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