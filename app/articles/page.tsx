import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function ArticlesPage() {
  return (
    <div className="container py-10">
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

      {/* Search and Filter */}
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
      <div className="mb-12">
        <Link href="/articles/featured">
          <Card className="overflow-hidden transition-all hover:shadow-lg">
            <div className="grid md:grid-cols-2">
              <div className="aspect-video md:aspect-auto md:h-full overflow-hidden">
                <Image
                  src="/placeholder.svg?height=400&width=600&text=Featured+Article"
                  alt="Featured Article"
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition-all hover:scale-105"
                />
              </div>
              <CardContent className="flex flex-col justify-center p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-harvard-crimson text-white">
                      Featured
                    </span>
                    <h2 className="font-serif text-2xl font-bold">
                      Reimagining Educational Leadership for the 21st Century
                    </h2>
                    <p className="text-sm text-muted-foreground">By Dr. Jane Smith • June 15, 2025</p>
                  </div>
                  <p className="line-clamp-3">
                    An in-depth exploration of how educational leadership must evolve to meet the challenges of the 21st
                    century, drawing on research and practice from the field.
                  </p>
                  <Button className="w-fit bg-harvard-crimson hover:bg-harvard-crimson/90">Read Article</Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </Link>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Link href={`/articles/article-${i + 1}`} key={i}>
            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-video overflow-hidden">
                <Image
                  src={`/placeholder.svg?height=200&width=400&text=Article+${i + 1}`}
                  alt={`Article ${i + 1}`}
                  width={400}
                  height={200}
                  className="h-full w-full object-cover transition-all hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <div className="mb-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-muted text-muted-foreground">
                    {i % 3 === 0 ? "Leadership" : i % 3 === 1 ? "Policy" : "Equity"}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold">
                  {i % 3 === 0
                    ? "Transforming Education Through Leadership and Innovation"
                    : i % 3 === 1
                      ? "Policy Implications for Educational Equity in Urban Schools"
                      : "Building Inclusive Learning Environments for All Students"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  By EdLD Member {i + 1} • June {i + 10}, 2025
                </p>
                <p className="mt-2 line-clamp-3 text-sm">
                  {i % 3 === 0
                    ? "An exploration of how educational leadership can drive meaningful change in our schools and communities."
                    : i % 3 === 1
                      ? "Examining the impact of educational policies on equity outcomes in urban school districts."
                      : "Strategies for creating inclusive learning environments that support all students' success."}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination */}
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
