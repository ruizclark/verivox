// app/articles/[id]/ArticleDetailClient.tsx
"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User, Tag, Share2 } from "lucide-react"

// Import the types we exported from page.tsx
import type { Article, RelatedArticle } from "./page"

export default function ArticleDetailClient({
  article,
}: {
  article: Article
}) {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/articles" className="text-harvard-crimson hover:underline">
          ← Back to Articles
        </Link>

        <h1 className="font-serif text-3xl font-bold mt-4">
          {article.title}
        </h1>
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

        {article.image_url && (
          <div className="mb-8 overflow-hidden rounded-lg">
            <Image
              src={article.image_url}
              alt={article.title}
              width={800}
              height={400}
              className="w-full object-cover"
            />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

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

        {article.related.length > 0 && (
          <div className="my-12">
            <h2 className="font-serif text-2xl font-bold mb-6">
              Related Articles
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {article.related.map((rel: RelatedArticle) => (
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
