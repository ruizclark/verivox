// app/articles/page.tsx

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase/admin"       // EDIT: import supabaseAdmin

// EDIT: define the shape of an article row
type Article = {
  id: string
  title: string
  author_name: string
  author_id: string
  date: string
  category: string
  image_url: string
  excerpt: string
  featured: boolean
}

export default async function ArticlesPage() {
  // EDIT: fetch all approved articles
  const { data, error } = await supabaseAdmin
    .from("articles")
    .select("id, title, author_name, author_id, date, category, image_url, excerpt, featured")
    .order("date", { ascending: false })

  if (error) {
    return <p className="text-red-500">Error loading articles: {error.message}</p>
  }

  const articles = data as Article[] | null   // EDIT: cast to Article[]

  if (!articles || articles.length === 0) {
    return <p>No articles found.</p>
  }

  const featured = articles.find((a) => a.featured)
  const others   = articles.filter((a) => !a.featured)

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            EdLD Community Articles
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Insights, research, and perspectives from the Doctor of Education Leadership community.
          </p>
        </div>
      </div>

      {/* Search & Filters (unchanged) */}
      <div className="my-8 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search articles..." className="w-full pl-8" />
        </div>
        <div className="flex gap-2">
          <select className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
            <option value="">All Categories</option>
            <option value="leadership">Leadership</option>
            <option value="policy">Policy</option>
            <option value="equity">Equity</option>
          </select>
          <select className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
            <option value="">All Years</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
      </div>

      {/* Featured Article */}
      {featured && (
        <div className="mb-12">
          <Link href={`/articles/${featured.id}`}>
            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <div className="grid md:grid-cols-2">
                <div className="aspect-video md:aspect-auto md:h-full overflow-hidden">
                  {/* EDIT: use real image URL */}
                  <Image
                    src={featured.image_url}
                    alt={featured.title}
                    width={600}
                    height={400}
                    className="h-full w-full object-cover transition-all hover:scale-105"
                  />
                </div>
                <CardContent className="flex flex-col justify-center p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <span className="inline-flex items-center rounded-full bg-harvard-crimson px-2.5 py-0.5 text-xs font-semibold text-white">
                        Featured
                      </span>
                      <h2 className="font-serif text-2xl font-bold">
                        {featured.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        By {featured.author_name} • {featured.date}
                      </p>
                    </div>
                    <p className="line-clamp-3">{featured.excerpt}</p>
                    <Button className="w-fit bg-harvard-crimson hover:bg-harvard-crimson/90">
                      Read Article
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>
        </div>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((a) => (
          <Link href={`/articles/${a.id}`} key={a.id}>
            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-video overflow-hidden">
                <Image
                  src={a.image_url}
                  alt={a.title}
                  width={400}
                  height={200}
                  className="h-full w-full object-cover transition-all hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <div className="mb-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                    {a.category}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold">{a.title}</h3>
                <p className="text-sm text-muted-foreground">
                  By {a.author_name} • {a.date}
                </p>
                <p className="mt-2 line-clamp-3 text-sm">{a.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination (unchanged) */}
      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-harvard-crimson text-white hover:bg-harvard-crimson/90">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
