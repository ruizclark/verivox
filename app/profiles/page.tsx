// File: app/profiles/page.tsx

// Import necessary modules and components
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase/admin"

// Include 'slug' in the Profile type
type Profile = {
  id: string
  slug: string
  full_name: string
  photo_url: string
  graduation_year: number
  title: string
  employer: string
  resume_url: string | null
}

// Define the Props type for the component
interface Props {
  searchParams: {
    page?: string
    search?: string
  }
}

// Define the main component
export default async function ProfilesPage({ searchParams }: Props) {
  const pageSize = 12
  // await searchParams before accessing its fields
  const { page: pageParam = "1", search: searchParam = "" } =
    await Promise.resolve(searchParams)

  const pageNumber = parseInt(pageParam, 10)
  const searchTerm = searchParam.trim()

  const from       = (pageNumber - 1) * pageSize
  const to         = pageNumber * pageSize - 1

  // Fetch all graduation_year then dedupe in JS
  const { data: rawCohorts } = await supabaseAdmin
    .from("profiles")
    .select("graduation_year")
    .eq("approved", true)
    .order("graduation_year", { ascending: false })

  // Dedupe years via Set, add explicit type
  const cohorts: number[] = rawCohorts
    ? Array.from(new Set(rawCohorts.map((r: { graduation_year: number }) => r.graduation_year)))
    : []

  // Build base query with count
  let query = supabaseAdmin
    .from("profiles")
    // Select only the fields we need
    .select(
      "id, slug, full_name, photo_url, graduation_year, title, employer, resume_url",
      { count: "exact" }
    )
    // Use `eq` to filter by approved profiles
    .eq("approved", true)

  // If a cohort is selected, filter by graduation_year
  if (searchTerm) {
    const filter = `%${searchTerm}%`
    query = query.or(
      `full_name.ilike.${filter},title.ilike.${filter},about.ilike.${filter}`
    )
  }

  // If a cohort is selected, filter by graduation_year
  const { data, error, count } = await query
    .order("full_name", { ascending: true })
    .range(from, to)

  // If there's an error, return an error message
  if (error) {
    return (
      <p className="text-red-500">
        Error loading profiles: {error.message}
      </p>
    )
  }

  // If no data is returned, return a message
  const profiles   = (data as Profile[] | null) || []
  const totalCount = count  ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  // If no profiles are found, return a message
  return (
    <div className="container py-10">
      {/* Header */}
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            EdLD Community Profiles
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Connect with current students and alumni from the Doctor of Education Leadership program.
          </p>
        </div>
      </div>

      {/* Search & Cohort Filter */}
      <div className="my-8 flex flex-col gap-4 md:flex-row">
        <form method="GET" className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            name="search"
            defaultValue={searchTerm}
            placeholder="Search profiles..."
            className="w-full pl-8"
          />
        </form>
        {/* Cohort Filter */}
        <div className="flex gap-2">
          <select
            name="cohort"
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            {/* EDIT: default value to empty string */}
            <option value="">All Cohorts</option>
            {/* Explicit type on yr */}
            {cohorts.map((yr: number) => (
              <option key={yr} value={yr}>
                Class of {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* No Results Found */}
      {profiles.length === 0 ? (
        <div className="mt-8 text-center text-muted-foreground">
          No results found.
        </div>
      ) : (
        <>
          {/* Profiles Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {profiles.map((p) => (
              <Link href={`/${p.slug}`} key={p.id}>
                <Card className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="aspect-square overflow-hidden">
                    {/* Fallback to placeholder if no photo */}
                    <Image
                      src={p.photo_url || "/images/placeholder.png"}
                      alt={p.full_name}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover transition-all hover:scale-105"
                    />
                  </div>
                  {/* Card Content */}
                  <CardContent className="p-4">
                    <h3 className="font-serif text-lg font-bold">{p.full_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Class of {p.graduation_year}
                    </p>
                    <p className="mt-2 line-clamp-3 text-sm">
                      {p.title} at {p.employer}
                    </p>
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
                  <Link href={`/profiles?search=${encodeURIComponent(searchTerm)}&page=${pageNumber - 1}`}>
                    <Button variant="outline" size="sm">Previous</Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                )}
                {/* Pagination Buttons */}
                {Array.from({ length: totalPages }, (_, i) => {
                  const p = i + 1
                  const isCurrent = p === pageNumber
                  return (
                    <Link
                      href={`/profiles?search=${encodeURIComponent(searchTerm)}&page=${p}`}
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
                {/* Next Button */}
                {pageNumber < totalPages ? (
                  <Link href={`/profiles?search=${encodeURIComponent(searchTerm)}&page=${pageNumber + 1}`}>
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
