// File: app/articles/page.tsx

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

// ✅ EDIT: accept searchParams including pagination
interface Props {
  searchParams: { search?: string; page?: string }
}

export default async function ArticlesPage({ searchParams }: Props) {
  const searchTerm = searchParams.search?.trim() || ""  // ✅ read search query parameter
  const pageSize = 9                                    // ✅ set number of articles per page
  const pageNumber = parseInt(searchParams.page || "1", 10)  // ✅ current page number

  // calculate range for pagination
  const from = (pageNumber - 1) * pageSize
  const to = pageNumber * pageSize - 1

  // build base query with count
  let query = supabaseAdmin
    .from("articles")
    .select(
      "id, title, author_name, author_id, date, category, image_url, excerpt, featured",
      { count: 'exact' }                             // ✅ request exact count
    )

  // filter by search term if provided
  if (searchTerm) {
    const filter = `%${searchTerm}%`
    query = query.or(`title.ilike.${filter},content.ilike.${filter}`)
  }

  // execute query with order and range
  const { data, error, count } = await query
    .order("date", { ascending: false })
    .range(from, to)

  if (error) {
    return <p className="text-red-500">Error loading articles: {error.message}</p>
  }

  const articles = (data as Article[] | null) || []
  const totalCount = count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))  // ✅ calculate total pages

  const featured = articles.find((a) => a.featured)
  const others = articles.filter((a) => !a.featured)

  // derive available years dynamically
  const yearsSet = new Set<string>()
  articles.forEach((a) => {
    yearsSet.add(new Date(a.date).getFullYear().toString())
  })
  const years = Array.from(yearsSet).sort((a, b) => Number(b) - Number(a))

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

      {/* Search & Filters */}
      <div className="my-8 flex flex-col gap-4 md:flex-row">
        <form method="GET" className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            name="search"                            // name for searchParams
            defaultValue={searchTerm}                  // show current term
            placeholder="Search articles..."
            className="w-full pl-8"
          />
        </form>
        <div className="flex gap-2">
          <select className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
            <option value="">All Categories</option>
            <option value="leadership">Leadership</option>
            <option value="policy">Policy</option>
            <option value="equity">Equity</option>
          </select>
          <select name="year" className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
            <option value="">All Years</option>
            {years.map((yr) => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
        </div>
      </div>

      {/* No articles found message */}
      {articles.length === 0 ? (
        <div className="mt-8 text-center text-muted-foreground">
          No articles found.
        </div>
      ) : (
        <>  
          {/* Featured Article */}
          {featured && (
            <div className="mb-12">
              <Link href={`/articles/${featured.id}`}>
                <Card className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="grid md:grid-cols-2">
                    <div className="aspect-video md:aspect-auto md:h-full overflow-hidden">
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

          {/* ✅ Pagination based on totalPages */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                {/* Previous button */}
                {pageNumber > 1 ? (
                  <Link href={`/articles?search=${encodeURIComponent(searchTerm)}&page=${pageNumber - 1}`}>
                    <Button variant="outline" size="sm">Previous</Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                )}

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => {
                  const p = i + 1
                  const isCurrent = p === pageNumber
                  return (
                    <Link
                      href={`/articles?search=${encodeURIComponent(searchTerm)}&page=${p}`}
                      key={p}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className={isCurrent ? "bg-harvard-crimson text-white hover:bg-harvard-crimson/90" : ""}
                      >
                        {p}
                      </Button>
                    </Link>
                  )
                })}

                {/* Next button */}
                {pageNumber < totalPages ? (
                  <Link href={`/articles?search=${encodeURIComponent(searchTerm)}&page=${pageNumber + 1}`}>
                    <Button variant="outline" size="sm">Next</Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" disabled>Next</Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

