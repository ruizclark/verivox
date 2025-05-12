// File: app/articles/page.tsx

// Import necessary modules and components
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { format } from "date-fns"

// Define the type for the article data
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

// Define the props for the ArticlesPage component
interface Props {
  searchParams: { search?: string; page?: string }
}

// Define the ArticlesPage component
export default async function ArticlesPage({ searchParams }: Props) {
  const searchTerm = searchParams.search?.trim() || ""
  const pageSize     = 9
  const pageNumber   = parseInt(searchParams.page || "1", 10)
  const from         = (pageNumber - 1) * pageSize
  const to           = pageNumber * pageSize - 1

  // Fetch articles from the database
  let query = supabaseAdmin
    .from("articles")
    .select(
      "id, title, author_name, author_id, date, category, image_url, excerpt, featured",
      { count: "exact" }
    )

  // Apply filters based on search term
  if (searchTerm) {
    const filter = `%${searchTerm}%`
    query = query.or(`title.ilike.${filter},content.ilike.${filter}`)
  }

  // Apply sorting and pagination
  const { data, error, count } = await query
    .order("date", { ascending: false })
    .range(from, to)

  // Handle loading and error states
  if (error) {
    return <p className="text-red-500">Error loading articles: {error.message}</p>
  }

  // If no articles found, return a message
  const articles   = (data as Article[] | null) || []
  const totalCount = count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  // Fetch author profiles
  const authorIds = Array.from(new Set(articles.map((a) => a.author_id)))
  // Fetch profiles for the authors
  const { data: profilesData } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name")
    .in("id", authorIds)
  // Handle loading and error states
  const profileMap: Record<string, string> = {}
  // Create a map of author IDs to full names
  profilesData?.forEach((p) => {
    // Check if the profile ID exists in the articles
    profileMap[p.id] = p.full_name
  })

  // Separate featured and other articles
  const featured = articles.find((a) => a.featured)
  // Filter out featured articles from the main list
  const others   = articles.filter((a) => !a.featured)

  // Get unique years from the articles
  const yearsSet = new Set<string>()
  articles.forEach((a) => {
    // Extract the year from the article date and add it to the set
    yearsSet.add(new Date(a.date).getFullYear().toString())
  })
  // Convert the set to an array and sort it in descending order
  const years = Array.from(yearsSet).sort((a, b) => Number(b) - Number(a))

  // Render the articles page
  return (
    // This is the main container for the articles page
    <div className="container py-10">
      {/* Header */}
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          {/* Title and Subtitle */}
          <h1 className="font-serif text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            EdLD Community Articles
          </h1>
          {}
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Insights, research, and perspectives from the Doctor of Education Leadership community.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="my-8 flex flex-col gap-4 md:flex-row">
        <form method="GET" className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          {/* Search input field */}
          <Input
            type="search"
            name="search"
            defaultValue={searchTerm}
            placeholder="Search articles..."
            className="w-full pl-8"
          />
        </form>

        {/* Year filter dropdown */}
        <div className="flex gap-2">
          <select
            name="year"
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            {/* Year filter label */}
            <option value="">All Years</option>
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* No articles found */}
      {articles.length === 0 ? (
        <div className="mt-8 text-center text-muted-foreground">
          No articles found.
        </div>
      ) : (
        <>
          {/* Featured Article */}
          {featured && (
            <div className="mb-12">
              {/* Featured article card */}
              <Link href={`/articles/${featured.id}`}>
                <Card className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="grid md:grid-cols-2">
                    <div className="aspect-video md:aspect-auto md:h-full overflow-hidden">
                      {/* Featured article image */}
                      <Image
                        src={featured.image_url}
                        alt={featured.title}
                        width={600}
                        height={400}
                        className="h-full w-full object-cover transition-all hover:scale-105"
                      />
                    </div>
                    {/* Featured article content */}
                    <CardContent className="flex flex-col justify-center p-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          {/* Featured article category */}
                          <span className="inline-flex items-center rounded-full bg-harvard-crimson px-2.5 py-0.5 text-xs font-semibold text-white">
                            Featured
                          </span>
                          <h2 className="font-serif text-2xl font-bold">
                            {featured.title}
                          </h2>
                          {/* Featured article excerpt */}
                          <p className="text-sm text-muted-foreground">
                            By {profileMap[featured.author_id] ?? featured.author_name} •{" "}
                            {format(new Date(featured.date), "MMMM d, yyyy")}
                          </p>
                        </div>
                        <p className="line-clamp-3">{featured.excerpt}</p>
                        {}
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
            {/* Map through the articles and create cards */}
            {others.map((a) => (
              <Link href={`/articles/${a.id}`} key={a.id}>
                {/* Article card */}
                <Card className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="aspect-video overflow-hidden">
                    {/* Article image */}
                    <Image
                      src={a.image_url}
                      alt={a.title}
                      width={400}
                      height={200}
                      className="h-full w-full object-cover transition-all hover:scale-105"
                    />
                  </div>
                  {/* Article content */}
                  <CardContent className="p-4">
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                        {a.category}
                      </span>
                    </div>
                    {/* Article title and author */}
                    <h3 className="font-serif text-lg font-bold">{a.title}</h3>
                    {/* Article excerpt */}
                    <p className="text-sm text-muted-foreground">
                      By {profileMap[a.author_id] ?? a.author_name} •{" "}
                      {format(new Date(a.date), "MMMM d, yyyy")}
                    </p>
                    {/* Article excerpt */}
                    <p className="mt-2 line-clamp-3 text-sm">{a.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                {pageNumber > 1 ? (
                  <Link href={`/articles?search=${encodeURIComponent(
                    searchTerm
                  )}&page=${pageNumber - 1}`}>
                    {/* Previous button */}
                    <Button variant="outline" size="sm">
                      Previous
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                )}

                {/* Pagination buttons */}
                {Array.from({ length: totalPages }, (_, i) => {
                  const p = i + 1
                  const isCurrent = p === pageNumber
                  {/* Check if the page number is within the range of 3 pages from the current page */}
                  return (
                    <Link
                      href={`/articles?search=${encodeURIComponent(
                        searchTerm
                      )}&page=${p}`}
                      key={p}
                    >
                      {/* Pagination button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className={
                          isCurrent
                            ? "bg-harvard-crimson text-white hover:bg-harvard-crimson/90"
                            : ""
                        }
                      >
                        {p}
                      </Button>
                    </Link>
                  )
                })}

                {/* Check if the next page exists */}
                {pageNumber < totalPages ? (
                  <Link href={`/articles?search=${encodeURIComponent(
                    searchTerm
                  )}&page=${pageNumber + 1}`}>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

