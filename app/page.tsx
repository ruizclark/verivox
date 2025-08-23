// File: app/page.tsx

// Import necessary modules and components
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BookOpen, Users, FileText } from "lucide-react"
// Import Supabase client for data fetching
import { supabaseAdmin } from "@/lib/supabase/admin"   
// Import components for UI elements
import { format } from "date-fns" 
// Import date formatter
import RegisterCTA from "@/components/RegisterCTA"
// Import RegisterCTA component for dynamic registration
import AccountLink from "@/components/AccountLink"   

// Import AccountLink component for dynamic account linking
export default async function Home() {                
  // Retch the 3 most recent approved profiles
  const { data: featuredProfiles, error: profErr } = await supabaseAdmin
    .from("profiles")
    .select("id, slug, full_name, photo_url, graduation_year, title, employer")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(3)

  // Check for errors in fetching profiles
  if (profErr) {
    console.error("Error loading featured profiles:", profErr)
  }

  // Fetch the 4 most recent articles
  const { data: latestArticles, error: artErr } = await supabaseAdmin
    .from("articles")
    // ✅ Include author_id so we can resolve name if author_name is an email
    .select("id, title, author_id, author_name, date, image_url, excerpt")
    .order("date", { ascending: false })
    .limit(4)

  // Check for errors in fetching articles
  if (artErr) {
    console.error("Error loading latest articles:", artErr)
  }

  // ✅ If any article's author_name is an email, fetch names from profiles in one batch
  const authorIds =
    (latestArticles ?? [])
      .map((a: any) => a.author_id)
      .filter((v: any): v is string => Boolean(v))

  let authorNameById: Record<string, string> = {}
  if (authorIds.length > 0) {
    const { data: authors, error: authorsErr } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name")
      .in("id", authorIds)

    if (authorsErr) {
      console.error("Error loading author names:", authorsErr)
    } else if (authors) {
      authorNameById = Object.fromEntries(
        authors.map((u: { id: string; full_name: string }) => [u.id, u.full_name])
      )
    }
  }

  // Check if the user is logged in
  return (
    <div className="flex flex-col">
      {/* Hero Section - Updated with clean design */}
      <section className="relative py-20 overflow-hidden bg-white">
        {/* Background Logo - Subtle watermark effect */}
        <div className="absolute right-0 opacity-[0.03] transform translate-x-1/4 -translate-y-1/4 top-0 pointer-events-none">
          <Image
            src="/images/verivox-logo.png"
            alt=""
            width={800}
            height={800}
            className="w-[800px] h-auto"
            aria-hidden="true"
          />
        </div>

        {/* Main Content */}
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                {/* Dynamic AccountLink component for user login */}
                <h1 className="font-serif text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900">
                  Amplifying the Voices of the EdLD Community
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl">
                  A platform showcasing work by students and alumni of Harvard’s Doctorate in Education Leadership (EdLD) program.                </p>
              </div>
              {/* Conditional rendering of AccountLink based on user login status */}
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="bg-harvard-crimson hover:bg-harvard-crimson/90">
                    Join the Community
                  </Button>
                </Link>
                <Link href="/profiles">
                  <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                    Explore Profiles
                  </Button>
                </Link>
              </div>
            </div>
            {/* Logo Section */}
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-harvard-crimson/5 rounded-full"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-harvard-crimson/5 rounded-full"></div>

              {/* Logo with transparent background */}
              <div className="relative bg-white rounded-xl shadow-xl p-8 h-full flex items-center justify-center">
                <Image
                  src="/images/verivox-logo.png"
                  alt="VERIVOX Logo"
                  width={400}
                  height={400}
                  className="w-full max-w-[300px] h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with clean design */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <h2 className="font-serif text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
                Connect with the EdLD Community
              </h2>
              {/* Updated description with clear call to action */}
              <p className="text-gray-600 md:text-xl">
                VERIVOX provides a platform for EdLD students and alumni to showcase their work and connect with each
                other.
              </p>
            </div>
          </div>
          {/* Feature Cards */}
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3 lg:gap-12">
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Users className="h-12 w-12 text-harvard-crimson mb-4" />
                <h3 className="font-serif text-xl font-bold text-gray-900">Member Profiles</h3>
                {/* Updated description with clear call to action */}
                <p className="text-sm text-gray-600 mt-2">
                  Create your professional profile to showcase your work and connect with other EdLD members.
                </p>
                {/* Dynamic link to profiles page */}
                <Link href="/profiles" className="mt-4 inline-flex items-center text-harvard-crimson">
                  View Profiles <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
            {/* Updated description with clear call to action */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <FileText className="h-12 w-12 text-harvard-crimson mb-4" />
                <h3 className="font-serif text-xl font-bold text-gray-900">Publish Articles</h3>
                {/* Descriptoin of purpose */}
                <p className="text-sm text-gray-600 mt-2">
                  Share your research, insights, and experiences with the EdLD community and beyond.
                </p>
                <Link href="/articles" className="mt-4 inline-flex items-center text-harvard-crimson">
                  Read Articles <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
            {/* Call to action for current students and alumni */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <BookOpen className="h-12 w-12 text-harvard-crimson mb-4" />
                <h3 className="font-serif text-xl font-bold text-gray-900">EdLD Community</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Connect with current EdLD students and alumni.
                </p>
                <Link href="/about" className="mt-4 inline-flex items-center text-harvard-crimson">
                  Learn More <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Profiles Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
                Featured Profiles
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl">
                Meet some of our newest VERIVOX members
              </p>
            </div>
          </div>

          {/* Profile Cards */}
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12">
            {featuredProfiles?.map((p) => (
              <Link href={`/${p.slug}`} key={p.id}>
                <Card className="overflow-hidden transition-all hover:shadow-lg border border-gray-200">
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
                  {/* Profile details */}
                  <CardContent className="p-4">
                    <h3 className="font-serif text-lg font-bold text-gray-900">
                      {p.full_name}
                    </h3>
                    {/* ✅ Changed: Graduated → Class of */}
                    <p className="text-sm text-gray-500">
                      Class of {p.graduation_year}
                    </p>
                    <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                      {p.title} at {p.employer}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Button to view all profiles */}
          <div className="flex justify-center">
            <Link href="/profiles">
              <Button variant="outline" className="gap-1 border-gray-300 text-gray-700 hover:bg-gray-50">
                View All Profiles <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
                Latest Articles
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl">
                Insights and research from the EdLD community
              </p>
            </div>
          </div>

          {/* Article Cards */}
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:gap-12">
            {latestArticles?.map((a: any) => {
              const looksLikeEmail =
                typeof a.author_name === "string" && a.author_name.includes("@")
              const displayAuthor =
                looksLikeEmail
                  ? (authorNameById[a.author_id] ?? a.author_name)
                  : a.author_name

              return (
                <Link href={`/articles/${a.id}`} key={a.id}>
                  <Card className="overflow-hidden transition-all hover:shadow-lg border border-gray-200">
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={a.image_url}
                        alt={a.title}
                        width={400}
                        height={200}
                        className="h-full w-full object-cover transition-all hover:scale-105"
                      />
                    </div>
                    {/* Article details */}
                    <CardContent className="p-4">
                      <h3 className="font-serif text-lg font-bold text-gray-900">
                        {a.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        By {displayAuthor} • {format(new Date(a.date), "MMMM d, yyyy")}
                      </p>
                      <p className="mt-2 line-clamp-3 text-sm">
                        {a.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* Button to view all articles */}
          <div className="flex justify-center">
            <Link href="/articles">
              <Button variant="outline" className="gap-1 border-gray-300 text-gray-700 hover:bg-gray-50">
                View All Articles <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section with dynamic Register button */}
      <section className="bg-harvard-crimson py-16 md:py-24">
        <div className="container px-4 md:px-6 text-white">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-3 max-w-3xl">
              <h2 className="font-serif text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                EdLD Network Members
              </h2>
              <p className="md:text-xl">
                If you are a current or former EdLD student, register to connect with fellow members, share your work, and amplify your voice.
              </p>
            </div>
            {/* ✅ EDIT: replaced static Link with RegisterCTA client component */}
            <RegisterCTA />
          </div>
        </div>
      </section>

    </div>
  )
}
